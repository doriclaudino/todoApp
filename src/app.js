import React from 'react';
import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Component } from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'

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

let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input type="text" ref={node => {
        input = node
      }}
      />
      <button
        onClick={() => {
          dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
          input.value = '';
        }}
      >
        Add Todo
     </button>
    </div>
  );
}
/** on this case, the connect dont need the arguments, because AddTodo use a simple implementation of dispatch action  */
AddTodo = connect()(AddTodo);


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
container container, knows everything about state, values
/******/
class FilterLink extends Component {

  /******
  used two lifecycle methos to force re-render
  if the parent component didnt update, it update byself
  /******/
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}

        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }>
        {props.children}
      </Link>
    );
  }
}

FilterLink.contextTypes = {
  store: PropTypes.object
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

const mapVisibleTodoListStateToProps = (state) => {
  return {
    todos : getVisibleTodos(state.todos,
      state.visibilityFilter)
  }
}
const mapVisibleTodoListDispatchToProps = (dispatch) => {
  return {
    onTodoClick : (id) => {
      dispatch({
        type: 'TOGGLE_TODO',
        id
      })
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
let nextTodoId = 0;

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