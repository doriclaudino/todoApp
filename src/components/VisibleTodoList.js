import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from './TodoList'
import { withRouter } from 'react-router-dom'
import { getVisibleTodos } from '../reducers'

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