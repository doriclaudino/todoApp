import React from 'react';
import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Component } from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'
import AddTodo from './components/AddTodo';
import Footer from './components/Footer'
import VisibleTodoList from './components/VisibleTodoList'
import visibilityFilter from './reducers/visibilityFilter'
import todos from './reducers/todos'

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  store: PropTypes.object
};


/******
global id
/******/
const TodoApp = () =>
  (<div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
  )


const App = () => {
  return (
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>
  );
}

export default App;