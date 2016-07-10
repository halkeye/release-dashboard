/*eslint-env node, mocha */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../src/js/actions.js';

import expect from 'expect';
import nock from 'nock';
import {
	nockReleaseDashboardConfigTreesMaster,
	nockReleaseDashboardConfigBlob
} from './fixtures/nock_fixtures.js';

import { omit } from 'lodash';


var appendLogToFile = function(content) {
	require('fs').appendFile('record.txt', content);
}

nock.recorder.rec({ logging: appendLogToFile });

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('actions', function() {
	afterEach(function() {
		nock.cleanAll()
	})

  describe('fetchConfig', function() {
    before(function() {
			nockReleaseDashboardConfigTreesMaster();
			nockReleaseDashboardConfigBlob();

      this.store = mockStore({ config: { token: null } });
      return this.store.dispatch(actions.fetchConfig('halkeye/release-dashboard-config'))
    });
    it('Dispatch events for each recieved project', function() {
			const expectedActions = [
				{
          "projects": [
            { "annotatedTagFormat": "^v[0-9.]+$", "deployTargetInterval": 14, "repo": "appium/appium" },
            { "annotatedTagFormat": "^sauce-ondemand-[0-9.]+$", "deployTargetInterval": false, "repo": "saucelabs/jenkins-sauce-ondemand-plugin" },
            { "annotatedTagFormat": "^ci-sauce-[0-9.]+$", "deployTargetInterval": false, "repo": "saucelabs/ci-sauce" }
          ],
          "type": "RECEIVED_CONFIG"
        },
        {
          "project": { "annotatedTagFormat": "^v[0-9.]+$", "deployTargetInterval": 14, "repo": "appium/appium" },
          "type": "RECEIVE_PROJECT"
        },
        {
          "project": { "annotatedTagFormat": "^sauce-ondemand-[0-9.]+$", "deployTargetInterval": false, "repo": "saucelabs/jenkins-sauce-ondemand-plugin" },
          "type": "RECEIVE_PROJECT"
        },
        {
          "project": { "annotatedTagFormat": "^ci-sauce-[0-9.]+$", "deployTargetInterval": false, "repo": "saucelabs/ci-sauce" },
          "type": "RECEIVE_PROJECT"
        }
      ];
			expect(this.store.getActions().map(obj => omit(obj, ['lastUpdated']))).toEqual(expectedActions)
    });
  })
});
