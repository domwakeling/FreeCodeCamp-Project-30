/* React component which can be (reasonably) safely used across projects.
 * Creates <div.copyright> containing copyright year(s) and optional name, optionally a link
 * @prop {string} from - year first copyrighted AS A STRING; optional (defaults to current year)
 * @prop {string} who - name (or other text) that will appear next to the years; optional
 * @prop {string} link - URL which is used to turn the 'who' string into an <a href>; optional
 * */

import React from 'react';
import PropTypes from 'prop-types';

export default class Copyright extends React.Component {
    render() {
        const year = new Date().getFullYear();
        const str = this.props.from + (year > this.props.from ? `–${year} ` : ' ');
        return (
            <div className="copyright">
                &copy;{str} {this.props.link !== '' ? (
                    <a href={this.props.link} target="_offsite">{this.props.who}</a>
                ) : this.props.who}
            </div>
        );
    }
}

Copyright.propTypes = {
    from: PropTypes.string,
    who: PropTypes.string,
    link: PropTypes.string
};
Copyright.defaultProps = {
    from: new Date().getFullYear().toString(),
    who: '',
    link: ''
};
