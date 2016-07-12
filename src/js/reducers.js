import { combineReducers } from 'redux'
import {
  INIT,
  RECEIVE_ERROR,
  RECEIVE_PROJECT,
  RECEIVE_TAGS_FOR_PROJECT,
  RECEIVE_COMMITS_FOR_PROJECT
} from './actions'

function projects(state = [], action) {
  switch (action.type) {
    case RECEIVE_PROJECT:
      return state.filter(project => project.repo != action.project.repo).concat(
        Object.assign({tags:[]}, action.project)
      );
    case RECEIVE_TAGS_FOR_PROJECT:
      return state.map(project => {
        if (project.repo === action.project.repo) {
          return Object.assign({}, project, { tags: action.tags });
        }
        return project;
      });
    case RECEIVE_COMMITS_FOR_PROJECT:
      return state.map(project => {
        if (project.repo === action.project.repo) {
          return Object.assign({}, project, { commits: action.commits });
        }
        return project;
      });
    default:
      return state
  }
}

function config(state = {}, action) {
  switch (action.type) {
    case INIT:
      return { token: action.token }
    default:
      return state
  }
}

function errors(state = [], action) {
  switch (action.type) {
    case RECEIVE_ERROR:
      return state.concat([action.error])
    default:
      return state
  }
}

const rootReducer = combineReducers({
  config,
  errors,
  projects
})

export default rootReducer
