import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
    Meteor.publish('cards', () => Cards.find({}));

    Meteor.methods({

        'cards.addOne': function addCard(imageURL, description) {
            check([imageURL, description], [String]);
            const user = Meteor.user();
            if (!user) {
                throw new Meteor.Error('100', 'Oops, something went wrong!');
            }
            try {
                Cards.insert({
                    imageURL,
                    description,
                    likes: 0,
                    user: user._id,
                    username: user.services.twitter.screenName,
                    userImageURL: user.services.twitter.profile_image_url,
                    createdAt: new Date()
                });
            } catch (err) {
                throw new Meteor.Error('101', 'Error writing to database!');
            }
        },

        'cards.removeOne': function removeOneCard(imageId) {
            check(imageId, String);

            const oopsError = new Meteor.Error('999', 'Oops, something went wrong!');
            const ownError = new Meteor.Error('103', 'That\'s not your picture!');
            const card = Cards.findOne({ _id: imageId });

            if (!card) {
                throw oopsError;
            } else if (card.user !== Meteor.userId()) {
                throw ownError;
            } else {
                try {
                    Cards.remove({
                        _id: imageId
                    });
                } catch (err) {
                    throw oopsError;
                }
            }
        },

        'cards.addLike': function addLike(imageId) {
            check(imageId, String);

            const card = Cards.findOne({ _id: imageId });

            if (!card) {
                throw new Meteor.Error('105', 'Error - card not found');
            } else if (card.user === Meteor.userId()) {
                throw new Meteor.Error('106', 'User cannot add like to own pictures');
            } else {
                try {
                    Cards.update({ _id: imageId }, { $inc: { likes: 1 } });
                } catch (err) {
                    throw new Meteor.Error('999', 'Oops, something went wrong!');
                }
            }
        }
    });
}

export default Cards;
