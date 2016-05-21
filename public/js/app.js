'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';
import GithubCorner from 'react-github-corner';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';

import {memoize} from 'lodash';

const token = document.querySelector('meta[name=gh-token]').attributes.content.value;
const Config = window.Config;
const fetchOptions = {
  headers: {
    'Authorization': 'token ' + token
  }
};

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
      ;

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
    if (this.state.error) { return <div>Error Projects from {Config.config_repo} - {this.state.error}</div>; }
    if (!this.state.projects) { return <div>Loading Projects from {Config.config_repo}</div>; }
    return <Projects projects={this.state.projects.repos} />;
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
    const time = moment(commit.commit.committer.date).calendar() +
      ' (' +
      moment(commit.commit.committer.date).fromNow() +
      ')';

    return (
      <Card key={project.repo} style={{ width: '20em', height: '20em', margin: '1.5em', float: 'left' }}>
        <CardTitle title={project.repo} subtitle={time} />
        <CardHeader
          title={commit.commit.author.name}
          subtitle={commit.commit.author.email}
          avatar={commit.committer.avatar_url}
        />
        <CardText>
          {commit.commit.message}
        </CardText>
      </Card>
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
        {
          this.props.projects.map(project => {
            return <Project
              key={project.repo}
              project={project}
              commit={this.state['commit_' + project.repo]}
            />;
          })
        }
      </div>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme()}><App /></MuiThemeProvider>,
  document.getElementById('content')
);
