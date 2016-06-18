NotificationsHandler = {
  beforeCreate() {},
  beforeUpdate() {},
  create() {},
  destroy: (namespace, key, docId) => Meteor.call('notifications.destroy', namespace, key, docId)
};

export default NotificationsHandler;
