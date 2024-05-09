import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import FakeLogin from './pages/FakeLogin.vue'

const routes = [
  { path: '/', name:'landing', component: LandingPage, props: true},
  { path: '/:userType/:rut', name:'HomePage',component: HomePage, props: true },
  { path: '/login/:userType', component: FakeLogin },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router