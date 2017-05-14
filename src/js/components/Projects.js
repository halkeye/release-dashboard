import React from 'react';

import GithubCorner from 'react-github-corner';
import Project from './Project.js';

export default class Projects extends React.Component {
  static propTypes = {
    projects: React.PropTypes.array.isRequired
  };

  render () {
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        <div className="projectsContainer">{
          this.props.projects.map(project => {
            return <Project
              key={project.repo}
              project={project}
            />;
          })
        }</div>
      </div>
    );
  }
}
