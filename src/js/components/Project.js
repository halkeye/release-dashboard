import React from 'react';

/* Libraries */
import { numberToColorHsl } from '../color';

/* External Components */
import Progress from 'essence-progress';

/* Internal Components */
import TagHeader from './TagHeader.js';
import Commit from './Commit.js';

function projectStaleness(lastUpDate, target = 1) {
  let daysAgo = (Date.now() - lastUpDate.getTime()) / 1000 / 60 / 60 / 24;
  // magic coefficient that shapes the staleness curve
  // experimentally determined!!!
  let stalenessCoeff = 1 / (2.4 * Math.pow(target, 0.7));
  // generate a 1/(sqrt(x)+1)-type curve with some fiddly awesomeness
  let staleness = (Math.pow((stalenessCoeff * daysAgo) + 1, -1)) /
                  ((stalenessCoeff * Math.sqrt(daysAgo)) + 1);
  return staleness;
}

export default class Project extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired
  };
  render() {
    const project = this.props.project;
    const useTarget = !!this.props.project.deployTargetInterval;
    const cardStyle = {};

    const commits = project.commits;

    // if the config has a deployIntervalTarget, retrieve; default is deploying
    // once per day
    if (commits && useTarget) {
      const depTargetInt = this.props.project.deployTargetInterval || 1;
      const staleness = projectStaleness(new Date(project.tags[0].tagger.date), depTargetInt);
      cardStyle.backgroundColor = numberToColorHsl(staleness);
    }

    return (
      <div className="card" style={cardStyle}>
        <div className="header">
          <div className="info">
            <TagHeader tag={project.tags[project.tags.length-1]} project={project} />
          </div>
        </div>
        <div className="body">
          <h2>{project.tags.slice(0,2).map(tag=>tag.name).join('...')}</h2>
          { commits && commits.map((commit) => <Commit key={commit.sha} project={project} commit={commit} />) }
          { !commits && <Progress type={'circle'} color={'black'} /> }
        </div>
      </div>
    );
  }
}

