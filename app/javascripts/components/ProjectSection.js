import React, { Component } from 'react';
import Moment from 'moment';
import web3 from '../helpers/web3Helper';
import { ProgressBar } from 'react-bootstrap';

class ProjectSection extends Component {
  constructor(props) {
    super(props);
    this.state = {setStatus: props.setStatus, fundingHub: props.fundingHub, project: props.project, total: parseInt(web3.eth.getBalance(props.project.address))};
    var _this = this;
    props.project.campaign.call().then(function(result) {
      var progress = Math.round( parseFloat(_this.state.total/parseInt(result[1])) * 10000) / 100;
      console.log(progress);
      _this.setState({title: result[3], target: parseInt(result[1]), deadline: parseInt(result[2]), progress: progress});
      return _this.state.project.successful.call();
    }).then(function(success){
      console.log("successful: " + success);
      if(success == true) _this.setState({progress: 100});
    }).catch(function(e) {
      console.error(e);
    });
    props.project.refundable.call().then(function(result){
      if(result == true) _this.setState({refundable: true});
    });

    props.project.active.call().then(function(result) {
      console.log("Active:" + result);
    });
    props.project.refundable.call().then(function(result) {
      console.log("Refundable: " + result);
    });
    props.project.contributions.call("0x7806651b958d79e475f5a26536c67d5f20cc7141").then(function(result) {
      console.log("Contributions: " + parseInt(result));
    });
    props.project.campaign.call().then(function(result) {
      console.log("Campaign Owner: " + result[0]);
    });
  }

  render = () => {
    var ribbon; var content;
    if (this.state.progress == 100 && web3.eth.getBalance(this.state.project.address) > 0) {
      ribbon = (
        <div className="ribbon">
          <span className="success">FUNDED</span>
        </div>
      );
      content = (
        <div>
          <h3>Project Funded Successfully!</h3>
          <div className="col-md-12" id="progressbar">
            <ProgressBar now={100} label="100%" bsStyle="success" />
          </div>
          <button type="button" className="btn btn-success" onClick={event => this.handlePayout(event)}>Payout</button>
        </div>
      );
    } else if(this.state.progress == 100) {
      ribbon = (
        <div className="ribbon">
          <span className="success">FUNDED</span>
        </div>
      );
      content = (
        <div>
          <h3>Project Funded Successfully!</h3>
          <div className="col-md-12" id="progressbar">
            <ProgressBar now={100} label="100%" bsStyle="success" />
          </div>
        </div>
      );
    }
    else if(this.state.refundable == true) {
      ribbon = (
        <div className="ribbon">
          <span>UNFUNDED</span>
        </div>
      );
      content = (
        <div>
          <h3>Project Not Funded</h3>
          <button type="button" className="btn btn-danger" onClick={event => this.handleRefund(event)}>Refund Me</button>
        </div>
      );
    }
    else {
      ribbon = (
        <div className="ribbon">
          <span>{Moment.duration((this.state.deadline - Moment().unix()), "seconds").humanize(true)}</span>
        </div>
      );
      content = (
        <div>
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
            <ProgressBar now={(this.state.progress)} label={`${(this.state.progress)}%`} bsStyle="success" />
          </div>
          <div className="text-right pull-right"><h5><b>Goal: </b>{web3.fromWei(parseInt(this.state.target), "ether")} ETH</h5></div>
          <div className="text-left pull-left"><h5><b>Funded: </b>{web3.fromWei(parseInt(this.state.total), "ether")} ETH</h5></div>
        </div>
      );
    }

    return (
    <div className="col-md-12 text-center">
      <h2>{this.state.title}</h2>
      <div className="well project project-home">
        {ribbon}
        <div className="col-md-12">
          {content}
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
    this.state.setStatus('Sending Contribution...', 'warning');
    var _this = this;
    var hub = this.state.fundingHub;
    var _project = this.state.project;
    console.log(web3.toWei(parseFloat(this.state.amount), "ether"));
    hub.contribute(this.state.project.address, {from: web3.eth.defaultAccount, gas: 3000000, value: web3.toWei(parseFloat(this.state.amount), "ether")}).then(function(tx_id) {
      console.log(tx_id);
      return web3.eth.getTransactionReceiptMined(tx_id);
    }).then(function(receipt) {
      console.log(receipt);
      _this.state.setStatus('Contribution sent. TXID: ' + receipt.transactionHash, 'success');
    }).catch(function (e) {
      console.log(e);
    });
  }

  handlePayout = (event) => {
    event.preventDefault();
    this.state.setStatus('Paying out...', 'warning');
    var _project = this.state.project;
    var _this = this;
    _project.payout({from: web3.eth.defaultAccount, gas: 3000000}).then(function(tx_id) {
      return web3.eth.getTransactionReceiptMined(tx_id);
    }).then(function(receipt) {
      _this.state.setStatus('Payout sent. TXID: ' + receipt.transactionHash, 'success');
      console.log(receipt);
    }).catch(function(e){
      console.error(e);
      _this.state.setStatus('Could not send payout.', 'danger');
    });
  }

  handleRefund = (event) => {
    event.preventDefault();
    var _this = this;
    this.state.setStatus('Refunding...', 'warning');
    var _project = this.state.project;
    _project.refund({from: web3.eth.defaultAccount, gas: 3000000}).then(function(tx_id) {
      return web3.eth.getTransactionReceiptMined(tx_id);
    }).then(function(receipt) {
      _this.state.setStatus('Refund sent. TXID: ' + receipt.transactionHash, 'success');
      console.log(receipt);
    }).catch(function(e){
      console.error(e);
      _this.state.setStatus('Could not send refund.', 'danger');
    });
  }
}

export default ProjectSection;
