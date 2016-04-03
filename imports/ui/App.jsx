import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Cards } from '../api/cards.js';

import Card from './Card.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

//App componenet - represents the whole app

class App extends Component {

  handleSubmit(event) {
    event.preventDefault();

    const front = ReactDOM.findDOMNode(this.refs.frontInput).value.trim();
    const back = ReactDOM.findDOMNode(this.refs.backInput).value.trim();

    Meteor.call('cards.insert', front, back);

    // Clear the form
    ReactDOM.findDOMNode(this.refs.frontInput).value = '';
    ReactDOM.findDOMNode(this.refs.backInput).value = '';    
  }

  renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card._id} card={card} />
    ));
  }

  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />

        { this.props.currentUser ? 
          <div>
            <h1>Add New Cards</h1>

            <form className="new-card" onSubmit={this.handleSubmit.bind(this)} >
              <textarea 
                type="front"
                ref="frontInput"
                placeholder="Front of card"
              />
              <textarea 
                type="back"
                ref="backInput"
                placeholder="Back of card"
              />
              <button type="submit" className="btn btn-primary">+ Add</button>
            </form>

            <div>
              <div className="row">
                {this.renderCards()}
              </div>
            </div>
          </div> : '' }
      </div>
    );
  }

}

App.propTypes = {
  cards: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default createContainer( () => {
  Meteor.subscribe('cards');

  return {
    cards: Cards.find({
      $or: [
        { dueAt: { $lte: new Date()}},
        { dueAt: { $exists: false}}
      ]
    }, 
    { 
      sort: { dueAt: 1 },
      limit: 1 
    }).fetch(),
    currentUser: Meteor.user()
  };
}, App);