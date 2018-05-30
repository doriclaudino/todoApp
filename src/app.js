import React from 'react';
import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Component } from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'
import AddTodo from './components/AddTodo';

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
const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
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

/******
just pass the filter to the children
/******/
const Footer = () => {
  return (
    <p>
      Show:
    {' '}
      <FilterLink
        filter={'SHOW_ALL'}
      >
        All
    </FilterLink>
      {' '}
      <FilterLink
        filter={'SHOW_ACTIVE'}
      >
        Active
    </FilterLink>
      {' '}
      <FilterLink
        filter={'SHOW_COMPLETED'}
      >
        Completed
    </FilterLink>
    </p>
  );
}

/******
presentation component, or dump component
/******/
const Link = ({
  active,
  children,
  onClick
}) => {

  /* span if current is clicked */
  if (active) {
    return (<span>{children}</span>)
  }
  return (<a href='#'
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
  );
};


const mapFilterLinkStateToProps = (
  state,
  ownProps
) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
const mapFilterLinkDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapFilterLinkStateToProps,
  mapFilterLinkDispatchToProps
)(Link);


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