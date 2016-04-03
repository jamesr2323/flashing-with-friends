import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
  Meteor.publish('cards', function tasksPublication() {
    return Cards.find();
  });
}

Meteor.methods({

  'cards.insert'(front, back, deckId) {
    check(front, String);
    check(back, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    console.log(deckId);

    Cards.insert({
      front: front,
      back: back,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username,
      deckId: deckId
    });
  }
});
