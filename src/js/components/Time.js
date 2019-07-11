import React from 'react';
import PropTypes from 'prop-types';
import ReactTime from 'react-time';

export default class Time extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date)
  };

  render () {
    return (
      <span>
        <ReactTime value={this.props.date} format="dddd, MMMM Do YYYY, h:mm:ss a"/> (<ReactTime value={this.props.date} relative />)
      </span>
    );
  }
}
