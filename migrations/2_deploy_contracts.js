var Swapoffchains = artifacts.require("./Swapoffchains.sol");

module.exports = function(deployer) {
	Promise.all([
		deployer.deploy(Swapoffchains),		
	])
	.then(()=>{
		console.log("/******* Smart Contract deployed successfully! *******/");
	})
  
};
