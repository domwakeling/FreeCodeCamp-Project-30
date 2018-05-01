import React from 'react';

import AccountsUITwitter from './AccountsUITwitter.jsx';

export default class Navbar extends React.Component {
    render() {
        return (
            <div className="topNav">
                <div className="topNavContainer">
                    <a className="brand" href="/">FCC30 Pins App</a>
                    <AccountsUITwitter />
                </div>
            </div>
        );
    }
}
