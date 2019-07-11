import axios from 'axios';
import naturalSort from 'javascript-natural-sort';
import atob from 'atob';

const alphaSortTags = (a, b) => naturalSort(a.name, b.name);

export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const RECEIVE_COMMIT = 'RECEIVE_COMMIT';
export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const RECEIVE_TAGS_FOR_PROJECT = 'RECEIVE_TAGS_FOR_PROJECT';
export const RECEIVE_COMMITS_FOR_PROJECT = 'RECEIVE_COMMITS_FOR_PROJECT';
export const RECEIVE_COMMITS_FOR_TAG = 'RECEIVE_COMMITS_FOR_TAG';
export const INIT = 'INIT';

function githubFetch (url, token) {
  const options = token ? {
    json: true,
    headers: {
      Authorization: `token ${token}`
    }
  } : {};

  return axios(url, options).then(response => response.data);
}

export function init (token) {
  return {
    type: INIT,
    token: token
  };
}

export function receiveError (method, err) {
  console.log('receiveError', arguments); // eslint-disable-line
  return {
    type: RECEIVE_ERROR,
    method,
    error: err
  };
}

export function fetchConfig (repo) {
  return (dispatch, getState) => {
    const token = getState().config.token;
    return githubFetch(`https://api.github.com/repos/${repo}/git/trees/master`, token)
      .then(data => data.tree.find(x => x.path === 'config.json').url)
      .then(url => githubFetch(url, token))
      .then(blob => JSON.parse(atob(blob.content.replace(/\s/g, ''))))
      .then(projects => dispatch(receivedConfig(projects.repos)))
      .catch(err => dispatch(receiveError('fetchConfig', err)));
  };
}

export function receivedConfig (projects) {
  return (dispatch) => {
    return projects.map(project => {
      dispatch(receiveProject(project));
    });
  };
}

export function receiveProject (project) {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_PROJECT,
      project: project,
      lastUpdated: Date.now()
    });
    dispatch(fetchTagsForProject(project));
  };
}

export function fetchTagsForProject (project) {
  return (dispatch, getState) => {
    const token = getState().config.token;
    return tagsForProject(token, project).then(tags => {
      dispatch(recieveTagsForProject(project, tags));
    });
  };
}

function recieveTagsForProject (project, tags) {
  return (dispatch, getState) => {
    const token = getState().config.token;
    dispatch({
      type: RECEIVE_TAGS_FOR_PROJECT,
      project: project,
      tags: tags,
      lastUpdated: Date.now()
    });

    return tags.reverse().map((tag, idx) => {
      // can't get a diff for the last one
      if (!tags[idx + 1]) { return Promise.resolve(); }
      return githubFetch(`https://api.github.com/repos/${project.repo}/compare/${tags[idx + 1].name}...${tag.name}`, token)
        .then(json => {
          if (!json.commits) {
            console.log('gavin', json, `https://api.github.com/repos/${project.repo}/compare/${tags[idx + 1].name}...${tag.name}`);
          }
          return json;
        })
        .then(json => { return json.commits.map(commit => processCommit(commit)); })
        .then(commits => commits.reverse())
        .then(commits => dispatch({
          type: RECEIVE_COMMITS_FOR_TAG,
          commits: commits,
          project: project,
          tag: tag,
          lastUpdated: Date.now()
        }));
    });
  };
}

function getTagInfo (token, project, tag) {
  return githubFetch(tag.commitUrl, token)
    .then(info => {
      tag.tagger = info.tagger || info.committer;
      return tag;
    });
}

function tagsForProject (token, project) {
  if (project.tag) {
    return Promise.resolve([{
      name: project.tag
    }]);
  } else if (project.annotatedTagFormat) {
    const re = new RegExp(project.annotatedTagFormat);
    return githubFetch(`https://api.github.com/repos/${project.repo}/git/refs/tags`, token)
    // .then(tags => tags.filter(tag => tag.object.type.includes('tag'))) // annotated only
      .then(tags => tags.filter(tag => re.test(tag.ref.substr('refs/tags/'.length))))
      .then(tags => tags.map(tag => {
        return {
          sha: tag.object.sha,
          name: tag.ref.substr('refs/tags/'.length),
          commitUrl: tag.object.url
        };
      }))
      .then(tags => tags.sort(alphaSortTags))
      .then(tags => tags.slice(-5))
      .then(tags => Promise.all(tags.map(tag => getTagInfo(token, project, tag))));
  }
  return Promise.reject(new Error(`Not sure how to handle ${project}`));
}

function processCommit (commit) {
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
