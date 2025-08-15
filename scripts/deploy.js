const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Deploying VotingContract...")

  // Deploy the contract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract")
  const votingContract = await VotingContract.deploy()

  await votingContract.waitForDeployment()

  const contractAddress = await votingContract.getAddress()
  console.log("VotingContract deployed to:", contractAddress)

  // Save contract info to JSON file
  const contractInfo = {
    address: contractAddress,
    abi: JSON.stringify(VotingContract.interface.format("json")),
  }

  const contractsDir = path.join(__dirname, "../lib/contracts")
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true })
  }

  fs.writeFileSync(path.join(contractsDir, "deployed-contract.json"), JSON.stringify(contractInfo, null, 2))

  console.log("Contract info saved to lib/contracts/deployed-contract.json")

  // Verify contract if on a live network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await votingContract.deploymentTransaction().wait(6)

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      })
      console.log("Contract verified on BaseScan")
    } catch (error) {
      console.log("Verification failed:", error.message)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
