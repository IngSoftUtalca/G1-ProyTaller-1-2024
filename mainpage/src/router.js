import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import FakeLogin from './pages/FakeLogin.vue'


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

router.beforeEach(async (to, from, next) => {
  const query = to.query;
  const encryptedFlag = query.flag;
  const iv = query.iv ? atob(query.iv) : null;
  const tag = query.tag ? atob(query.tag) : null;

  const FLAG = process.env.FLAG;
  const KEY = process.env.KEY;

  if (encryptedFlag && iv && tag && KEY) {
    const keyBuffer = await crypto.subtle.importKey("raw", new TextEncoder().encode(KEY), { name: "AES-GCM" }, false, ["decrypt"]);
    try {
      const decryptedFlag = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv.split('').map(char => char.charCodeAt(0))), tagLength: 128, additionalData: new Uint8Array(tag.split('').map(char => char.charCodeAt(0))) }, keyBuffer, new Uint8Array(atob(encryptedFlag).split('').map(char => char.charCodeAt(0))));

      const decoder = new TextDecoder();
      const decryptedFlagText = decoder.decode(decryptedFlag);

      console.log("Flag desencriptada:", decryptedFlagText);
      console.log("Flag esperada:", FLAG);

      if (decryptedFlagText === FLAG) {
        next();
      } else {
        next({ name: 'landing' });
      }
    } catch (e) {
      console.error("Error al desencriptar la flag", e);
      next({ name: 'landing' });
    }
  } else {
    next();
  }
});

export default router;