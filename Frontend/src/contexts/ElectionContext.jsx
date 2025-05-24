import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import {
  castVote,
  getDeployedElections,
  getFactoryContract,
  winnerName,
} from "../Utils/contractUtils.js";
import { UserData } from "./UserContext.jsx";

const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [showVoteModal, setShowVoteModal] = useState(false);

  const [filteredElections, setFilteredElections] = useState([]);
  const [errorRes, setErrorRes] = useState("");

  const {user} = UserData();

  const connectWallet = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Ethereum wallet.");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      localStorage.setItem("walletAddress", accounts[0]);
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (err) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const openVoteModal = (election) => {
    if (!isWalletConnected) {
      setError("Please connect your wallet to vote.");
      return;
    }
    if (election.status !== "Active") {
      setError("Voting is not available for this election.");
      return;
    }
    setSelectedElection(election);
    // console.log(election)
    setSelectedCandidate("");
    setShowVoteModal(true);
  };

  const handleVote = async (e, election, candidate) => {
    e.preventDefault();
    // console.log(e)
    setIsLoading(true);
    setError("");
    setSuccess("");

    let candidateId = -1;
    for (let idx = 0; idx < election.candidates.length; idx++) {
      if (election.candidates[idx].name == candidate) {
        candidateId = idx;
        break;
      }
    }
    if (candidateId == -1) {
      setError("Invalid vote");
      return;
    }

    try {
      if (!selectedCandidate) {
        throw new Error("Please select a candidate.");
      }

      if (!window.ethereum) {
        throw new Error("Please install MetaMask.");
      }
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await castVote(election.electionAddress, candidateId, user.aadharNumber);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setSuccess(
        `Successfully voted for ${selectedCandidate} in ${selectedElection.title}!`
      );
      setShowVoteModal(false);
    } catch (err) {
      setError(err.message || "Failed to cast vote.");
    } finally {
      setIsLoading(false);
    }
  };


  const result = async () => {
    try {

      let completedElections = elections.filter((e) => e.status === "Ended");

      // Sort candidates by votes (descending) for each election
      completedElections.forEach((election) => {
        election.candidates.sort((a, b) => b.votes - a.votes);
        let maxVote = election.candidates[0].votes;
        let winner;

        if(maxVote != 0){
          winner = election.candidates.filter((c) => {
            return c.votes === maxVote;
          })
        }

        election["winner"] = winner; 

      });

      completedElections.reverse();

      // Store in localStorage as a JSON string
      localStorage.setItem(
        "endedElections",
        JSON.stringify(completedElections)
      );

      // Retrieve and parse the data
      const storedElections = localStorage.getItem("endedElections");
      const parsedElections = storedElections
        ? JSON.parse(storedElections)
        : null;

      // Update state
      if (parsedElections) {
        setFilteredElections(parsedElections);
      } else {
        setFilteredElections(completedElections);
      }
    } catch (err) {
      setErrorRes("Failed to load elections: " + err.message);
    }
  };

  const fetchElections = async () => {
    setIsLoading(true);
    // result();
    // Safely handle wallet address
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress); // No need for toString()
      setIsWalletConnected(true);
    }

    const res = JSON.parse(localStorage.getItem("endedElections"));
    if(res){
      setFilteredElections(res)
    }

    try {
      const data = await getDeployedElections();
      setElections(data);
      return data; // Return the data for other functions to use
    } catch (err) {
      setError(`Failed to fetch elections: ${err.message}`);
      console.error("Fetch elections error:", err);
      throw err; // Re-throw if you need error handling upstream
    } finally {
      setIsLoading(false);
    }
  } // Add dependencies if needed

  const createElection = async ({
    title,
    description,
    startDate,
    endDate,
    candidates,
  }) => {
    try {
      const factory = await getFactoryContract();
      const formattedCandidates = candidates.map((c) => c.name);
      const start = Math.floor(new Date(startDate).getTime() / 1000); // UNIX timestamp
      const end = Math.floor(new Date(endDate).getTime() / 1000);

      const tx = await factory.createElection(
        title,
        description,
        start,
        end,
        formattedCandidates
      );
      await tx.wait(); // Wait for transaction to be mined
      toast.success("Election created Successfully");
    } catch (error) {
      toast.error("Failed to create election");
    }
  };

  const handleDis = () => {
    try {
      localStorage.removeItem("walletAddress");
      setIsWalletConnected(false);
      setWalletAddress("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchElections();
  },[])

  // const result = async () => {
  //   fetchElections();
  //   try {
  //     let completedElections = elections.filter((e) => {
  //       return e.status === "Ended";
  //     });

  //     completedElections.forEach(async (election) => {
  //       election.candidates.sort((a, b) => b.votes - a.votes);
  //       // const winner = await winnerName(election.electionAddress);

  //       // election["winner"] = {
  //       //   id: Number(winner.id),
  //       //   name: winner.name,
  //       //   votes: Number(winner.votes),
  //       // };
  //       // console.log("election",election.winner.name)
  //     });

  //     localStorage.setItem("endedElections",completedElections);
  //     console.log("dsvnes",localStorage.getItem("endedElections"));

  //     // if (completedElections.length === 0) {
  //     //   completedElections = [
  //     //     {
  //     //       electionAddress: "sidvndiofv",
  //     //       title: "Student Council Election 2025",
  //     //       description:
  //     //         "Election for the 2025-2026 student council president.",
  //     //       startDate: "2025-05-13T10:00:00+05:30", // IST
  //     //       endDate: "2025-05-13T11:00:00+05:30", // IST
  //     //       status: "Ended",
  //     //       totalVoters: 100,
  //     //       candidates: [
  //     //         { name: "Alice Smith", votes: 50 },
  //     //         { name: "Bob Johnson", votes: 30 },
  //     //         { name: "Charlie Brown", votes: 200 },
  //     //       ],
  //     //     },
  //     //   ];
  //     //   completedElections[0].candidates.sort((a,b) => b.votes - a.votes);
  //     // }else{

  //     // }
  //     // console.log(completedElections);
  //     if(localStorage.getItem("endedElections"))
  //         setFilteredElections(localStorage.getItem("endedElections"));
  //     else{
  //       setFilteredElections(completedElections);
  //     }

  //   } catch (err) {
  //     setErrorRes("Failed to load elections: " + err.message);
  //   }
  // };

  return (
    <ElectionContext.Provider
      value={{
        result,
        walletAddress,
        setElections,
        setError,
        error,
        openVoteModal,
        elections,
        isLoading,
        success,
        showVoteModal,
        setShowVoteModal,
        isWalletConnected,
        setIsLoading,
        connectWallet,
        selectedElection,
        fetchElections,
        handleVote,
        selectedCandidate,
        setSelectedCandidate,
        createElection,
        handleDis,
        filteredElections,
        setFilteredElections,
        errorRes,
      }}
    >
      {children}
      <Toaster />
    </ElectionContext.Provider>
  );
};

export const ElectionData = () => useContext(ElectionContext);
