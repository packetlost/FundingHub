import React from 'react';

const Navigation = ({accountBalance}) => {

  return (
    <nav className="navbar navbar-inverse navbar-static-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">FundingHub</a>
        </div>
        <div className="collapse navbar-collapse" id="navbar-collapse-1">
          <p className="navbar-text navbar-right" id="accountBalance">Account Balance: <span id="cb_balance">{accountBalance}</span></p>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
