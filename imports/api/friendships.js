import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Friendships = new Mongo.Collection('friendships');

if (Meteor.isServer) {
  Meteor.publish('friendships', function tasksPublication() {
    return Friendships.find({userId: Meteor.userId()});
  });
}