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

  address public hub;
  Campaign public campaign;
  mapping (address => uint) public contributions; // A map of address and their corresponding contribution amount
  bool public active;
  bool public refundable;
  bool public successful;

  modifier isActive() {
    if(!active) throw;
    _
  }

  modifier isRefundable() {
    if(!refundable) throw;
    _
  }

  modifier isSuccessful() {
    if(!successful) throw;
    _
  }

  modifier isExpired() {
    if(campaign.deadline >= block.timestamp) throw;
    _
  }

  modifier isFunded() {
    if(this.balance < campaign.targetAmount) throw;
    _
  }

  modifier isValueSent() {
    if(msg.value <= 0) throw;
    _
  }

  modifier hasBalance() {
    if(contributions[tx.origin] < 1) throw;
    _
  }

  modifier isHub() {
    if(msg.sender != hub) throw;
    _
  }

  modifier isOwner() {
    if(msg.sender != campaign.owner) throw;
    _
  }

  function Project(uint _amount, uint _deadline, string _title) {
    active = true;
    refundable = false;
    successful = false;
    campaign = Campaign(tx.origin, _amount, _deadline, _title);
    hub = msg.sender;
  }

  function () {
    throw;
  }

  function checkFinished() constant returns (bool isFinished){
    return(!active);
  }

  /**
   * This is the function called when the FundingHub receives a contribution. The function must keep track
   * of the contributor and the individual amount contributed. If the contribution was sent after the deadline
   * of the project passed, or the full amount has been reached, the function must return the value to the
   * originator of the transaction and call one of two functions. If the full funding amount has been reached,
   * the function must call payout. If the deadline has passed without the funding goal being reached, the
   * function must call refund.
   */
  function fund() isHub isValueSent isActive returns (bool isFunded) {
    // If before deadline and below targetAmount, proceed normally
    if(campaign.deadline > block.timestamp && this.balance < campaign.targetAmount) {
      contributions[tx.origin] = msg.value;
      return true;
    }
    // If deadline isn't over or target hasn't been reached
    else {
      active = false;
      FundingHubInterface(hub).deactiveProject();
      // Deadline hasn't been reached but target is
      if(campaign.deadline > block.timestamp && this.balance >= campaign.targetAmount) {
        successful = true;
        uint refund = this.balance - campaign.targetAmount;
        contributions[tx.origin] += (msg.value - refund);
        if(refund > 0) {
          if(!tx.origin.send(refund)) throw;
        }
        return true;
      }
      // If the deadline is over, refund the current amount, then check status for payout/refund
      else {
        refundable = true;
        if(!tx.origin.send(msg.value)) throw;
        return true;
      }
      return true;
    }
  }

  /**
   * This is the function that sends all funds received in the contract to the owner of the project.
   */
  function payout() public isOwner isFunded isSuccessful returns (bool success) {
    if(!campaign.owner.send(campaign.targetAmount)) throw;
    return true;
  }

  /**
   * This function sends individual contributions back to the respective contributor.
   */
  function refund() public isExpired hasBalance isRefundable returns (bool success) {
    uint refundAmount = contributions[tx.origin];
    contributions[tx.origin] = 0;
    if(!tx.origin.send(refundAmount)) throw;
    return true;
  }
}

contract FundingHubInterface {function deactiveProject();}
