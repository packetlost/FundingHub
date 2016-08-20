import React, { Component } from 'react';
import ProjectItem from './ProjectItem';

const ProjectList = (props) => {
  //console.log(props.productList);
  if(props.projectList.length < 1) {
    return <div><h2>No Projects</h2></div>
  }

  const ProjectItems = props.projectList.map((project) => {
    console.log(project);
    return (
      <ProjectItem key={project} project={props.Project.at(project)} setProject={props.setProject} />
    );
  });

  return (
    <div id="shops" className="col-md-12">
      {ProjectItems}
    </div>
  );
}

export default ProjectList;
