import { combineReducers } from 'redux';
import todos, * as fromTodos from './todos';

const todoApp = combineReducers({
    todos
})

export default todoApp;

export const getVisibleTodos = (todos, filter) => 
    fromTodos.getVisibleTodos(todos, filter);