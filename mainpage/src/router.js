import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomeDocente from './pages/Docente/HomeDocente.vue'
import HomeAdministrador from './pages/Administrador/HomeAdmin.vue'
import HomeWebMaster from './pages/WebMaster/HomeWebMaster.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/docente', component: HomeDocente },
  { path: '/administrador', component: HomeAdministrador },
  { path: '/webmaster', component: HomeWebMaster }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router