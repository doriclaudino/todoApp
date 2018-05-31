import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from './TodoList'
import { withRouter } from 'react-router-dom'

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'all':
            return todos;
        case 'completed':
            return todos.filter(t => t.completed);
        case 'active':
            return todos.filter(t => !t.completed);
        default:
            throw new Error(`Unknown filter: ${filter}.`);
    }
};

const mapVisibleTodoListStateToProps = (state, withRouterParams) => ({
    todos: getVisibleTodos(
        state.todos,
        withRouterParams.match.params.filter || 'all'),
});

const VisibleTodoList = withRouter(connect(
    mapVisibleTodoListStateToProps,
    { onTodoClick: toggleTodo }
)(TodoList));

export default VisibleTodoList;