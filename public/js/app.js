'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import GithubCorner from 'react-github-corner';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const token = document.querySelector('meta[name=gh-token]').attributes.content.value;
const projects = window.projects;
const fetchOptions = {
  headers: {
    'Authorization': 'token ' + token
  }
};

class GitCommitter extends React.Component {
  render() {
    if (!this.props.name) { return <div/>; }
    return (
      <div>
        <div>
          {this.props.name}
          &nbsp;
          &lt;{this.props.email}&gt;
        </div>
        <div>
          {moment(this.props.date).calendar()}
          &nbsp;
          ({moment(this.props.date).fromNow()})
        </div>
      </div>
    );
  }
}

class Project extends React.Component {
  render() {
    if (!this.props.commit) return <div>{this.props.name}</div>;
    return (
      <div>
        <h1>{this.props.name}</h1>
        <GitCommitter {...this.props.commit.committer} />
        <br />
        <div>{this.props.commit.message}</div>
      </div>
    );
  }
}

class Projects extends React.Component {
  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    this.props.projects.forEach((project) => {
      window.fetch('https://api.github.com/repos/' + project + '/commits?sha=deployed-latest', fetchOptions)
        .then(response => response.json())
        .then((commits) => {
          this.setState({ ['commit_' + project]: commits[0] });
        });
    });
  }
  render() {
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        {
          this.props.projects.map((project) => {
            const commit = this.state['commit_' + project];
            if (!commit) { return; }
            const time = moment(commit.commit.committer.date).calendar() +
              ' (' +
              moment(commit.commit.committer.date).fromNow() +
              ')';

            return (
              <Card key={project} style={{ width: '20em', height: '20em', margin: '1.5em', float: 'left' }}>
                <CardTitle title={project} subtitle={time} />
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
  <MuiThemeProvider muiTheme={getMuiTheme()}><Projects projects={projects}/></MuiThemeProvider>,
  document.getElementById('content')
);
