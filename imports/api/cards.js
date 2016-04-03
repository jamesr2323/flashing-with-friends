import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('cards', function tasksPublication() {
    return Cards.find();
  });
}

Meteor.methods({

  'cards.insert'(front, back) {
    check(front, String);
    check(back, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }


    Cards.insert({
      front: front,
      back: back,
      created_at: new Date(),
      user_id: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'cards.updateBox'(cardId, boxNumber, dueAt){
    check(cardId, String);
    check(boxNumber, Number);
    check(dueAt, Date);

    Cards.update(cardId, {
      $set: {
        boxNumber: boxNumber,
        dueAt: dueAt
      },
    });
  }
});