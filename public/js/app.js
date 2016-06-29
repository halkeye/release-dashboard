'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import GithubCorner from 'react-github-corner';

import Progress from 'essence-progress';
import UserAvatar from 'react-user-avatar';
import SmartTimeAgo from 'react-smart-time-ago';

import naturalSort from 'javascript-natural-sort';
import md5 from 'md5';

import { numberToColorHsl } from './color';
import './app.scss';

window.WebFontConfig = {
  google: { families: [ 'Roboto:400,700:latin', 'Roboto+Mono:400,700:latin' ] }
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

const alphaSortTags = (a, b) => naturalSort(a.name, b.name);

const getConfig = function () {
  return fetch('https://api.github.com/repos/' + Config.config_repo + '/git/trees/master', fetchOptions)
    .then(response => response.json())
    .then(data => data.tree.find(x => x.path === 'config.json').url)
    .then(url => fetch(url, fetchOptions))
    .then(response => response.json())
    .then(blob =>  JSON.parse(window.atob(blob.content.replace(/\s/g, ''))))
};

const getCommits = function (project) {
  return tagsForProject(project).then(tags => {
    project.tags = tags;
    project.commits = [];
    if (tags.length > 1) {
      return compareSha(project, tags[0].name, tags[1].name)
      .then(commits => project.commits = commits.reverse());
    } else {
      return getCommit(project, tags[0])
      .then(commit => project.commits = [commit]);
    }
  });
};


const getTagInfo = function(project, tag) {
  return fetch(tag.commitUrl, fetchOptions)
    .then(response => response.json())
    .then(info => {
      tag.tagger = info.tagger || info.committer;
      return tag;
    });
};

const tagsForProject = function (project) {
  if (project.annotatedTagFormat) {
    const re = new RegExp(project.annotatedTagFormat);
    return fetch('https://api.github.com/repos/' + project.repo + '/git/refs/tags', fetchOptions)
        .then(response => response.json())
        //.then(tags => tags.filter(tag => tag.object.type.includes('tag'))) // annotated only
        .then(tags => tags.filter(tag => re.test(tag.ref.substr('refs/tags/'.length))))
        .then(tags => tags.map(tag => { return {
          name: tag.ref.substr('refs/tags/'.length),
          commitUrl: tag.object.url
        }; }))
        .then(tags => tags.sort(alphaSortTags))
        .then(tags => tags.slice(-2).reverse())
        .then(tags => Promise.all(tags.map((tag) => getTagInfo(project,tag))))
  }
  else if (project.tag) {
    return Promise.resolve([{
      name: project.tag
    }]);
  }
};

const getCommit = function (project, sha) {
  return fetch('https://api.github.com/repos/' + project.repo + '/commits?sha=' + sha, fetchOptions)
    .then(response => response.json())
    .then(commits => { return processCommit(commits[0]); });
};

const processCommit = function (commit) {
  commit.author = commit.author || {};
  commit.committer = commit.committer || {};

  return {
    message: commit.commit.message.replace(/Merge pull request #\d+ from \w+\/[^ ]+/, ''),
    sha: commit.sha,
    date: commit.commit.author.date,
    author: {
      name: commit.commit.author.name,
      email: commit.commit.author.email,
      avatar_url: commit.author.avatar_url,
      login: commit.author.login
    },
    committer: {
      name: commit.commit.committer.name,
      email: commit.commit.committer.email,
      avatar_url: commit.committer.avatar_url,
      login: commit.committer.login
    }
  };
}

const compareSha = function (project, sha1, sha2) {
  return fetch(`https://api.github.com/repos/${project.repo}/compare/${sha2}...${sha1}`, fetchOptions)
    .then(response => response.json())
    .then(json => { return json.commits.map(commit => processCommit(commit)) });
};

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

class App extends React.Component {

  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    getConfig()
      .then(projects => {
        return projects.repos.map(project => {
          project.tags = [];
          return project;
        });
      })
      .then(projects => {
        this.setState({ projects: projects });
        return projects;
      })
      .then(projects => {
        projects.forEach((project) => {
          getCommits(project).then(commits => {
            let _commits = this.state.commits || {};
            _commits[project.repo] = commits;
            this.setState({ commits: _commits });
          });
        });
      });
      /*
      .catch(error => {
        console.error(error); // eslint-disable-line
        this.setState({ error: 'error fetching config:' + error })
      });
      */
  }

  render() {
    if (this.state.projects) { 
      return <Projects projects={this.state.projects} commits={this.state.commits} />; 
    }
    return (
      <div>
        <br />
        <br />
        <br />
        <Progress type={'circle'} color={'black'} />
        {!this.state.projects && <div>Loading Projects from {Config.config_repo}</div>}
        {this.state.error && <div>Error - {this.state.error}</div>}
      </div>
    );
  }

}

class Commit extends React.Component {
  static propTypes = {
    commit: React.PropTypes.object.isRequired
  };
  render() {
    return (
      <div className="commit">
        <span className="message" title={this.props.commit.message}>{this.props.commit.message}</span>
        <span className="author">{this.props.commit.author.name}</span>
        <span className="sha">[{this.props.commit.sha.slice(0,6)}]</span>
      </div>
    );
  }
}


class TagHeader extends React.Component {
  static propTypes = { 
    project: React.PropTypes.object,
    tag: React.PropTypes.object 
  };
  render() {
    const repoName = this.props.project.repo.split('/')[1];
    if (!this.props.tag) {
      return <div className="repo">{repoName}</div>
    }
    const tag = this.props.tag;
    const avatarUrl = `http://www.gravatar.com/avatar/${md5(tag.tagger.email)}`;
    console.log(tag.tagger);
    return (
      <div>
        <UserAvatar size='60' name={tag.tagger.name} src={avatarUrl} className="avatar" />
        <div className="repo">{repoName}</div>
        <span className="ago"><SmartTimeAgo value={new Date(tag.tagger.date)} /></span>
        <span> by </span>
        <span className="author">{tag.tagger.name}</span>
      </div>
    );
  }
}

class Project extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    commits: React.PropTypes.array
  };
  render() {
    const project = this.props.project;
    const useTarget = !!this.props.project.deployTargetInterval;
    const cardStyle = {};

    const commits = this.props.commits;

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
            <TagHeader tag={project.tags[0]} project={project} />
          </div>
        </div>
        <div className="body">
          <h2>{project.tags.slice(0,2).reverse().map(tag=>tag.name).join('...')}</h2>
          { commits && commits.map((commit) => <Commit key={commit.sha} commit={commit} />) }
          { !commits && <Progress type={'circle'} color={'black'} /> }
        </div>
      </div>
    );
  }
}


class Projects extends React.Component {
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

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
