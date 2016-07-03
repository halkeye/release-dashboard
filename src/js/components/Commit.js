import React from 'react';

export default class Commit extends React.Component {
  static propTypes = {
    commit: React.PropTypes.object.isRequired
  };
  render() {
    return (
      <div className="commit">
        <span className="message" title={this.props.commit.message}>{this.props.commit.message}</span>
        <span className="author">{this.props.commit.author.name}</span>
        <span className="sha">[{this.props.commit.sha.slice(0,6)}]</span>
      </div>
    );
  }
}

