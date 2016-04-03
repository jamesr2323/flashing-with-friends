import React, { Component, PropTypes } from 'react';
import ReactDOM  from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class CardAdder extends Component {

  handleSubmit(event) {
    event.preventDefault();

    const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();

    Meteor.call('decks.insert', name);

    // Clear the form
    ReactDOM.findDOMNode(this.refs.nameInput).value = '';  
  }

  render(){
    return (
      <form className="new-deck" onSubmit={this.handleSubmit.bind(this)} >
        <div className="form-group">
          <input
            type="text" 
            ref="nameInput"
            placeholder="Deck name"
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">+ Add</button>
      </form>
    );
  }
}
