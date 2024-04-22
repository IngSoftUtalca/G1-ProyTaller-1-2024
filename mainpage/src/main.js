import App from './App.vue';
import Vue from 'vue';
import Router from 'vue-router';
import Sala from '@/components/Marcar_asistencia.vue';
import { createApp } from 'vue' ;
import { createRouter, createWebHistory } from 'vue-router';



Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/sala/:id',
      name: 'Sala',
      component: Sala,
      props: true
    }
  ],
  mode: 'history'
});

createApp(App).use(router).mount('#app')