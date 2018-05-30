import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import TodoApp from './components/TodoApp';
import { loadState, saveState } from './localStorage'

const persistStore = loadState();
const store = createStore(todoApp, persistStore);

store.subscribe(() => {
  saveState({
    todos: store.getState().todos
  });
});

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