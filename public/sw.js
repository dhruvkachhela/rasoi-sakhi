// public/sw.js - Service Worker for Browser Push Notifications
// This file runs in the browser background.
// Intercepts push events from the server and shows native phone notifications.

'use strict';

self.addEventListener('push', function(event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  var title = data.title || 'Rasoi Sakhi';
  var body = data.body || 'You have a new notification!';
  var icon = self.location.origin + '/assets/logo.jpg';
  var badge = self.location.origin + '/assets/logo.jpg';
  var openUrl = data.url || '/#admin-section';

  var options = {
    body: body,
    icon: icon,
    badge: badge,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      url: openUrl,
      orderId: data.orderId
    }
  };

  // Only assign tag if explicitly provided and not the default fallback,
  // preventing notifications from overwriting each other in the system tray.
  if (data.tag && data.tag !== 'rasoi-sakhi-notification') {
    options.tag = data.tag;
    options.renotify = true;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Immediately activate the service worker once installed
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Claim clients immediately upon activation to ensure latest worker is active
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var openUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/#admin-section';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.indexOf('admin-section') !== -1 && 'focus' in client) {
          client.focus();
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(openUrl);
      }
    })
  );
});