import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import Sidebar from 'react-sidebar';

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

  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false,
      currentPage: 'study'
    };
  }

  onSetSidebarOpen(open) {
    this.setState({
      sidebarOpen: open
    });
  }

  showStudy() {
    this.setState({
      currentPage: 'study'
    });
    this.onSetSidebarOpen(false);
  }

  renderStudy(){
    if (this.props.cardForUser) {
      return <CardForUser cardForUser={this.props.cardForUser} />
    } else {
      return ''
    }
  }

  showEditDecks(){
    this.setState({
      currentPage: 'editDecks'
    });
    this.onSetSidebarOpen(false);
  }

  renderEditDecks(){
    return (
      <div>
        <div className="row">
          <h2>Add a card</h2>
          <CardAdder />
        </div>
        <div className="row add-deck-container">
          <h2>Add a deck</h2>
          <DeckAdder />
        </div>
      </div>
    );
  }

  renderContent(){
    if (this.state.currentPage == 'study'){
      return this.renderStudy();
    } else if (this.state.currentPage = 'editDecks'){
      return this.renderEditDecks();
    } else {
      return '';
    }
  }

  render() {
    var sidebarContent = <div className="sidebar">
        <div>
          <img className="img-responsive" src="http://www.theinquirer.net/IMG/683/194683/adobe-flash-player-logo-2011-270x167.jpg?1447298532" /> 
          <ul className="list-group">
            <li className="list-group-item"><AccountsUIWrapper /></li>
            { this.props.currentUser ?
              <div>
                <li className="list-group-item"><a href="#" onClick={this.showStudy.bind(this)}>Study</a></li>
                <li className="list-group-item"><a href="#" onClick={this.showEditDecks.bind(this)}>Edit Decks</a></li>
              </div>
            : '' }
          </ul>
        </div>
    </div>;
    var styles = {sidebar: {background: 'white', width: '75%'}};
    return (
      <div className="container">
        <Sidebar sidebar={sidebarContent}
                 open={this.state.sidebarOpen}
                 onSetOpen={this.onSetSidebarOpen.bind(this)}
                 styles={styles}>
        </Sidebar>
                

        
          <div className="row">
            <div className="col-md-4">
              <span className="glyphicon glyphicon-menu-hamburger" className="hamburger" onClick={this.onSetSidebarOpen.bind(this, true)}>≡</span> 
              { this.props.currentUser ? <DeckSelector decks={this.props.decks} /> : '' }
              { this.props.currentUser ? this.renderContent() : '' }
            </div>
          </div>
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