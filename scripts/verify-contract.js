const hre = require("hardhat")
const contractInfo = require("../lib/contracts/deployed-contract.json")

async function main() {
  console.log("Verifying contract at:", contractInfo.address)

  try {
    await hre.run("verify:verify", {
      address: contractInfo.address,
      constructorArguments: [],
    })
    console.log("Contract verified successfully!")
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!")
    } else {
      console.error("Error verifying contract:", error.message)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
