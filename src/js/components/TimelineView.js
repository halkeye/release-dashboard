import React from 'react';
import PropTypes from 'prop-types';
import {flatten} from 'lodash';

import {Timeline, TimelineEvent} from 'react-event-timeline';
import Time from './Time.js';

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
          repo: project.repo,
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
            BLAH BALH
          </TimelineEvent>
        );
      })}
      </Timeline>
    );
  }
}
