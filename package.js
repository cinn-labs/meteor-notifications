Package.describe({
  name: 'cinn:notifications',
  version: '0.0.1',
  summary: 'Notifications collection and generator helpers',
  git: 'https://github.com/cinn-labs/meteor-notifications',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  const both = ['client', 'server'];
  api.versionsFrom('1.3.2.4');
  api.export('Notifications');
  api.export('NotificationsHandler');

  api.use('meteor-base');
  api.use('ecmascript');

  api.addFiles('notifications.collections.js', both);
  api.addFiles('notifications.handler.js', both);
  api.addFiles('notifications.handler.server.js', 'server');
});
