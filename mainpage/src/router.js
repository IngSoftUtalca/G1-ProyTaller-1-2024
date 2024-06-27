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
    const ID = document.cookie.split(';').find((c) => c.trim().startsWith('id=')).split('=')[1];
    const userType = to.params.userType;
    const rut = to.params.rut;
    console.log(ID, userType, rut);
    if (ID === rut) {
      next();
    }
    router.push({ name: 'landing', params: { userType: 'no-autenticado' } });
  } else {
    next();
  }
});

export default router;