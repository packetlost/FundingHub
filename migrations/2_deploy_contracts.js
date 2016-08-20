// TODO In truffle, create a migration script that calls the createProject function after FundingHub has been deployed.
module.exports = function(deployer) {
  deployer.deploy(FundingHub).then(function(instance) {
    FundingHub.deployed().createProject(2000000000000000000, 1472601600, 'Paul Campaign');
  });
};
