import React from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Cards from '../../api/cards.js';

import Copyright from './Copyright.jsx';
import Navbar from './Navbar.jsx';
import AddImage from './AddImage.jsx';

import Home from '../pages/Home.jsx';
import NoMatch from '../pages/NoMatch.jsx';

class App extends React.Component {
    render() {
        const userId = this.props.user && this.props.user._id;
        return (
            <Router>
                <div>
                    <Navbar user={this.props.user} />
                    <div className="container">
                        <AddImage userId={userId} />
                        <Switch>
                            {/* <Route exact path="/" component={Home} /> */}
                            <Route
                                exact
                                path="/"
                                render={props => <Home {...props} cards={this.props.cards} />}
                            />
                            <Route
                                path="/user/:token"
                                render={props => <Home {...props} cards={this.props.cards} />}
                            />
                            <Route component={NoMatch} />
                        </Switch>
                        <Copyright
                            from="2018"
                            who="Dom Wakeling"
                            link="http://www.domwakeling.com"
                        />
                    </div>
                </div>
            </Router>
        );
    }
}

App.propTypes = {
    user: PropTypes.shape(),
    cards: PropTypes.arrayOf(PropTypes.shape())
};

App.defaultProps = {
    user: null,
    cards: []
};

export default withTracker(() => {
    Meteor.subscribe('cards');
    return {
        user: Meteor.user(),
        cards: Cards.find({}).fetch()
    };
})(App);
