/* ㄆㄆ大王 — 離線快取
   改過 index.html 之後，把下面的版本號 +1，重新整理就會拿到新版。 */
const VERSION = "v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // 自己的檔案：先給快取（開得快、沒網路也能開），背景再抓新版
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const fresh = fetch(req).then((res) => {
          if (res && res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        }).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  // 字型等外部資源：先連線，失敗才用快取
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok && url.hostname.endsWith("gstatic.com")) {
        caches.open(VERSION).then((c) => c.put(req, res.clone()));
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
