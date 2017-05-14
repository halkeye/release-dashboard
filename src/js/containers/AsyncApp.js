import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { init, fetchConfig } from '../actions';
import Projects from '../components/Projects.js';

import 'react-tabs/style/react-tabs.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class AsyncApp extends Component {
  componentDidMount () {
    const { dispatch, token, config_repo } = this.props;
    dispatch(init(token));
    dispatch(fetchConfig(config_repo));
  }

  render () {
    console.log('render');
    const { projects } = this.props;
    return (
      <Tabs>
        <TabList>
          <Tab>Changelog</Tab>
          <Tab>Timeline</Tab>
        </TabList>
        <TabPanel>
          <Projects projects={projects} />;
        </TabPanel>
        <TabPanel>
          Timeline
        </TabPanel>
      </Tabs>
    );
  }
}

AsyncApp.propTypes = {
  token: PropTypes.string.isRequired,
  config_repo: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps (state) {
  return state;
}

export default connect(mapStateToProps)(AsyncApp);
