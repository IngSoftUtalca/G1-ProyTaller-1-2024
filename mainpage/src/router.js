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

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // Aquí deberías verificar si el usuario está autenticado.
  // Esto es solo un ejemplo, deberás implementar tu propia lógica de autenticación.
  const isAuthenticated = document.cookie.split(';').some((item) => item.trim().startsWith('session='));

  if (requiresAuth && !isAuthenticated) {
    // Redirige al usuario a la página de inicio de sesión de tu microservicio PHP
    // Asegúrate de reemplazar esta URL con la URL correcta de tu página de inicio de sesión.
    window.location.href = "https://huemul.utalca.cl/sso/login.php";
  } else {
    next();
  }
});

export default router;