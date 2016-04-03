import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class CardAdder extends Component {

  handleSubmit(event) {
    event.preventDefault();

    const front = ReactDOM.findDOMNode(this.refs.frontInput).value.trim();
    const back = ReactDOM.findDOMNode(this.refs.backInput).value.trim();
    const deckId = Meteor.user().currentDeck;

    Meteor.call('cards.insert', front, back, deckId);

    // Clear the form
    ReactDOM.findDOMNode(this.refs.frontInput).value = '';
    ReactDOM.findDOMNode(this.refs.backInput).value = '';    
  }

  render(){
    return (
      <form className="new-card" onSubmit={this.handleSubmit.bind(this)} >
        <div className="form-group">
          <textarea 
            type="front"
            ref="frontInput"
            placeholder="Front of card"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea 
            type="back"
            ref="backInput"
            placeholder="Back of card"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">+ Add</button>
      </form>
    );
  }
}
