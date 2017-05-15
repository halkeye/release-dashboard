import React from 'react';
import {flatten} from 'lodash';

import moment from 'moment';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import Avatar from 'react-avatar';

export default class Projects extends React.Component {
  static propTypes = {
    projects: React.PropTypes.array.isRequired
  };

  render () {
    const entries = flatten(this.props.projects.map(project => {
      return project.tags.map(tag => {
        return {
          ...tag,
          date: moment(tag.tagger.date),
          repo: project.repo,
          icon: project.icon
        };
      });
    })).sort((a, b) => {
      return b.date - a.date;
    });
    return (
      <Timeline>
      {entries.map(tag => {
        return (
          <TimelineEvent title={`${tag.repo} released ${tag.name} by ${tag.tagger.name}`}
              icon={<i className={`fa fa-${tag.icon} fa-fw`} />}
              createdAt={tag.date.format('dddd, MMMM Do YYYY, h:mm:ss a')}
            >
            BLAH BALH
          </TimelineEvent>
        );
      })}
      </Timeline>
    );
  }
}
