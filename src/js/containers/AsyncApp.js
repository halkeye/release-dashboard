import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { init, fetchConfig } from '../actions';
import GithubCorner from 'react-github-corner';
import Projects from '../components/Projects.js';
import TimelineView from '../components/TimelineView.js';

import 'react-tabs/style/react-tabs.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { hot } from 'react-hot-loader';

class AsyncApp extends React.Component {
  componentDidMount () {
    const { dispatch, token, configRepo } = this.props;
    dispatch(init(token));
    dispatch(fetchConfig(configRepo));
  }

  render () {
    const { projects } = this.props;
    return (
      <div>
        <GithubCorner href="https://github.com/halkeye/release-dashboard" />
        <Tabs>
          <TabList>
            <Tab>Changelog</Tab>
            <Tab>Timeline</Tab>
          </TabList>
          <TabPanel>
            <Projects projects={projects} />
          </TabPanel>
          <TabPanel>
            <TimelineView projects={projects} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

AsyncApp.propTypes = {
  token: PropTypes.string.isRequired,
  configRepo: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps (state) {
  return state;
}

export default hot(module)(connect(mapStateToProps)(AsyncApp));
