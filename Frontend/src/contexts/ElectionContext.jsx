import { createContext, useContext, useState } from "react";
import { toast,Toaster } from "react-hot-toast";
import { ethers } from 'ethers';
import { castVote, getDeployedElections, getFactoryContract } from "../Utils/contractUtils.js";


const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
    
    const [walletAddress, setWalletAddress] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [showVoteModal, setShowVoteModal] = useState(false);

    const connectWallet = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!window.ethereum) {
            throw new Error('Please install MetaMask or another Ethereum wallet.');
            }
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWalletAddress(accounts[0]);
            localStorage.setItem("walletAddress",accounts[0]);
            setIsWalletConnected(true);
            toast.success('Wallet connected successfully!');
        } catch (err) {
            setError(err.message || 'Failed to connect wallet.');
        } finally {
            setIsLoading(false);
        }
    };

    const openVoteModal = (election) => {
    if (!isWalletConnected) {
        setError('Please connect your wallet to vote.');
        return;
    }
    if (election.status !== 'Active') {
        setError('Voting is not available for this election.');
        return;
    }
    setSelectedElection(election);
    // console.log(election)
    setSelectedCandidate('');
    setShowVoteModal(true);
    };

    const handleVote = async (e, election, candidate) => {
        e.preventDefault();
        // console.log(e)
        setIsLoading(true);
        setError('');
        setSuccess('');

        let candidateId = -1;
        for (let idx = 0; idx < election.candidates.length; idx++) {
            if(election.candidates[idx].name == candidate){
                candidateId = idx;
                break;
            }
        }
        if(candidateId == -1){
            setError("Invalid vote");
            return;
        }

        try {
            if (!selectedCandidate) {
            throw new Error('Please select a candidate.');
            }

            if (!window.ethereum) {
            throw new Error('Please install MetaMask.');
            }
            // const provider = new ethers.BrowserProvider(window.ethereum);
            // const signer = await provider.getSigner();
            // await new Promise((resolve) => setTimeout(resolve, 1500));

            const res = await castVote(election.electionAddress, candidateId);
            if(!res.success){
                setError(res.message);
                return;
            }
            setSuccess(`Successfully voted for ${selectedCandidate} in ${selectedElection.title}!`);
            setShowVoteModal(false);
        } catch (err) {
            setError(err.message || 'Failed to cast vote.');
        } finally {
            setIsLoading(false);
        }
    };
    


    const fetchElections = async () => {
        setIsLoading(true);
        if(localStorage.getItem("walletAddress")){
            setWalletAddress(localStorage.getItem("walletAddress"));
            setIsWalletConnected(true);
        }
        // try {
        //     const {data} = await axios.get(`${electionServer}/get-election`);
        //     setElections(data);
        //     // console.log(data)
        // } catch (err) {
        //     setError('Failed to load elections.');
        try {
            const data = await getDeployedElections();
            setElections(data);
        } catch (err) {
            setError('Failed to fetch elections:', err);
        }
        finally {
            setIsLoading(false);
        }
    }

    // const createElection = async (electionData)=> {
    //     try{
    //         const res =await axios.post(`${electionServer}/create-election`, electionData);
    //         console.log(res.data);
    //     }catch(err){
    //         console.log(err.message);
    //         toast.error(err.message);
    //     }
    // }

    const createElection = async ({ title, description, startDate, endDate, candidates }) => {
        try {
            const factory = await getFactoryContract();
            const formattedCandidates = candidates.map((c) => c.name);
            const start = Math.floor(new Date(startDate).getTime() / 1000); // UNIX timestamp
            const end = Math.floor(new Date(endDate).getTime() / 1000);

            const tx = await factory.createElection(title, description, start, end, formattedCandidates);
            await tx.wait(); // Wait for transaction to be mined
            toast.success("Election created Successfully")
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <ElectionContext.Provider value={{
            walletAddress,setElections,setError,error,openVoteModal,elections,isLoading,
            success,showVoteModal,setShowVoteModal,isWalletConnected,
            setIsLoading,connectWallet,selectedElection,fetchElections,handleVote,selectedCandidate,
            setSelectedCandidate,createElection
        }}>
            {children}
            <Toaster />
        </ElectionContext.Provider>
    );
};

export const ElectionData = () => useContext(ElectionContext);




