import 'jquery'
import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import MarcarAsistencia from './Paginas/MarcarAsistencia.vue'
import ClaseIniciada from './Paginas/clase_iniciada.vue'
import ErrorAsistencia from './Paginas/error_de_asistencia.vue'
import ReportarError from './Paginas/reportar_error.vue'
import App from './App.vue' // Asegúrate de que la ruta a App.vue es correcta

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/sala:idSala',
      name: 'MarcarAsistencia',
      component: MarcarAsistencia
    },
    {
      path: '/error',
      name: 'ErrorAsistencia',
      component: ErrorAsistencia
    },
    {
      path: '/claseinicio',
      name: 'ClaseIniciada',
      component: ClaseIniciada

    },
    {
      path: '/reporte',
      name: 'ReporteError',
      component: ReportarError
    }
  ]
})

createApp(App).use(router).mount('#app')