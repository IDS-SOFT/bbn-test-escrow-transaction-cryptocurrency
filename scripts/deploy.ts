import { ethers } from "hardhat";

async function main() {

  const cryptocurrency = await ethers.deployContract("Cryptocurrency");

  await cryptocurrency.waitForDeployment();

  console.log("Cryptocurrency deployed to : ",await cryptocurrency.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
