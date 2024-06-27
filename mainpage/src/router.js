import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import FakeLogin from './pages/FakeLogin.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage, props: true },
  { path: '/:userType/:rut', name: 'HomePage', component: HomePage, props: true, meta: { requiresAuth: true } },
  { path: '/login/:userType', component: FakeLogin, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = document.cookie.split(';').some((item) => item.trim().startsWith('session='));

  if (requiresAuth && !isAuthenticated) {
    router.push({ name: 'landing', params: { userType: 'no-autetnicado' } });
  } else {
    next();
  }
});

export default router;