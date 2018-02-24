import React from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import { numberToColorHsl } from '../color';

/* External Components */
import MDSpinner from 'react-md-spinner';

/* Internal Components */
import TagHeader from './TagHeader.js';
import Commit from './Commit.js';

import projectStaleness from '../projectStaleness.js';

export default class Project extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };
  render () {
    const project = this.props.project;
    const useTarget = !!this.props.project.deployTargetInterval;
    const cardStyle = {};

    const commits = (project.tags[0] || {}).commits;

    // if the config has a deployIntervalTarget, retrieve; default is deploying
    // once per day
    if (commits && useTarget) {
      const depTargetInt = this.props.project.deployTargetInterval || 1;
      const staleness = projectStaleness(new Date(project.tags[1].tagger.date), depTargetInt);
      cardStyle.backgroundColor = numberToColorHsl(staleness);
    }

    const githubImgUrl = require('../../img/GitHub-Mark-32px.png');
    const githubCompareLink = `https://github.com/${project.repo}/compare/${project.tags.slice(0, 2).map(tag => tag.name).sort().join('...')}`;

    return (
      <div className="card" style={cardStyle}>
        <div className="header">
          <div className="info">
            <TagHeader tag={project.tags[0]} project={project} />
          </div>
        </div>
        <div className="body">
          <h2>
            {project.tags.slice(0, 2).map(tag => tag.name).join('...')}
            <a className="compareLink" href={githubCompareLink}><img src={githubImgUrl} alt="compare on github" /></a>
          </h2>
          { commits && commits.map((commit) => <Commit key={commit.sha} project={project} commit={commit} />) }
          { !commits && <MDSpinner /> }
        </div>
      </div>
    );
  }
}
