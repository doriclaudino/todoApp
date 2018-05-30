import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from './Link';

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

  export default FilterLink;