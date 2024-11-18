import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

self.__WB_DISABLE_DEV_LOGS = true;

const OFFLINE_PAGE = "/offline.html";
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.origin === "https://hacker-news.firebaseio.com",
  new NetworkFirst({
    cacheName: "hn-api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 5,
  })
);

registerRoute(
  ({ url }) => url.origin === "https://hn.algolia.com",
  new NetworkFirst({
    cacheName: "algolia-api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 5,
  })
);

self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  if (event.request.url.includes("hacker-news.firebaseio.com")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).catch(
          () =>
            new Response(
              JSON.stringify({ error: "You are offline. Data not available." }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            )
        );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          if (response.ok && event.request.url.startsWith("http")) {
            return caches.open("hn-cache").then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
        })
      );
    })
  );
});
