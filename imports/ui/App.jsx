import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Cards } from '../api/cards.js';
import { Decks } from '../api/decks.js';
import { CardsForUsers } from '../api/cardsForUsers.js';

import CardForUser from './CardForUser.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import DeckSelector from './DeckSelector.jsx';
import CardAdder from './CardAdder.jsx';
import DeckAdder from './DeckAdder.jsx';

//App componenet - represents the whole app

class App extends Component {

  renderCardsForUsers() {
    return this.props.cardsForUsers.map((cardForUser) => (
      <CardForUser key={cardForUser._id} cardForUser={cardForUser} />
    )); 
  }

  renderDeckOptions() {
    return this.props.decks.map( (deck) => (
      <option key={deck._id} value={deck._id}>{deck.name}</option>
    ));
  }

  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />        

        { this.props.currentUser ? 
          <div className="row">
            <div className="col-md-4">
              <DeckSelector decks={this.props.decks} />
              <div className="row">
                <h2>Add a card</h2>
                <CardAdder />
              </div>
              <div className="row add-deck-container">
                <h2>Add a deck</h2>
                <DeckAdder />
              </div>
            </div>

            <div className="col-md-8">
              { this.props.cardForUser ? 
                <CardForUser cardForUser={this.props.cardForUser} />
                : ''
              }
            </div>
          </div> : '' }
      </div>
    );
  }

}

App.propTypes = {
  cardForUser: PropTypes.object,
  currentUser: PropTypes.object
};

export default createContainer( () => {

  Meteor.subscribe('cardsForUsers');
  Meteor.subscribe('cards');
  Meteor.subscribe('decks');
  Meteor.subscribe('userData');

  var deck;
  if (Meteor.user()){
    deck = Decks.findOne({_id: Meteor.user().currentDeck });
  }

  console.log("User: ", Meteor.user());
  console.log("Deck: ", deck);
  
  var cardIds = []

  if (!!deck) {
    Meteor.call('cardsForUsers.ensureNoMissing', deck._id);
    cardIds = deck.cards().map((card) => {return card._id});
  }

  const cardForUser = CardsForUsers.find({
      $and: [
        {
          $or: [
            { dueAt: { $lte: new Date()}},
            { dueAt: { $exists: false}}
          ]
        },
        {cardId: 
          {$in: cardIds }
        }
        ]
    }, 
    { 
      sort: { dueAt: 1 },
      limit: 1 
    }).fetch()[0];

  console.log("Card for user: ", cardForUser);

  return {
    cardForUser: cardForUser,
    currentUser: Meteor.user(),
    decks: Decks.find().fetch()
  };
}, App);