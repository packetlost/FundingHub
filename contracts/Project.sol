/**
 * @title Project
 * @author Paul Szczesny
 * A decentralized Crowd-funding platform on Ethereum
 */
contract Project {

  struct Campaign {
    address owner; // the address of the owner of the project
    uint targetAmount; // the amount to be raised (eg 100000 wei)
    uint deadline; // the time until when the amount has to be raised
    string title; // Title of the crowd-funding project
  }

  address public fundingHub;
  Campaign public campaign;
  mapping (address => uint) contributions; // A map of address and their corresponding contribution amount
  address[] contributors;
  bool public isActive;

  modifier isOpen() {
    if(!isActive) throw;
    _
  }

  modifier isExpired() {
    if(campaign.deadline >= block.timestamp) throw;
    _
  }

  modifier isFunded() {
    if(this.balance != campaign.targetAmount) throw;
    _
  }

  modifier hasValue() {
    if(msg.value <= 0) throw;
    _
  }

  modifier isHub() {
    if(msg.sender != fundingHub) throw;
    _
  }

  function Project(uint _amount, uint _deadline, string _title) {
    isActive = true;
    campaign = Campaign(tx.origin, _amount, _deadline, _title);
    fundingHub = msg.sender;
  }

  function () {
    throw;
  }

  /**
   * This is the function called when the FundingHub receives a contribution. The function must keep track
   * of the contributor and the individual amount contributed. If the contribution was sent after the deadline
   * of the project passed, or the full amount has been reached, the function must return the value to the
   * originator of the transaction and call one of two functions. If the full funding amount has been reached,
   * the function must call payout. If the deadline has passed without the funding goal being reached, the
   * function must call refund.
   */
  function fund(address _funder) isHub hasValue isOpen returns (bool success) {
    uint newBalance = this.balance + msg.value;
    // If before deadline and below targetAmount, proceed normally
    if(campaign.deadline > block.timestamp && newBalance < campaign.targetAmount) {
      if(addContribution(_funder, msg.value) != true) throw;
      return true;
    }
    // If the deadline is over, refund the current amount, then check status for payout/refund
    else if(campaign.deadline < block.timestamp) {
      if(!_funder.send(msg.value)) throw;
      // If the targetAmount has been reached, payout the owner
      if(this.balance >= campaign.targetAmount) {
        if(payout() != true) throw;
      }
      // Otherwise refund
      else if(refunder() != true) throw;
      return false;
    }
    // If deadline isn't over but the targetAmount is breached
    else if(campaign.deadline >= block.timestamp && newBalance >= campaign.targetAmount) {
      uint refund = newBalance - campaign.targetAmount;
      if(refund > 0) {
        if(!_funder.send(refund)) throw;
      }
      if(addContribution(_funder, msg.value - refund) != true) throw;
      else if(payout() != true) throw;
      return true;
    }
    else {
      // Should never happen
      throw;
    }
  }

  function addContribution(address _contributor, uint _value) private returns(bool success) {
    uint contributed = contributions[_contributor];
    contributions[_contributor] = contributed + _value;
    if(contributed == 0) contributors.push(_contributor);
    return true;
  }

  /**
   * This is the function that sends all funds received in the contract to the owner of the project.
   */
  function payout() private isFunded returns (bool success) {
    isActive = false;
    if(!campaign.owner.send(this.balance)) throw;
  }

  /**
   * This function sends all individual contributions back to the respective contributor.
   */
  function refunder() private isExpired returns (bool success) {
    isActive = false;
    for(uint i = 0; i < contributors.length; i++) {
      if(!contributors[i].send(contributions[contributors[i]])) throw;
    }
    return true;
  }

}
