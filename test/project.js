contract('FundingHub', function(accounts) {
  it("should refund an incomplete project", function() {
    var hub = FundingHub.deployed();
    return hub.createProject(20000000000000000000, parseInt(Math.floor(Date.now() / 1000) + 30), 'Test Campaign', {from: web3.eth.coinbase, gas: 3000000}).then(function(result) {
      console.log(result);
      var project = Project.at(result);
      return hub.contribute(result, {from: web3.eth.coinbase, value: 5000000000000000000, gas: 3000000});
    }).delay(30000).then(function(tx_id){
      console.log(tx_id);
      assert.equal(web3.getBalance(result), 5000000000000000000, "Funding was not successful");
      return hub.contribute(result, {from: web3.eth.coinbase, value: 5000000000000000000, gas: 3000000});
    }).then(function(tx_id2) {
      console.log(tx_id2);
      return project.refund();
    }).then(function(refundResult){
      assert.equal(web3.getBalance(result), 0, "Amount was not refunded");
    }).catch(function(e){
      console.error(e);
    });
  });
});
