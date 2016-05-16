'use strict';
(function() {
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
        window.fetch('https://api.github.com/repos/saucelabs/' + project + '/commits?sha=deployed-latest', fetchOptions)
          .then(response => response.json())
          .then((commits) => {
            this.setState({ ['commit_' + project]: commits[0].commit });
          });
      });
    }
    render() {
      return (<div className="container-fluid">{this.props.projects.map((project) => {
        return (
          <div className="well project" key={project}>
            <Project name={project} commit={this.state['commit_' + project]} />
          </div>
        );
      })}</div>);
    }
  }

  ReactDOM.render(
    <Projects projects={projects}/>,
    document.getElementById('content')
  );
})();
