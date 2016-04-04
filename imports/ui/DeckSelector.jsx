import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Decks } from '../api/decks.js';

export default class DeckSelector extends Component {

  changeUserDeck(event){
    deckId = ReactDOM.findDOMNode(this.refs.deckIdInput).value.trim();
    console.log(deckId);

    Meteor.call('decks.updateUserDeck', deckId);

  }

  renderDeckOptions() {
    return this.props.decks.map( (deck) => (
      <option key={deck._id} value={deck._id}>{deck.name}</option>
    ));
  }

  render(){
    return (
      <div className="deck-selector-container">
        <form>
          <div className="form-group">
            <select
              onChange={this.changeUserDeck.bind(this)}
              ref="deckIdInput"
              className="form-control"
              value={Meteor.user().currentDeck}
            >
              {this.renderDeckOptions()}
            </select>
          </div>
        </form>
      </div>
    );
  }
}

