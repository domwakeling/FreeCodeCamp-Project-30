import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { Bert } from 'meteor/themeteorchef:bert';

export default class Card extends React.Component {
    imageError(e) {
        e.target.src = '/broken.png';
    }

    deleteHandler(e) {
        e.preventDefault();
        Meteor.call('cards.removeOne', this.props._id, (err) => {
            if (err) {
                Bert.alert(err.reason, 'danger', 'growl-top-right');
            }
        });
    }

    likeHandler(e) {
        e.preventDefault();
        if (Meteor.userId() !== this.props.userId) {
            Meteor.call('cards.addLike', this.props._id, (err) => {
                if (err) {
                    Bert.alert(err.reason, 'danger', 'growl-top-right');
                }
            });
        }
    }

    render() {
        this.imageError = this.imageError.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.likeHandler = this.likeHandler.bind(this);
        const userId = Meteor.userId();
        const likeClass = userId && userId !== this.props.userId ? 'card-likes live' : 'card-likes';
        return (
            <div className="card-wrapper">
                <div className="card">
                    <img
                        className="card-image"
                        src={this.props.imageURL}
                        onError={this.imageError}
                        alt={this.props.description}
                    />
                    <div className="card-description">{this.props.description}</div>
                    <a href={`/user/${this.props.username}`} >
                        <img
                            // onClick={this.userClickHandler}
                            className="user-image"
                            src={this.props.userImageURL}
                            alt={this.props.username}
                        />
                    </a>
                    <div className="card-likes-count">{this.props.likes}</div>
                    {/* eslint-disable-next-line */}
                    <a onClick={this.likeHandler}>
                        <div className={likeClass}>&hearts;</div>
                    </a>
                    <div className="button-wrapper">
                        {Meteor.userId() === this.props.userId ? (
                            <button
                                className="smaller-button delete-button"
                                onClick={this.deleteHandler}
                            >
                                delete
                            </button>
                        ) : '' }
                    </div>
                </div>
            </div>
        );
    }
}

Card.propTypes = {
    _id: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userImageURL: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired
};
