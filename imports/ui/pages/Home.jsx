import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';

import Card from '../components/Card.jsx';

const masonryOptions = {
    itemSelector: '.card-wrapper'
};

let resizeTimer;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        // this.masonryGrid = React.createRef();
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.onResize, false);
        }
    }

    onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Run code here, resizing has "stopped"
            // this.masonryGrid.current.layout();
            this.masonry.layout();
        }, 250);
    }

    renderCards() {
        return (
            <ul>
                {this.props.cards.filter((card) => {
                    const path = this.props.history.location.pathname;
                    const len = '/user/'.length;
                    const name = path.length > len ? path.substr(len) : '';
                    return name === '' ? true : (card.username === name);
                }).map(card => (
                    <Card
                        key={card._id}
                        _id={card._id}
                        imageURL={card.imageURL}
                        description={card.description}
                        likes={card.likes}
                        userId={card.user}
                        username={card.username}
                        userImageURL={card.userImageURL}
                    />
                ))}
            </ul>
        );
    }

    render() {
        this.renderCards = this.renderCards.bind(this);
        const path = this.props.history.location.pathname;
        const len = '/user/'.length;
        const title = path.length > len ? `User: ${path.substr(len)}` : 'Home';
        return (
            <div>
                <h2>{title}</h2>
                <Masonry
                    // eslint-disable-next-line func-names
                    ref={function (c) { this.masonry = this.masonry || c.masonry; }.bind(this)}
                    options={masonryOptions}
                >
                    {this.renderCards()}
                </Masonry>
            </div>
        );
    }
}

Home.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape()),
    history: PropTypes.shape().isRequired
};

Home.defaultProps = {
    cards: []
};
