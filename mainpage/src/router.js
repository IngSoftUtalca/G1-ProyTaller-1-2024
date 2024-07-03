import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import FakeLogin from './pages/FakeLogin.vue'
import ENDPOINTS from '../../ENPOINTS.json'


const routes = [
  { path: '/', name: 'landing', component: LandingPage, props: true },
  { path: '/:userType/:rut', name: 'HomePage', component: HomePage, props: true, meta: { requiresAuth: true } },
  { path: '/login/:userType', component: FakeLogin},
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  const allowedEndpoints = [
    ENDPOINTS['login-docente'],
    ENDPOINTS['login-WM'],
    ENDPOINTS['login-admin'],
    ENDPOINTS['mainpage']
  ];

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = document.cookie.split(';').some((item) => item.trim().startsWith('session='));
  
  const isFromAllowed = allowedEndpoints.includes(from.path);

  if (requiresAuth && !isAuthenticated) {
    const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('id='));
    if (cookie) {
      const ID = cookie.split('=')[1];
      const userType = to.params.userType;
      const rut = to.params.rut;
      console.log(ID, userType, rut);
      if (ID === rut) {
        next();
        return; // Ensure that the next middleware or navigation guard is not called after this
      }
    }
    router.push({ name: 'landing', params: { userType: 'no-autenticado' } });
  } else {
    next();
  }
});

export default router;