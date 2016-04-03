import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Cards } from './cards.js';
import { Decks } from './decks.js'; 

export const CardsForUsers = new Mongo.Collection('cardsForUsers');

if (Meteor.isServer) {
  Meteor.publish('cardsForUsers', function tasksPublication() {
    return CardsForUsers.find({userId: this.userId});
  });
  Meteor.publish('userData', function() {
    if(!this.userId) return null;
    return Meteor.users.find(this.userId, {fields: {
      permission: 1,
      currentDeck: 1,
    }});
  });
}

Meteor.methods ({
  'cardsForUsers.insert'(cardId){
    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    CardsForUsers.insert({
      userId: Meteor.userId(),
      cardId: cardId,
      createdAt: new Date(),
    });
  },
  'cardsForUsers.updateBox'(cardForUserId, boxNumber, dueAt){
    console.log(cardForUserId);
    check(cardForUserId, String);
    check(boxNumber, Number);
    check(dueAt, Date);

    CardsForUsers.update(cardForUserId, {
      $set: {
        boxNumber: boxNumber,
        dueAt: dueAt
      }
    });
  },
  'cardsForUsers.ensureNoMissing'(deckId){
    Decks.findOne({_id: deckId}).cards().forEach( (card) => {
      if ( CardsForUsers.find({cardId: card._id, userId: Meteor.userId()}).count() == 0){
        CardsForUsers.insert({
          userId: Meteor.userId(),
          cardId: card._id,
          createdAt: new Date(),
        });
      }
    });
  }
});

CardsForUsers.helpers({
  card() {
    return Cards.findOne(this.cardId);
  }
});