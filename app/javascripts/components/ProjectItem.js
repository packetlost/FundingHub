import React, { Component } from 'react';
import web3 from '../helpers/web3Helper';

class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {project: props.project, projectName: "", setProject: props.setProject};
    var _this = this;
    props.project.campaign.call().then(function(result) {
      _this.setState({projectName: result[3]});
      return null;
    }).catch(function(e) {
      console.error(e);
    });
    props.project.active.call().then(function(result) {
      console.log(result);
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
    this.state.setProject(this.state.project);
  }
}

export default ProjectItem;
