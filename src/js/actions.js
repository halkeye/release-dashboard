import fetch from 'isomorphic-fetch'
import naturalSort from 'javascript-natural-sort';
import atob from 'atob';

const alphaSortTags = (a, b) => naturalSort(a.name, b.name);

export const RECEIVED_CONFIG = 'RECEIVED_CONFIG'
export const RECEIVED_COMMIT = 'RECEIVED_COMMIT'
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'
export const INIT = 'INIT'


function githubFetch(url, token) {
  const options = token ? {
    headers: {
      'Authorization': `token ${token}`
    }
  } : {};

  return fetch(url, options).then(function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  })
  .then(response => response.json());
}

export function init(token) {
  return {
    type: INIT,
    token: token
  };
}


export function fetchConfig(repo) {
  return (dispatch, getState) => {
    const token = getState().config.token;
    return githubFetch(`https://api.github.com/repos/${repo}/git/trees/master`, token)
      .then(data => data.tree.find(x => x.path === 'config.json').url)
      .then(url => githubFetch(url, token))
      .then(blob => JSON.parse(atob(blob.content.replace(/\s/g, ''))))
      .then(projects => dispatch(receivedConfig(projects.repos)));
  };
}

function receivedCommits(project, commits) {
  return {
    type: RECEIVED_COMMIT,
    project: project.repo,
    commits: commits,
    lastUpdated: Date.now()
  };
}

export function receivedConfig(projects) {
  return (dispatch, getState) => {
    const token = getState().config.token;
    const action = {
      type: RECEIVED_CONFIG,
      projects: projects
    };
    dispatch(action);
    projects.forEach(project => {
      dispatch(receiveProject(project));
      getCommits(token, project).then(commits => {
        dispatch(receivedCommits(project, commits))
      });
    });
  }
}

function receiveProject(project) {
  return {
    type: RECEIVE_PROJECT,
    project: project,
    lastUpdated: Date.now()
  }
}

function getCommits(token, project) {
  return tagsForProject(token, project).then(tags => {
    project.tags = tags;
    project.commits = [];
    if (tags.length > 1) {
      return compareSha(token, project, tags[0].name, tags[1].name)
      .then(commits => project.commits = commits.reverse());
    } else {
      return getCommit(token, project, tags[0])
      .then(commit => project.commits = [commit]);
    }
  });
}


function getTagInfo(token, project, tag) {
  return githubFetch(tag.commitUrl, token)
    .then(info => {
      tag.tagger = info.tagger || info.committer;
      return tag;
    });
}

function tagsForProject(token, project) {
  if (project.annotatedTagFormat) {
    const re = new RegExp(project.annotatedTagFormat);
    return githubFetch(`https://api.github.com/repos/${project.repo}/git/refs/tags`, token)
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
}

function getCommit(token, project, sha) {
  return githubFetch(`https://api.github.com/repos/${project.repo}/commits?sha=${sha}`, token)
    .then(commits => { return processCommit(commits[0]); });
}

function processCommit(commit) {
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

function compareSha(token, project, sha1, sha2) {
  return githubFetch(`https://api.github.com/repos/${project.repo}/compare/${sha2}...${sha1}`, token)
    .then(json => { return json.commits.map(commit => processCommit(commit)) });
}

/*
function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    }
  }
}
*/
