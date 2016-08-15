// TODO In truffle, create a migration script that calls the createProject function after FundingHub has been deployed.
module.exports = function(deployer) {
  deployer.deploy(FundingHub);
  deployer.autolink();
  deployer.deploy(Project);
};
