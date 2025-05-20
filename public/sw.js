// Service Worker para PWA e notificações push

// Cache de arquivos para funcionamento offline
const CACHE_NAME = "agropec-v1"
const urlsToCache = ["/", "/mapa", "/programacao", "/expositores", "/notificacoes"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Gerenciamento de notificações push
self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json()

      const options = {
        body: data.message || data.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-96x96.png",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.id || "1",
          url: data.url || "/",
        },
        actions: [
          {
            action: "explore",
            title: "Ver detalhes",
            icon: "/icons/checkmark.png",
          },
          {
            action: "close",
            title: "Fechar",
            icon: "/icons/xmark.png",
          },
        ],
      }

      event.waitUntil(self.registration.showNotification(data.title, options))
    } catch (error) {
      console.error("Erro ao processar notificação push:", error)
    }
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    const url = event.notification.data.url || "/"

    event.waitUntil(clients.openWindow(url))
  }
})
