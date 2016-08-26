import "./Project.sol";

/**
 * @title FundingHub
 * @author Paul Szczesny
 * A decentralized Crowd-funding platform on Ethereum
 */
contract FundingHub {

  address public admin;
  address[] public activeProjects;
  address[] public finishedProjects;

  function FundingHub() {
     admin = msg.sender;
  }

  function () {
    throw;
  }

  function getActiveProjectCount() constant returns(uint count){
    return activeProjects.length;
  }

  function getFinishedProjectCount() constant returns(uint count){
    return finishedProjects.length;
  }

  /**
   * This function should allow a user to add a new project to the FundingHub. The function should deploy
   * a new Project contract and keep track of its address. The createProject function should accept all
   * constructor values that the Project contract requires.
   */
  function createProject(uint _amount, uint _deadline, string _title) returns (Project createdProject){
    Project newProject = new Project(_amount, _deadline, _title);
    activeProjects.push(newProject);
    return newProject;
  }

  /**
   * This function allows users to contribute to a Project identified by its address. contribute calls the
   * fund function in the individual Project contract and passes on all value attached to the function call.
   */
  function contribute(address _project) {
    Project theProject = Project(_project);
    theProject.fund.value(msg.value)();
  }

  /**
   * Moves a project from 'active' state to 'finished'
   */
  function deactiveProject() {
    for(uint i = 0; i < activeProjects.length; i++) {
      if(activeProjects[i] == msg.sender) {
        activeProjects[i] = activeProjects[activeProjects.length-1];
        finishedProjects.push(msg.sender);
        activeProjects.length--;
      }
    }
  }
}
