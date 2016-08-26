import {} from "../stylesheets/app.scss";

import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

import web3 from './helpers/web3Helper';
import FundingHub from '../../build/contracts/FundingHub.sol.js';
import Project from '../../build/contracts/Project.sol.js';
FundingHub.setProvider(web3.currentProvider);
Project.setProvider(web3.currentProvider);

import Navigation from './components/template/Navigation';
import Status from './components/template/status';
import Footer from './components/template/Footer';

import RegisterProject from './components/RegisterProject';
import ProjectList from './components/ProjectList';
import ProjectSection from './components/ProjectSection';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fundingHub: FundingHub.deployed(),
      currentProject: null,
      currentProjectAddress: null,
      activeProjectList: [],
      finishedProjectList: [],
      statusMessage: "",
      statusType: "",
      defaultAccount: web3.eth.defaultAccount,
      accountBalance: web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount), "ether").toFixed(5)+ " ETH",
      contractAddress: FundingHub.deployed().address,
      contractBalance: web3.fromWei(web3.eth.getBalance(FundingHub.deployed().address), "ether").toFixed(5),
      isAdmin: false
    };
    this.setActiveProjectList();
    this.setFinishedProjectList();
  }

  render = () => {
    var mainContent;
    var _this = this;
    if (this.state.currentProjectAddress == null) {
      mainContent = (
        <div id="content">
          <h1>FundingHub <span className="subheading">Decentralized Crowdfunding</span></h1>
          <RegisterProject fundingHub={this.state.fundingHub} setStatus={this.setStatus} setActiveProjectList={this.setActiveProjectList}/>
          <br className="clearfix" />
          <h2>Active Projects</h2>
          <ProjectList projectList={this.state.activeProjectList} Project={Project} setProject={this.setProject} />
          <h2>Finished Projects</h2>
          <ProjectList projectList={this.state.finishedProjectList} Project={Project} setProject={this.setProject} />
        </div>);
    } else {
      mainContent = <ProjectSection fundingHub={this.state.fundingHub} project={this.state.currentProject} setStatus={this.setStatus} />;
    }

    return (
      <div id="site-content">
        <Navigation accountBalance={this.state.accountBalance} />
        <div className="container site-content">
          <Status statusMessage={this.state.statusMessage} statusType={this.state.statusType}/>
          {mainContent}
        </div>
        <Footer contractAddress={this.state.contractAddress} contractBalance={this.state.contractBalance} />
      </div>
    );
  }

  setActiveProjectList = () => {
    var _this = this;
    var _deployed = FundingHub.deployed();
    _deployed.getActiveProjectCount.call().then(function(result) {
      console.log(parseInt(result));
      var _projectList = [];
      for(var i = 0; i < parseInt(result); i++) {
        _projectList.push(_deployed.activeProjects.call(i));
      }
      return Promise.all(_projectList).then(function(projectArray) {
        console.log(projectArray);
        _this.setState({activeProjectList: projectArray});
      }).catch(function(e) {
        console.error(e);
      });
    }).catch(function(e) {
      console.error(e);
    });
  }

  setFinishedProjectList = () => {
    var _this = this;
    var _deployed = FundingHub.deployed();
    _deployed.getFinishedProjectCount.call().then(function(result) {
      console.log(parseInt(result));
      var _projectList = [];
      for(var i = 0; i < parseInt(result); i++) {
        _projectList.push(_deployed.finishedProjects.call(i));
      }
      return Promise.all(_projectList).then(function(projectArray) {
        console.log(projectArray);
        _this.setState({finishedProjectList: projectArray});
      }).catch(function(e) {
        console.error(e);
      });
    }).catch(function(e) {
      console.error(e);
    });
  }

  setStatus = (message, type) => {
    this.setState({statusMessage: message, statusType: type});
  }

  setProject = (address) => {
    console.log(address);
    this.setState({currentProjectAddress: address.address, currentProject: address});
    console.log("State: " + this.state.currentProjectAddress);
  }
}

// This component's generated HTML and put it on the page (in the DOM)
ReactDOM.render(<App />, document.querySelector('.site'));
