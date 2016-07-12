import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { init, fetchConfig } from '../actions'
import Projects from '../components/Projects.js';

class AsyncApp extends Component {

  componentDidMount() {
    const { dispatch, token, config_repo } = this.props
    dispatch(init(token))
    dispatch(fetchConfig(config_repo))
  }

  render() {
    const { projects } = this.props
    return <Projects projects={projects} />;
  }
}

AsyncApp.propTypes = {
  token: PropTypes.string.isRequired,
  config_repo: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(AsyncApp)
