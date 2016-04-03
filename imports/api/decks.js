import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Cards } from './cards.js';

export const Decks = new Mongo.Collection('decks');

if (Meteor.isServer) {
  Meteor.publish('decks', function tasksPublication() {
    // All decks visible to anyone
    console.log(Decks.find().count());
    return Decks.find();
  });
}

Meteor.methods({

  'decks.insert'(name) {
    check(name, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    Decks.insert({
      name: name,
      createdAt: new Date(),
      userId: Meteor.userId()
    });
  },
  'decks.updateUserDeck'(deckId){
    check(deckId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    Meteor.users.upsert({_id: Meteor.userId()}, {$set: {currentDeck: deckId}});
  }
});

Decks.helpers({
  cards(){
    return Cards.find({deckId: this._id});
  }
});