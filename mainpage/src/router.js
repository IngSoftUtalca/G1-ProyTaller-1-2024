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
    ENDPOINTS.login-docente,
    ENDPOINTS.login-WM,
    ENDPOINTS.login-admin,
    ENDPOINTS.mainpage
  ];

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = document.cookie.split(';').some((item) => item.trim().startsWith('session='));
  
  const isFromAllowed = allowedEndpoints.includes(from.path);

  console.log('cookie', document.cookie);
  console.log('to', to);
  console.log('from', from);
  console.log('requiresAuth', requiresAuth);
  console.log('isAuthenticated', isAuthenticated);
  console.log('isFromAllowed', isFromAllowed);

  if ((!isAuthenticated || !isFromAllowed) && requiresAuth) {
    next({ name: 'landing' }); 
  } else {
    next();
  }
});

export default router;