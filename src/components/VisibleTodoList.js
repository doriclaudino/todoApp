import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from './TodoList'

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

const mapVisibleTodoListStateToProps = (state, ownProp) => {
    console.log(state)
    return {
        todos: getVisibleTodos(
            state.todos,
            ownProp.filter
        )
    }
}
const mapVisibleTodoListDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id))
        }
    }
}

export default connect(
    mapVisibleTodoListStateToProps,
    mapVisibleTodoListDispatchToProps
)(TodoList);