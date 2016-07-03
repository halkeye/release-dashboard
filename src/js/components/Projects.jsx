import React from 'react';

import GithubCorner from 'react-github-corner';
import Project from './Project.jsx';


export default class Projects extends React.Component {
  static propTypes = {
    projects: React.PropTypes.array.isRequired,
    commits: React.PropTypes.object
  };

  render() {
    const commits = this.props.commits || {};
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        <div className="projectsContainer">{
          this.props.projects.map(project => {
            return <Project
              key={project.repo}
              project={project}
              commits={commits[project.repo]}
            />;
          })
        }</div>
      </div>
    );
  }
}
