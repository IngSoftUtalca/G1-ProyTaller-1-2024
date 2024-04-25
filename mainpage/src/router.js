import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomeDocente from './pages/Docente/HomeDocente.vue'
import HomeAdministrador from './pages/Administrador/HomeAdmin.vue'
import HomeWebMaster from './pages/WebMaster/HomeWebMaster.vue'
import FakeLogin from './pages/FakeLogin.vue'

const routes = [
  { path: '/', name:'landing', component: LandingPage, props: true},
  { path: '/docente/:rut', name:'docente', component: HomeDocente, props: true },
  { path: '/administrador/:rut', name:'administrador',component: HomeAdministrador, props: true },
  { path: '/webmaster/:rut', name:'webmaster',component: HomeWebMaster, props: true },
  { path: '/login/:userType', component: FakeLogin },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router