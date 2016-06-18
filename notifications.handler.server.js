import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import Notifications from './notifications.collections';
import NotificationsHandler from './notifications.handler';

NotificationsHandler.createOrDestroyWrapper = function(callback) {
  Meteor.setTimeout(callback, 500);
};

NotificationsHandler.create = function(namespace, key, docId, pendingUsersIds, userId) {
  userId = userId || Meteor.userId();
  NotificationsHandler.createOrDestroyWrapper(() => {
    if(!key) return console.warn('[NOTIFICATIONS] Key param is mandatory. Notifications was not created.');
    if(!pendingUsersIds) return console.warn('[NOTIFICATIONS] Pending Users Ids param is mandatory. Notifications was not created.');
    const doc = { namespace, key, docId, pendingUsersIds: _.concat([], pendingUsersIds), completedUsersIds: [], createdAt: new Date() };
    NotificationsHandler.beforeCreate(doc, userId);
    Notifications.insert(doc);
  });
};

NotificationsHandler.destroy = function(namespace, key, docId, newCompletedUsersIds, userId) {
  userId = userId || Meteor.userId();
  NotificationsHandler.createOrDestroyWrapper(() => {
    if(!key) return console.warn('[NOTIFICATIONS] Key param is mandatory. Notifications was not destroyed.');
    if(!newCompletedUsersIds) return console.warn('[NOTIFICATIONS] newCompletedUsersIds param is mandatory. Notifications was not destroyed.');
    const notifications = Notifications.find({ namespace, key, docId }, { fields: { pendingUsersIds: 1, completedUsersIds: 1 } }).fetch();
    _.each(notifications, (doc) => updateNotificationPendingUsersIds(doc, newCompletedUsersIds, userId));
  });
};

function updateNotificationPendingUsersIds(notification, newCompletedUsersIds, userId) {
  let { completedUsersIds, pendingUsersIds } = notification;
  const acceptedNewCompletedUsersIds = _.remove(pendingUsersIds, (userId) => _.includes(newCompletedUsersIds, userId));
  completedUsersIds = _.concat(completedUsersIds, acceptedNewCompletedUsersIds);
  const modifier = { $set: { completedUsersIds, pendingUsersIds } };
  NotificationsHandler.beforeUpdate(notification, modifier, userId);
  Notifications.update({ _id: notification._id }, modifier);
}

Meteor.methods({
  'notifications.destroy': function(namespace, key, docId) {
    NotificationsHandler.destroy(namespace, key, docId, this.userId);
  }
});
