import Vue from 'vue';
import VueRouter from 'vue-router';

import Room from '../pages/Room.vue';
import Thermostat from '../pages/Thermostat.vue';

Vue.use(VueRouter);

export default new VueRouter({
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
  }
);


