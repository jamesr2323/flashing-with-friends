import React, { Component, PropTypes } from 'react';
import { Cards } from '../api/cards.js';
import { Meteor } from 'meteor/meteor';

export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBack: false
    }
  }

  levelUp() {
    boxNumber = (this.props.card.boxNumber || 0) + 1;
    dueAt = this.getNextDueAt(boxNumber);

    Meteor.call('cards.updateBox', this.props.card._id, boxNumber, dueAt)
  }

  returnToZero () {
    Meteor.call('cards.updateBox', this.props.card._id, 0, this.getNextDueAt(0));
  }

  getNextDueAt(boxNumber) {
    currentTime = new Date();
    dueAt = new Date( (new Date()).getTime() + ((boxNumber + 1) * 60000 * 10) );
    return dueAt;
  }

  toggleBack() {
    this.setState({
      showBack: !this.state.showBack      
    })
  }

  render () {

    const backClassName = "text-center lead " + (this.state.showBack ? '' : 'hidden');
    const backButtonText = this.state.showBack ? "Click to hide" : "Click to reveal";

    return (
      <div className="col-md-8 col-md-offset-2">
        <div className="row question">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Front of card</h3>
              <div className="pull-right"><span className="label label-success">{ this.props.card.boxNumber }</span> <span className="label label-default">{ this.props.card.username }</span></div> 
            </div>
            <div className="panel-body">
              <p className="text-center lead">{this.props.card.front}</p>
            </div>
          </div>      
        </div>
        <div className="row answer-input">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Back of card</h3>
            </div>
            <div className="panel-body">
              <p 
                className={backClassName} 
                ref="hiddenBack">{this.props.card.back} </p>
              <button className="btn btn-primary" onClick={this.toggleBack.bind(this)}>{backButtonText}</button>
            </div>
          </div>      
        </div>
        <div className="row buttons text-center">
          <button 
            className="card-button submit btn btn-success"
            onClick={this.levelUp.bind(this)}
          >Remembered</button>
          <button 
            className="card-button give-up btn btn-warning" 
            onClick={this.returnToZero.bind(this)}
          >Forgot</button>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
};