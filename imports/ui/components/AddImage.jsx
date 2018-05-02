import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';

export default class AddImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownVisible: false
        };
        this.field_url = React.createRef();
        this.field_description = React.createRef();
        this.field_submit = React.createRef();
    }

    addButtonHAndler(e) {
        e.preventDefault();
        const currState = this.state.dropdownVisible;
        this.setState({
            dropdownVisible: !currState
        });
    }

    urlCheck(url) {
        let url2 = url;
        if (!url2 || url2 === '') return false;
        const g1 = /^https?:\/\/www\.google\.\S+imgurl=(https?\S+)&img\S+/;
        const g2 = /^www\.google\.\S+imgurl=(https?\S+)&img\S+/;
        if (url.match(g1)) {
            // eslint-disable-next-line prefer-destructuring
            url2 = url.match(g1)[1].replace(/%3A/g, ':').replace(/%2F/g, '/');
        } else if (url.match(g2)) {
            // eslint-disable-next-line prefer-destructuring
            url2 = url.match(g1)[1].replace(/%3A/g, ':').replace(/%2F/g, '/');
        }
        // define two matching sets - one with, one without http(s):// ...
        const p1 = /^https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
        const p2 = /^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
        // test against the full string and then a missing http
        if (p1.test(url2)) {
            return url2;
        } else if (p2.test(url2)) {
            return `http://${url2}`;
        }
        // fail
        return false;
    }

    submitHandler(e) {
        e.preventDefault();
        const url = this.urlCheck(this.field_url.current.value);
        const description = this.field_description.current.value;
        // remove focus from the form
        this.field_url.current.blur();
        this.field_description.current.blur();
        this.field_submit.current.blur();
        // check we have a URL and a description
        if (!url || url === '') {
            Bert.alert('Please enter a valid url!', 'danger', 'growl-top-right');
        } else if (!description || description === '') {
            Bert.alert('Please enter a description!', 'danger', 'growl-top-right');
        } else {
            Meteor.call('cards.addOne', url, description, (err) => {
                if (err) {
                    Bert.alert(err.reason, 'warning', 'growl-top-right');
                } else {
                    Bert.alert('success!', 'success', 'growl-top-right');
                    this.field_url.current.value = '';
                    this.field_description.current.value = '';
                    this.setState({ dropdownVisible: false });
                }
            });
        }
    }

    render() {
        this.addButtonHAndler = this.addButtonHAndler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        return (
            <div>
                {this.props.userId ? (
                    <div className="dropdown">
                        <button
                            id="button-add"
                            className="main-button inverse-button"
                            onClick={this.addButtonHAndler}
                        >
                            Add picture
                        </button>
                        {this.state.dropdownVisible ? (
                            <div className="dropdown-content">
                                <form onSubmit={this.submitHandler}>
                                    <input
                                        ref={this.field_url}
                                        type="text"
                                        id="field_url"
                                        placeholder="url"
                                    />
                                    <input
                                        ref={this.field_description}
                                        type="text"
                                        id="field_description"
                                        placeholder="description"
                                    />
                                    <input
                                        ref={this.field_submit}
                                        className="main-button"
                                        type="submit"
                                        id="field_submit"
                                        value="Add picture"
                                    />
                                </form>
                            </div>
                        ) : ''}
                    </div>
                ) : ''}
            </div>

        );
    }
}

AddImage.propTypes = {
    userId: PropTypes.string
};

AddImage.defaultProps = {
    userId: null
};
