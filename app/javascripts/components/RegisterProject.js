import React, { Component } from 'react';
import web3 from '../helpers/web3Helper';
import Status from './template/status';
import Moment from 'moment';
import DateTime from "react-datetime";

class RegisterProject extends Component {
  constructor(props) {
    super(props);
    this.state = {fundingHub: props.fundingHub, setStatus: props.setStatus, setActiveProjectList:props.setActiveProjectList};
  }

  render = () => (
    <div>
      <form className="col-md-6 col-md-offset-3 well">
        <h2 className="text-center">Register Project</h2>
        <Status statusMessage={this.state.statusMessage} statusType={this.state.statusType} />
        <div className="form-group col-md-12">
          <label>Name</label>
          <input type="text" className="form-control" name="name" id="name" placeholder="Project Name" onChange={this.bindState('name')} />
        </div>
        <div className="form-group col-md-12">
          <label htmlFor="price">Target (ETH)</label>
          <div className="input-group">
            <div className="input-group-addon">&Xi;</div>
            <input type="text" className="form-control" id="amount" name="amount" placeholder="Target Amount (Ether)" onChange={this.bindState('amount')} />
          </div>
        </div>
        <div className="form-group col-md-12">
          <label>Deadline</label>
          <div className="input-group">
            <div className="input-group-addon"><i className="fa fa-calendar"></i></div>
            <DateTime id="deadline" onChange={this.bindDate()} placeholder="Deadline" />
          </div>
        </div>
        <div className="col-md-12">
          <button type="button" id="RegisterProjectFormButton" className="btn btn-primary" onClick={event => this.handleSubmit(event)}>Create Project</button>
        </div>
      </form>
    </div>
  )

  bindState = (property) => {
  	return (event) => {
      this.setState({ [property]: event.target.value });
    };
  }

  bindDate = () => {
    return (event) => {
      this.setState({deadline: event.unix()});
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.state.setStatus('Registering Project...', 'warning');
    var _this = this;
    var hub = this.state.fundingHub;
    //setStatus("Initiating transaction... (please wait)");
    hub.createProject(web3.toWei(parseInt(this.state.amount), "ether"), this.state.deadline, this.state.name.toLowerCase(), {from: web3.eth.defaultAccount, gas: 3000000}).then(function (tx_id) {
      console.log(tx_id);
      return web3.eth.getTransactionReceiptMined(tx_id);
    }).then(function(receipt) {
      _this.state.setStatus('Project Created. TXID: ' + receipt.transactionHash, 'success');
      _this.state.setActiveProjectList();
      console.log(receipt);
    }).catch(function (e) {
      console.log(e);
      //setStatus("Error adding product: " + e.message, "danger");
    });
  }
}

export default RegisterProject;
