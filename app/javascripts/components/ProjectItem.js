import React, { Component } from 'react';
import web3 from '../helpers/web3Helper';

class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {project: props.project, projectName: "", setProject: props.setProject};
    var _this = this;
    this.state.project.name.call().then(function(result) {
      _this.setState({projectName: result});
    }).catch(function(e) {
      console.error(e);
    });
  }

  render = () => (
    <div className="col-md-4 text-center">
      <div className="well project project-list">
        <h3>{this.state.projectName}</h3>
        <p><button type="button" className="btn btn-primary" onClick={event => this.handleClick(event)}>Learn More</button></p>
      </div>
    </div>
  )

  handleClick = (event) => {
    event.preventDefault();
    console.log(this.state.project);
    this.state.setProject(this.state.project);
  }
}

export default ProjectItem;
