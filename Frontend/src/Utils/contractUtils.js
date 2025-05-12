import { ethers } from "ethers";
import ElectionFactoryABI from "../../../Contract/artifacts/contracts/ElectionFactory.sol/ElectionFactory.json";
import ElectionABI from "../../../Contract/artifacts/contracts/Election.sol/Election.json";

const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this
//npx hardhat run scripts/deployFactory.js --network localhost

export const getFactoryContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }
  
    const provider = new ethers.BrowserProvider(window.ethereum); // v6
    const signer = await provider.getSigner(); // must use await here
  
    return new ethers.Contract(FACTORY_ADDRESS, ElectionFactoryABI.abi, signer);
  } catch (error) {
    alert(error.message);
  }
};

export const getElectionDetails = async (address) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const election = new ethers.Contract(address, ElectionABI.abi, signer);
    const details = await election.getDetails(); // This calls the Solidity function

    const [title, description, startTimestamp, endTimestamp, candidateNames, status] = details;

    console.log("return data is: ", {
      address,
      title,
      description,
      startDate: new Date(Number(startTimestamp) * 1000),
      endDate: new Date(Number(endTimestamp) * 1000),
      candidates: candidateNames.map((name) => ({ name })),
      status
    })
    return {
      address,
      title,
      description,
      startDate: new Date(Number(startTimestamp) * 1000),
      endDate: new Date(Number(endTimestamp) * 1000),
      candidates: candidateNames.map((name) => ({ name })),
      status
    };
  } catch (error) {
    console.error("Error getting election details:", error.message);
    return null;
  }
};

export const getDeployedElections = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
  
    const factory = new ethers.Contract(FACTORY_ADDRESS, ElectionFactoryABI.abi, signer);
    const count = await factory.getElectionCount(); // returns array of addresses
    
    const elections = [];
    for (let i = 0; i < count; i++) {
      let e = await factory.getElectionDetails(i);
      
      let candi = await factory.getElectionCandidates(i);

      let candidates = []
      for (let j = 0; j < candi[0].length; j++) {
          let candidate = []
          for (let k = 0; k < 3; k++) {
              candidate.push(candi[k][j]);
          }
          let x = {
            name: candidate[0],
            votes: candidate[1],
            id: candidate[2],
          }
          candidates.push(x);
      }
      
      let obj = {
        title: e.title,
        electionAddress: e.electionAddress,
        description: e.description,
        startDate: new Date(Number(e.startDate) * 1000),
        endDate: new Date(Number(e.endDate) * 1000),
        status: new Date(Number(e.startDate) * 1000) > new Date() ? 'Pending' : new Date(Number(e.endDate) * 1000) > new Date() ? 'Active' : 'Ended',
        candidates,
      };
      console.log(obj.title,obj.status);
      elections.push(obj);
    }
    return elections;

  } catch (error) {
    console.log(error.message)
  }
};

export const castVote = async (electionAddress, candidateId) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      ElectionFactoryABI.abi,
      signer
    );

    // Convert candidateId to BigInt if needed
    let bigIntCandidateId = 0;
    if(candidateId != 0){
      bigIntCandidateId = BigInt(candidateId)
    }

    // Estimate gas with BigInt parameters
    const gasEstimate = await factory.vote.estimateGas(
      electionAddress,
      bigIntCandidateId
    );
    
    // console.log(electionAddress,bigIntCandidateId)

    // Add 20% buffer and convert to BigInt
    const gasLimit = BigInt(Math.floor(Number(gasEstimate) * 1.2));

    const tx = await factory.vote(electionAddress, bigIntCandidateId);

    // const receipt = await tx.wait(2);
    console.log("success")
    return {
      success: true,
      // transactionHash: receipt.hash,
      // blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error('Voting failed:', error.message);
    
    // Improved error parsing
    let errorMessage = 'Failed to cast vote';
    if (error?.info?.error?.data?.message) {
      errorMessage = error.info.error.data.message.replace('execution reverted: ', '');
    } else if (error?.reason) {
      errorMessage = error.reason;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      detailedError: error
    };
  }
};

