import React from 'react';
import PropTypes from 'prop-types';
import {flatten} from 'lodash';

import {Timeline, TimelineEvent} from 'react-event-timeline';
import Time from './Time.js';

import Commit from './Commit.js';
import MDSpinner from 'react-md-spinner';

export default class Projects extends React.Component {
  static propTypes = {
    projects: PropTypes.array.isRequired
  };

  render () {
    const avatarStyle = {
      position: 'absolute',
      top: '-3px',
      paddingLeft: '1px',
      fontSize: '20px',
      fontWeight: 'bold'
    };
    const entries = flatten(this.props.projects.map(project => {
      return project.tags.map(tag => {
        return {
          ...tag,
          date: new Date(tag.tagger.date),
          project: project,
          icon: project.icon
        };
      });
    })).sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
    return (
      <Timeline>
      {entries.map(tag => {
        return (
          <TimelineEvent key={tag.sha} title={`${tag.repo} released ${tag.name} by ${tag.tagger.name}`}
              icon={tag.icon ? <i className={`fa fa-${tag.icon} fa-fw`} /> : <span style={avatarStyle}>{tag.repo[0].toUpperCase()}</span>}
              createdAt={<Time date={tag.date} />}
            >
            { tag.commits && tag.commits.map((commit) => <Commit key={commit.sha} project={tag.project} commit={commit} />) }
            { !tag.commits && <MDSpinner /> }
          </TimelineEvent>
        );
      })}
      </Timeline>
    );
  }
}
