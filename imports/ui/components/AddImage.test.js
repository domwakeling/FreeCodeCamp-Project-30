/* eslint-env mocha */
/* eslint-disable no-useless-return */
/* eslint-disable prefer-destructuring */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { assert } from 'chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import AddImage from './AddImage.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('AddImage url validation', () => {
    if (Meteor.isServer) return; // client-only
    const urlCheck = Enzyme.shallow(<AddImage />).instance().urlCheck;

    it('should reject an empty string', () => {
        assert.equal(urlCheck(''), false);
    });
    it('should accept a valid http/https address', () => {
        const validHttpAddress = 'http://mysite/bling.img';
        const validHttpsAddress = validHttpAddress.replace('http:', 'https:');
        assert.equal(urlCheck(validHttpAddress), validHttpAddress);
        assert.equal(urlCheck(validHttpsAddress), validHttpsAddress);
    });
    it('should accept a valid address missing http://', () => {
        const validNoHttpAddress = 'mysite/bling.img';
        const correctedAddress = `http://${validNoHttpAddress}`;
        assert.equal(urlCheck(validNoHttpAddress), correctedAddress);
    });
    it('should reject if no file extension', () => {
        const noExtension = 'http://mysite/bling';
        assert.equal(urlCheck(noExtension), false);
    });
});

describe('AddImage navbar element', () => {
    if (Meteor.isServer) return; // client-only

    it('should be visible when user is signed in', () => {
        // setup: prepare data (history.isRequired, no user so null) / render component
        const item = Enzyme.shallow(<AddImage userId="some_userId" />);

        // test
        assert.equal(item.text(), 'Add picture');
    });

    it('should not be visible when no user signed in', () => {
        // setup: prepare data (history.isRequired, user) / render component
        const item = Enzyme.shallow(<AddImage userId={null} />);

        // test
        assert.equal(item.text(), '');
    });

    it('should not show dropdown before being clicked', () => {
        const item = Enzyme.shallow(<AddImage userId="some_userId" />);
        assert.equal(item.find('div.dropdown-content').length, 0);
    });

    it('should show dropdown when clicked', () => {
        const item = Enzyme.shallow(<AddImage userId="some_userId" />);
        // click on the #button-add button
        item.find('button#button-add').simulate('click', { preventDefault: () => { } });
        assert.equal(item.find('div.dropdown-content').length, 1);
    });

    it('no submit call before enter/click on form', () => {
        const item = Enzyme.shallow(<AddImage userId="some_userId" />);
        // click on the #button-add button to make form visible
        item.find('button#button-add').simulate('click', { preventDefault: () => {} });
        const spy = sinon.spy(item.instance(), 'submitHandler');
        assert.equal(spy.called, false);
    });

    it('should fail to submit when no URL', () => {
        const item = Enzyme.mount(<AddImage userId="some_userId" />);
        // click on the #button-add button to make form visible, set description, set spy up
        item.find('button#button-add').simulate('click', { preventDefault: () => { } });
        item.find('#field_description').simulate('change', { target: { value: 'picture' } });
        const spy = sinon.spy(item.instance(), 'submitHandler');
        // call submit
        item.find('form').simulate('submit', { preventDefault: () => { } });
        assert.equal(spy.called, true);
    });

    it('should send an entry when submit button is clicked');

    it('should send an entry when enter is pressed in the form');
});
