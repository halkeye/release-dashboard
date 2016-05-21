'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import GithubCorner from 'react-github-corner';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';

const token = document.querySelector('meta[name=gh-token]').attributes.content.value;
const Config = window.Config;
const fetchOptions = {
  headers: {
    'Authorization': 'token ' + token
  }
};

class App extends React.Component {

  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    fetch('https://api.github.com/repos/' + Config.config_repo + '/git/trees/master', fetchOptions)
      .then(response => response.json())
      .then(data => data.tree.find(x => x.path === 'config.json').url)
      .then(url => fetch(url, fetchOptions))
      .then(response => response.json())
      .then((blob) => {
        const config = JSON.parse(window.atob(blob.content.replace(/\s/g, '')));
        this.setState({ projects: config });
      }).catch(error => this.setState({ error: 'error fetching config:' + error }));
  }

  render() {
    if (this.state.error) { return <div>Error Projects from {Config.config_repo} - {this.state.error}</div>; }
    if (!this.state.projects) { return <div>Loading Projects from {Config.config_repo}</div>; }
    return <Projects projects={this.state.projects.repos} />;
  }

}

const tagForProject = function (project) {
  if (project.tag) { return Promise.resolve(project.tag); }
  return fetch('https://api.github.com/repos/' + project.repo + '/tags', fetchOptions)
    .then(response => response.json())
    .then(tags => tags[0].name);
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
        .then(tag => fetch('https://api.github.com/repos/' + project.repo + '/commits?sha=' + tag, fetchOptions))
        .then(response => response.json())
        .then((commits) => {
          this.setState({ ['commit_' + project.repo]: commits[0] });
        });
    });
  }
  render() {
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        {
          this.props.projects.map((project) => {
            const commit = this.state['commit_' + project.repo];
            if (!commit) { return; }
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
