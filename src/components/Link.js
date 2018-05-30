import React, { PropTypes } from 'react';

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

  export default Link;