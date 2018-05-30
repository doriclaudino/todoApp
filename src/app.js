import React from 'react';
import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Component } from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'
import AddTodo from './components/AddTodo';
import Footer from './components/Footer'

/******
todo reducer
/******/
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};


/******
todos reducer
/******/
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    case 'EMPTY_TODOS':
      return [];
    default:
      return state;
  }
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

/******
filter reducer
/******/
const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    default:
      return todos || [];
  }
};


/******
visibility reducer
return the default SHOW_ALL using return state
/******/
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const Todo = ({
  onClick,
  completed,
  text
}) => (
    <li
      onClick={onClick}
      style={{
        textDecoration:
        completed ?
          'line-through' :
          'none'
      }}
    >
      {text}
    </li>
  );

const TodoList = ({
  todos,
  onTodoClick
}) => (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
      )}
    </ul>
  );

const mapVisibleTodoListStateToProps = (state) => {
  return {
    todos : getVisibleTodos(state.todos,
      state.visibilityFilter)
  }
}
const mapVisibleTodoListDispatchToProps = (dispatch) => {
  return {
    onTodoClick : (id) => {
      dispatch(toggleTodo(id))
    }
  }
}
const VisibleTodoList = connect(
  mapVisibleTodoListStateToProps,
  mapVisibleTodoListDispatchToProps
)(TodoList);


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