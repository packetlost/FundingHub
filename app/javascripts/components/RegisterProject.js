import React, { Component } from 'react';
import web3 from '../helpers/web3Helper';
import Status from './template/status';

class RegisterProject extends Component {
  constructor(props) {
    super(props);
    this.state = {fundingHub: props.fundingHub, setStatus: props.setStatus};
  }

  render = () => (
    <div>
      <form className="col-md-6 col-md-offset-3 well">
        <h2 className="text-center">Register Project</h2>
        <Status statusMessage={this.state.statusMessage} statusType={this.state.statusType} />
        <div className="form-group col-md-12">
          <input type="text" className="form-control" name="name" id="name" placeholder="Project Name" onChange={this.bindState('name')} />
        </div>
        <div className="form-group col-md-12">
          <label className="sr-only" htmlFor="price">Amount (in Ether)</label>
          <div className="input-group">
            <div className="input-group-addon">&Xi;</div>
            <input type="text" className="form-control" id="amount" name="amount" placeholder="Target Amount (Ether)" onChange={this.bindState('amount')} />
          </div>
        </div>
        <div className="form-group col-md-12">
          <input type="text" className="form-control" name="deadline" id="deadline" placeholder="Project Deadline" onChange={this.bindState('deadline')} />
        </div>
        <div className="col-md-12">
          <button type="button" id="RegisterProjectFormButton" className="btn btn-primary" onClick={event => this.handleSubmit(event)}>Create Project</button>
        </div>
      </form>
    </div>
  )

  bindState = (property) => {
  	return (event) => { this.setState({ [property]: event.target.value }); };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    var hub = this.state.fundgingHub;
    //setStatus("Initiating transaction... (please wait)");
    hub.createProject(web3.toWei(this.state.amount, "ether"), this.state.deadline, this.state.name.toLowerCase(), {from: web3.eth.defaultAccount, value: web3.toWei(1, "ether"), gas: 3000000}).then(function (tx_id) {
      console.log(tx_id);
      //setStatus("Product added successfully", "success");
    }).catch(function (e) {
      console.log(e);
      //setStatus("Error adding product: " + e.message, "danger");
    });
  }
}

export default RegisterProject;
