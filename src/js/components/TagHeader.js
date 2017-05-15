import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';

import UserAvatar from 'react-user-avatar';
import SmartTimeAgo from 'react-smart-time-ago';

export default class TagHeader extends React.Component {
  static propTypes = {
    project: PropTypes.object,
    tag: PropTypes.object
  };
  render () {
    const repoName = this.props.project.repo.split('/')[1];
    if (!this.props.tag) {
      return <div className="repo">{repoName}</div>;
    }
    const tag = this.props.tag;
    const avatarUrl = `//www.gravatar.com/avatar/${md5(tag.tagger.email)}`;
    return (
      <div>
        <UserAvatar size='60' name={tag.tagger.name} src={avatarUrl} className="avatar" />
        <div className="repo">{repoName}</div>
        <span className="ago"><SmartTimeAgo value={new Date(tag.tagger.date)} /></span>
        <span> by </span>
        <span className="author">{tag.tagger.name}</span>
      </div>
    );
  }
}
