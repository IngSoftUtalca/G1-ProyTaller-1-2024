import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import HomePage from './pages/HomePage.vue'
import FakeLogin from './pages/FakeLogin.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage, props: true },
  { path: '/:userType/:rut', name: 'HomePage', component: HomePage, props: true, meta: { requiresAuth: true } },
  { path: '/login/:userType', component: FakeLogin },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    next();
    return;
  }

  const query = to.query;
  if (!query.flag || !query.iv || !process.env.VUE_APP_FLAG || !process.env.VUE_APP_KEY) {
    next('/landing');
    return;
  }

  const encryptedFlag = query.flag.replace(/\s/g, '+');
  const iv = atob(query.iv.replace(/\s/g, '+'));
  const tag = query.tag ? atob(query.tag.replace(/\s/g, '+')) : '';

  const FLAG = process.env.VUE_APP_FLAG;
  const KEY = adjustKey(process.env.VUE_APP_KEY);

  try {
    const keyBuffer = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(KEY),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const ivArray = new Uint8Array([...iv].map(char => char.charCodeAt(0)));
    const encryptedData = new Uint8Array([...encryptedFlag].map(char => char.charCodeAt(0)));
    const tagArray = new Uint8Array([...tag].map(char => char.charCodeAt(0)));

    const encryptedDataWithTag = new Uint8Array(encryptedData.length + tagArray.length);
    encryptedDataWithTag.set(encryptedData);
    encryptedDataWithTag.set(tagArray, encryptedData.length);

    const decryptedFlag = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivArray,
      },
      keyBuffer,
      encryptedDataWithTag
    );

    const decryptedFlagText = new TextDecoder().decode(decryptedFlag);

    if (decryptedFlagText === FLAG) {
      next();
    } else {
      next('/landing');
    }
  } catch (e) {
    console.error("Error decrypting the flag", e);
    next();
  }
});

function adjustKey(key, desiredLength = 16) {
  let keyBytes = new TextEncoder().encode(key);

  if (keyBytes.length > desiredLength) {
    keyBytes = keyBytes.slice(0, desiredLength);
  } else while (keyBytes.length < desiredLength) {
    const temp = new Uint8Array(desiredLength);
    temp.set(keyBytes);
    keyBytes = temp;
  }

  return new TextDecoder().decode(keyBytes);
}

export default router;