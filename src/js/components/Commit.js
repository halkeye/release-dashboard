import React from 'react';

export default class Commit extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    commit: React.PropTypes.object.isRequired
  };
  render () {
    const commitUrl = `https://github.com/${this.props.project.repo}/commit/${this.props.commit.sha}`;
    return (
      <div className="commit">
        <span className="message" title={this.props.commit.message}>{this.props.commit.message}</span>
        <span className="author">{this.props.commit.author.name}</span>
        <a target="_new" href={commitUrl} className="sha">[{this.props.commit.sha.slice(0, 6)}]</a>
      </div>
    );
  }
}
