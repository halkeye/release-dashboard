'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import GithubCorner from 'react-github-corner';

import Progress from 'essence-progress';
import UserAvatar from 'react-user-avatar';
import SmartTimeAgo from 'react-smart-time-ago';

import {memoize} from 'lodash';

import './app.scss';

window.WebFontConfig = {
  google: { families: [ 'Roboto:400,700:latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

const token = document.querySelector('meta[name=gh-token]').attributes.content.value;
const Config = window.Config;
const fetchOptions = {
  headers: {
    'Authorization': 'token ' + token
  }
};

//const Progress = () => { return <div></div>; }

const getConfig = memoize(function () {
  return fetch('https://api.github.com/repos/' + Config.config_repo + '/git/trees/master', fetchOptions)
    .then(response => response.json())
    .then(data => data.tree.find(x => x.path === 'config.json').url)
    .then(url => fetch(url, fetchOptions))
    .then(response => response.json())
    .then(blob =>  JSON.parse(window.atob(blob.content.replace(/\s/g, ''))))
});

const tagForProject = memoize(function (project) {
  if (project.tag) { return Promise.resolve(project.tag); }
  return fetch('https://api.github.com/repos/' + project.repo + '/tags', fetchOptions)
    .then(response => response.json())
    .then(tags => tags[0].name);
});

const getCommit = memoize(function (project, sha) {
  return fetch('https://api.github.com/repos/' + project.repo + '/commits?sha=' + sha, fetchOptions)
    .then(response => response.json());
});

class App extends React.Component {

  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    getConfig()
      .then(config => this.setState({ projects: config }))
      .catch(error => this.setState({ error: 'error fetching config:' + error }));
  }

  render() {
    if (this.state.projects) { return <Projects projects={this.state.projects.repos} />; }
    return (
      <div>
        <br />
        <br />
        <br />
        <Progress type={'circle'} color={'black'} />
        {this.state.projects && <div>Loading Projects from {Config.config_repo}</div>}
        {this.state.error && <div>Error - {this.state.error}</div>}
      </div>
    );
  }

}

class Project extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    commit: React.PropTypes.object
  };
  constructor() {
    super();
    this.state = { };
  }
  render() {
    const commit = this.props.commit;
    const project = this.props.project;

    if (!commit) { return <div />; }

    return (
      <div className="card">
        <div className="header">
          <div className="info">
            <div className="repo">{project.repo.split('/')[1]}</div>
            <span className="ago"><SmartTimeAgo value={new Date(commit.commit.committer.date)} /></span>
            <span> by </span>
            <span className="author">{commit.commit.author.name}</span>
          </div>
          <UserAvatar size='60' name={commit.commit.author.name} src={commit.committer.avatar_url} className="avatar" />
        </div>
        <div className="body">
          {commit.commit.message}
        </div>
        <div className="footer">
          Card footer with action buttons
        </div>
      </div>
    );
  }
}


class Projects extends React.Component {
  static propTypes = { projects: React.PropTypes.array.isRequired };

  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    this.props.projects.forEach((project) => {
      tagForProject(project)
        .then(tag => getCommit(project, tag))
        .then(commits => {
          this.setState({ ['commit_' + project.repo]: commits[0] });
        });
    });
  }
  render() {
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        <div className="projectsContainer">{
          this.props.projects.map(project => {
            return <Project
              key={project.repo}
              project={project}
              commit={this.state['commit_' + project.repo]}
            />;
          })
        }</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
