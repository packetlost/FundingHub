import React, { Component } from 'react';
import Moment from 'moment';
import web3 from '../helpers/web3Helper';
import { ProgressBar } from 'react-bootstrap';

class ProjectSection extends Component {
  constructor(props) {
    super(props);
    this.state = {fundingHub: props.fundingHub, project: props.project, total: parseInt(web3.eth.getBalance(props.project.address))};
    var _this = this;
    props.project.campaign.call().then(function(result) {
      _this.setState({title: result[3], target: parseInt(result[1]), deadline: parseInt(result[2])});
      console.log(parseInt(result[2]));
    }).catch(function(e) {
      console.error(e);
    });
  }

  render = () => {
    return (
    <div className="col-md-12 text-center">
      <h2>{this.state.title}</h2>
      <div className="well project project-home">
        <div className="ribbon">
          <span>{Moment.duration((this.state.deadline - Moment().unix()), "seconds").humanize(true)}</span>
        </div>
        <div className="col-md-12">
          <form className="form-contribute">
            <div className="form-group col-md-5 col-md-offset-2">
              <div className="input-group">
                <div className="input-group-addon">&Xi;</div>
                <input type="text" className="form-control" id="amount" name="amount" placeholder="Amount (Ether)" onChange={this.bindState('amount')} />
              </div>
            </div>
            <div className="col-md-3">
              <button type="button" className="btn btn-primary" onClick={event => this.handlePurchase(event)}>Contribute</button>
            </div>
          </form>
          <br className="clearfix" />
          <div className="col-md-12" id="progressbar">
            <ProgressBar now={(this.state.total/this.state.target) * 100} label={`${(this.state.total/this.state.target)*100}%`} />
          </div>
          <div className="text-right pull-right"><h5><b>Goal: </b>{web3.fromWei(parseInt(this.state.target), "ether")} ETH</h5></div>
          <div className="text-left pull-left"><h5><b>Funded: </b>{web3.fromWei(parseInt(this.state.total), "ether")} ETH</h5></div>
        </div>
        <br className="clearfix" />
      </div>
    </div>
    );
  }

  bindState = (property) => {
    return (event) => {
      this.setState({ [property]: event.target.value });
    };
  }

  handlePurchase = (event) => {
    event.preventDefault();
    var hub = this.state.fundingHub;
    var _project = this.state.project;
    console.log(web3.toWei(parseFloat(this.state.amount), "ether"));

    hub.contribute(this.state.project.address, {from: web3.eth.defaultAccount, gas: 3000000, value: web3.toWei(parseFloat(this.state.amount), "ether")}).then(function(tx_id) {
      console.log(tx_id);
      return web3.eth.getTransactionReceiptMined(tx_id);
    }).then(function(receipt) {
      console.log(receipt);
      // TODO Refresh Balance
    }).catch(function (e) {
      console.log(e);
    });
  }
}

export default ProjectSection;
