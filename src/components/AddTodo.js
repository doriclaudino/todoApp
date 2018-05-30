import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../actions';

const AddTodo = ({ dispatch }) => {
    let input;
    return (
      <div>
        <input type="text" ref={node => {
          input = node
        }}
        />
        <button
          onClick={() => {
            dispatch(addTodo(input.value))
            input.value = '';
          }}
        >
          Add Todo
       </button>
      </div>
    );
  }
  /** on this case, the connect dont need the arguments, because AddTodo use a simple implementation of dispatch action  */
export default connect()(AddTodo);
