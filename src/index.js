import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import TodoApp from './components/TodoApp';

const store = createStore(todoApp);

const hotRef = render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept(hotRef, () => ({
    hotRef
  }))
}