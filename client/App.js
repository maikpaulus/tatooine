import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

import App from './App.vue';

import Room from './pages/Room.vue';
import Thermostat from './pages/Thermostat.vue';
import Login from './pages/Login.vue';
import { runInNewContext } from 'vm';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);

Vue.config.devtools = true;

// routiner object and configuration
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { 
      path: '/', component: Room, props: {
        name: 'Badezimmer',
        image: '/assets/img/badezimmer.jpg'
      },
    },
    {
      path: '/device/thermostat/:mac', component: Thermostat, props: true
    }
  ]
});

// store object and configuration
const store = new Vuex.Store({
  // initial application state
  state: {
      // weather state
      stationId: 1,
      weather: {},
      forecast: {
        data: [],
        range: {}
      },
      dataLoaded: false,
      forecastLoaded: false,
      forecastEnabled: true
  },

  getters: {
    get: (state, getters) => (name) => {
      return state[name];
    }
  },

  // store mutations which are just available from actions
  mutations: {
    changeStationId (state, stationId) {
      Vue.set(state, 'stationId', stationId);
    },

    changeWeatherData (state, weatherData) {
      Vue.set(state, 'weather', weatherData);
    },

    changeWeatherForecast (state, forecast) {
      Vue.set(state, 'forecast', {
        data: forecast.forecast,
        range: forecast.range
      });
    },

    dataIsLoading (state) {
      Vue.set(state, 'dataLoaded', false);
    },

    forecastIsLoading (state) {
      Vue.set(state, 'forecastLoaded', false);
    },

    dataLoaded (state) {
      Vue.set(state, 'dataLoaded', true);
    },

    forecastLoaded (state) {
      Vue.set(state, 'forecastLoaded', true);
    },
  },

  // store actions which are used in UI
  actions: {
    fetchWeatherData: (context) => {
      context.commit('dataIsLoading');

      Vue.http.get('/weather/local')
        .then(response => {
          context.commit('changeWeatherData', response.body.response.current);
          context.commit('dataLoaded');
        }, response => {
          console.log(response);
        });
     },

     fetchWeatherForecast: (context) => {
      context.commit('forecastIsLoading');

      Vue.http.get('/weather/forecast')
        .then(response => {
          context.commit('changeWeatherForecast', response.body.response);
          context.commit('forecastLoaded');
        }, response => {
          console.log(response);
        });
     },

    changeStationId (context, stationId) {
      context.commit('changeStationId', stationId);
      
      if (!context.state.weather[stationId]) {
        context.dispatch('fetchWeatherData', stationId);
      }
    }
  }
});

new Vue({
	el: '#app',
  store,
  router,
	render: h => h(App)
});

/*if (module.hot) {
  console.log(module.hot);
  module.hot.accept('./pages/Room.vue', function() {
    console.log('Accepting the updated printMe module!');
  })
};*/