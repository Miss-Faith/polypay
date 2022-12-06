const main = async () => {
  const payContractFactory = await hre.ethers.getContractFactory(
    "PayPortal"
  );
  const payContract = await payContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await payContract.deployed();
  console.log("Pay Contract deployed to:", payContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    payContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Let's try to buy an item
   */
  const payTxn = await payContract.buyPay(
    "This is payment #1",
    "idris",
    ethers.utils.parseEther("0.001")
  );
  await payTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(
    payContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allPay = await payContract.getAllPay();
  console.log(allPay);
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