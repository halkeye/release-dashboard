import React from 'react';
import PropTypes from 'prop-types';

import Project from './Project.js';

export default class Projects extends React.Component {
  static propTypes = {
    projects: PropTypes.array.isRequired
  };

  render () {
    return (
      <div>
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
