import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AccountsUITwitter from './AccountsUITwitter.jsx';

class Navbar extends React.Component {
    render() {
        return (
            <div className="topNav">
                <div className="topNavContainer">
                    <a className="brand" href="/">FCC30 Pins App</a>
                    {this.props.history.location.pathname !== '/' ? (
                        <Link to="/">Home</Link>
                    ) : ''}
                    <AccountsUITwitter />
                </div>
            </div>
        );
    }
}

Navbar.propTypes = {
    history: PropTypes.shape().isRequired
};

export default withRouter(Navbar);
