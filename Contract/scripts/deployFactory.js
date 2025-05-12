const hre = require("hardhat");

async function main() {
  // Step 1: Load contract factory
  const Factory = await hre.ethers.getContractFactory("ElectionFactory");

  // Step 2: Deploy it
  const factory = await Factory.deploy();

  // Step 3: Wait for deployment
  await factory.waitForDeployment(); // ✅ use this with Hardhat >=2.17

  // Step 4: Log deployed address
  console.log("ElectionFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
