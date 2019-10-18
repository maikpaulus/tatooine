import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import VueResource from 'vue-resource';


declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    http: any
  }
}

Vue.use(Vuex);
Vue.use(VueResource);

export type RootState = {
    stationId: number,
    weather: {},
      forecast: {
        data: Array<any>,
        range: {}
      },
      dataLoaded: boolean,
      forecastLoaded: boolean,
      forecastEnabled: boolean
}

const store: StoreOptions<RootState> = new Vuex.Store({
    state: {
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
    fetchWeatherData: (context: any) => {
      context.commit('dataIsLoading');

      Vue.http.get('/weather/local')
        .then(response => {
          context.commit('changeWeatherData', response.body.response.current);
          context.commit('dataLoaded');
        }, response => {
          console.log(response);
        });
     },

     fetchWeatherForecast: (context: any) => {
      context.commit('forecastIsLoading');

      Vue.http.get('/weather/forecast')
        .then(response => {
          context.commit('changeWeatherForecast', response.body.response);
          context.commit('forecastLoaded');
        }, response => {
          console.log(response);
        });
     },

    changeStationId (context: any, stationId: number) {
      context.commit('changeStationId', stationId);
      
      if (!context.state.weather[stationId]) {
        context.dispatch('fetchWeatherData', stationId);
      }
    }
  }
});

export default new Vuex.Store<RootState>(store);