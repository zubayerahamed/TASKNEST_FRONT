self.addEventListener('push', function(event) {

  console.log(event);

  const data = event.data?.json() || {};
  const title = data.title || '🔔 Notification';
  const options = {
    body: data.message || '',
    icon: '/assets/icons/icon.png',
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
