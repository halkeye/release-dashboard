/* eslint-env node, mocha */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../src/js/actions.js';

import expect from 'expect';
import nock from 'nock';
import {
	nockReleaseDashboardConfigTreesMaster,
	nockReleaseDashboardConfigBlob,
  nockReposAppiumGitRefsTags,
  nockReposJenkinsGitRefsTags,
  nockReposCiSauceGitRefsTags
} from './nock_fixtures.js';

import { omit } from 'lodash';

// nock.recorder.rec({ logging: function(content) { require('fs').appendFile('record.txt', content); } });

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('actions', function () {
  afterEach(function () { nock.cleanAll(); });

  describe('fetchConfig', function () {
    before(function () {
      nockReleaseDashboardConfigTreesMaster();
      nockReleaseDashboardConfigBlob();
      nockReposAppiumGitRefsTags();
      nockReposJenkinsGitRefsTags();
      nockReposCiSauceGitRefsTags();

      this.store = mockStore({ config: { token: null } });
      return this.store.dispatch(actions.fetchConfig('halkeye/release-dashboard-config'));
    });
    it('Dispatch events for each recieved project', function () {
      const expectedActions = [
        {
          'project': { 'annotatedTagFormat': '^v[0-9.]+$', 'deployTargetInterval': 14, 'repo': 'appium/appium' },
          'type': 'RECEIVE_PROJECT'
        },
        {
          'project': { 'annotatedTagFormat': '^sauce-ondemand-[0-9.]+$', 'deployTargetInterval': false, 'repo': 'saucelabs/jenkins-sauce-ondemand-plugin' },
          'type': 'RECEIVE_PROJECT'
        },
        {
          'project': { 'annotatedTagFormat': '^ci-sauce-[0-9.]+$', 'deployTargetInterval': false, 'repo': 'saucelabs/ci-sauce' },
          'type': 'RECEIVE_PROJECT'
        }
      ];
      expect(this.store.getActions().map(obj => omit(obj, ['lastUpdated']))).toEqual(expectedActions);
    });
  });
  describe('receiveProject', function () {
    before(function () {
      nockReposAppiumGitRefsTags();

      this.store = mockStore({ config: { token: null } });
      return this.store.dispatch(actions.receiveProject({ 'repo': 'appium/appium', 'annotatedTagFormat': '^v[0-9.]+$', 'deployTargetInterval': 14 }));
    });
    it('Dispatch events for each recieved project', function () {
      const expectedActions = [
        {
          'project': {
            'annotatedTagFormat': '^v[0-9.]+$',
            'deployTargetInterval': 14,
            'repo': 'appium/appium'
          },
          'type': 'RECEIVE_PROJECT'
        }
      ];
      const recievedActions = this.store.getActions().map(obj => omit(obj, ['lastUpdated']));
      expect(recievedActions).toEqual(expectedActions);
    });
  });
});
/*
"tags": [
  {
    "commitUrl": "https://api.github.com/repos/appium/appium/git/tags/0c39422cb3fd243db00a2f0225be7452a2627cd8",
    "name": "v1.5.2",
    "tagger": { "date": "2016-04-20T17:46:57Z", "email": "isaac@saucelabs.com", "name": "Isaac Murchie" }
  },
  {
    "commitUrl": "https://api.github.com/repos/appium/appium/git/commits/dc865428e6a78ed6b8153132d6e50b9afc8c4570",
    "name": "v1.5.1",
    "tagger": { "date": "2016-03-29T18:49:04Z", "email": "murchieisaac@gmail.com", "name": "Isaac A. Murchie" }
  }
]
*/

//        require('./fixtures/commits.json')
