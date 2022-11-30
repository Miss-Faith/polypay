const main = async () => {

  // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const payContractFactory = await hre.ethers.getContractFactory('PayPortal');
    const payContract = await payContractFactory.deploy();
  
    await payContract.deployed(); // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy.
  
   console.log("Pay Contract deployed to:", payContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  