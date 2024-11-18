import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("[SW] Registered successfully"))
    .catch((error) => console.error("[SW] Registration failed:", error));
}

createApp(App).use(router).mount("#app");
