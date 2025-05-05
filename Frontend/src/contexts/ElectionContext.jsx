import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast,Toaster } from "react-hot-toast";
import { ethers } from 'ethers';

import axios from "axios";
import { electionServer, server } from "../App.jsx";

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
    setSelectedCandidate('');
    setShowVoteModal(true);
    };

    const handleVote = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!selectedCandidate) {
            throw new Error('Please select a candidate.');
            }

            if (!window.ethereum) {
            throw new Error('Please install MetaMask.');
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            await new Promise((resolve) => setTimeout(resolve, 1500));

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
        connectWallet()
        try {
            const {data} = await axios.get(`${electionServer}/get-election`);

            // const data = [{
            //     "title": "Prime minister 02",
            //     "startDate": "2023-05-15T00:00:00.000Z",
            //     "endDate": "2023-05-20T14:30:00.000Z",
            //     "description": "no",
            //     "status": "Active",
            //     "candidates": [
            //       {
            //         "name": "sandeep giri",
            //         "votes": 0,
            //         "_id": "68184cc3ae1ef68d9b2b96f2"
            //       },
            //       {
            //         "name": "Shruti sharma",
            //         "votes": 0,
            //         "_id": "68184cc3ae1ef68d9b2b96f3"
            //       }
            //     ],
            //     "_id": "68184cc3ae1ef68d9b2b96f1",
            //     "createdAt": "2025-05-05T05:29:39.495Z",
            //     "updatedAt": "2025-05-05T05:29:39.495Z",
            //     "__v": 0
            //   },];
            setElections(data);
            console.log(data)
        } catch (err) {
            setError('Failed to load elections.');
        } finally {
            setIsLoading(false);
        }
    }

    const createElection = async (electionData)=> {
        try{
            const res =await axios.post(`${electionServer}/create-election`, electionData);
            console.log(res.data);
        }catch(err){
            console.log(err.message);
            toast.error(err.message);
        }
    }

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




