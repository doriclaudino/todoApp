import React from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';

const Root = ({ store }) => (
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/:filter?" component={TodoApp} />
        </BrowserRouter>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;