import 'jquery'
import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import MarcarAsistencia from './Paginas/MarcarAsistencia.vue'
import App from './App.vue' // Asegúrate de que la ruta a App.vue es correcta

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/sala:idSala',
      name: 'MarcarAsistencia',
      component: MarcarAsistencia
    }
  ]
})

createApp(App).use(router).mount('#app')