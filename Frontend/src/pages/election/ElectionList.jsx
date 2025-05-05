import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ElectionData } from '../../contexts/ElectionContext';
import { useEffect } from 'react';
import PageLoader from '../../components/PageLoading';
import { Link } from 'react-router-dom';

const ElectionsPage = () => {
  const {walletAddress, error,openVoteModal,elections,isLoading,
    success,connectWallet,showVoteModal, setShowVoteModal, 
    isWalletConnected,selectedElection,fetchElections,handleVote,selectedCandidate,setSelectedCandidate,
    setIsLoading
  } = ElectionData();
  
    // useEffect(() => {
    //     fetchElections();
    // }, []);

    if(isLoading){
      return <PageLoader/>
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px irritating-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Vote in Elections
          </h2>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded"></div>
          <p className="mt-4 text-lg text-gray-600">
            Participate in secure, transparent elections powered by blockchain.
          </p>
          <button onClick={fetchElections}>Fetch elections</button>
        </div>

        <div className="flex justify-between items-center mb-8">
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'animate-pulse'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-6 mr-2" />
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
              <span className="mr-2">Connected:</span>
              <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          )}
          <Link
              to={"/create-election"}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'animate-pulse'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  Create Election
                </>
              )}
            </Link>
        </div>

        

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 animate-slide-in">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 animate-slide-in">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        {isLoading && !showVoteModal && (
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {!isLoading && elections.length === 0 && (
          <div className="text-center text-gray-500 text-lg">No elections available at the moment.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div
              key={election._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50">
                <h3 className="text-xl font-bold text-gray-900">{election.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{election.description}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <span>
                      <span className="font-medium">Start:</span> {new Date(election.startDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <span>
                      <span className="font-medium">End:</span> {new Date(election.endDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <span>
                      <span className="font-medium">Candidates:</span> {election.candidates.map((c) => c.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-500">Status:</span>
                    <span
                      className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        election.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : election.status === 'Active'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {election.status}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => openVoteModal(election)}
                    disabled={election.status !== 'Active' || isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      election.status === 'Active' && !isLoading
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Vote Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && selectedElection && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto p-8 transform transition-all duration-300 scale-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Vote in {selectedElection.title}</h3>
              <button
                onClick={() => setShowVoteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleVote} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Candidate</label>
                <div className="mt-3 space-y-4">
                  {selectedElection.candidates.map((candidate, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                        selectedCandidate === candidate.name ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        id={`candidate-${index}`}
                        name="candidate"
                        type="radio"
                        value={candidate.name}
                        checked={selectedCandidate === candidate.name}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor={`candidate-${index}`} className="ml-3 flex items-center text-sm text-gray-900">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">{candidate.name[0]}</span>
                        </div>
                        {candidate.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 animate-slide-in">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 p-4 animate-slide-in">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{success}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Casting Vote...
                  </>
                  ) : 'Cast Vote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionsPage;



// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import PageLoader from '../../components/PageLoading';
// import BallotABI from '../../../../contract/BallotABI.json'; // Import your ABI file here
// const ElectionsPage = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [proposals, setProposals] = useState([{}]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [showVoteModal, setShowVoteModal] = useState(false);

//   const contractAddress = '0xb8f8c608ae494da676d4cf0073cae79043362084'; // Replace with the deployed contract address

//   const connectWallet = async () => {
//     setIsLoading(true);
//     try {
//       if (!window.ethereum) throw new Error('Please install MetaMask.');
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       setWalletAddress(accounts[0]);
//       setIsWalletConnected(true);
//       setSuccess('Wallet connected successfully!');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProposals = async () => {
//     setIsLoading(true);
//     try {
//       if (!window.ethereum) throw new Error('Please install MetaMask.');
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const contract = new ethers.Contract(contractAddress, BallotABI, provider);
      
//       contract.proposals(["alice","bob"]);
//       // Fetch all proposals
//       const proposalCount = await contract.proposals;

      
//       console.log(proposalCount);
//       for (let i = 0; i < proposalCount; i++) {
//         const proposal = await contract.proposals(i);
//         proposalsArray.push({
//           index: i,
//           name: ethers.decodeBytes32String(proposal.name),
//           voteCount: Number(proposal.voteCount)
//         });
//       }
//       setProposals(proposalsArray);
//     } catch (err) {
//       console.log(err.message);
//       setError('Failed to load proposals: ' + err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVote = async () => {
//     setIsLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       if (!window.ethereum) throw new Error('Please install MetaMask.');
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, BallotABI, signer);

//       const tx = await contract.vote(selectedProposal);
//       await tx.wait();
//       setSuccess('Vote cast successfully!');
//       setShowVoteModal(false);
//       fetchProposals(); // Refresh proposals
//     } catch (err) {
//       setError('Failed to vote: ' + err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openVoteModal = (index) => {
//     setSelectedProposal(index);
//     setShowVoteModal(true);
//   };

//   useEffect(() => {
//     if (isWalletConnected) {
//       fetchProposals();
//     }
//   }, [isWalletConnected]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
//       {isLoading && !showVoteModal && <PageLoader message="Processing..." />}
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
//           Voting Ballot
//         </h2>
//         {!isWalletConnected && (
//           <div className="text-center mb-8">
//             <button
//               onClick={connectWallet}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
//             >
//               Connect Wallet
//             </button>
//           </div>
//         )}
//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-4">
//             <p className="text-sm text-red-800">{error}</p>
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 rounded-lg bg-green-50 p-4">
//             <p className="text-sm text-green-800">{success}</p>
//           </div>
//         )}
//         {isWalletConnected && (
//           <div className="grid grid-cols-1 gap-6">
//             {proposals.map((proposal) => (
//               <div
//                 key={proposal.index}
//                 className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900">{proposal.name}</h3>
//                 <p className="mt-2 text-sm text-gray-600">Votes: {proposal.voteCount}</p>
//                 <button
//                   onClick={() => openVoteModal(proposal.index)}
//                   className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
//                 >
//                   Vote
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {showVoteModal && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Confirm Vote
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Are you sure you want to vote for {proposals[selectedProposal]?.name}?
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowVoteModal(false)}
//                   className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleVote}
//                   className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ElectionsPage;

// // import { useState, useEffect } from 'react';
// // import { ethers } from 'ethers';
// // import { Link } from 'react-router-dom';

// // const ElectionsPage = () => {
// //   // State for wallet connection
// //   const [walletAddress, setWalletAddress] = useState('');
// //   const [isWalletConnected, setIsWalletConnected] = useState(false);

// //   // State for elections
// //   const [elections, setElections] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');

// //   // State for voting modal
// //   const [selectedElection, setSelectedElection] = useState(null);
// //   const [selectedCandidate, setSelectedCandidate] = useState('');
// //   const [showVoteModal, setShowVoteModal] = useState(false);

// //   // Mock elections data (replace with smart contract fetch)
// //   useEffect(() => {
// //     const fetchElections = async () => {
// //       setIsLoading(true);
// //       try {
// //         // Simulate fetching elections from smart contract
// //         const mockElections = [
// //           {
// //             id: 1,
// //             title: 'Presidential Election 2025',
// //             description: 'Choose the next president.',
// //             startDate: new Date(Date.now() - 86400000).toISOString(),
// //             endDate: new Date(Date.now() + 86400000).toISOString(),
// //             candidates: [{ name: 'Alice Smith' }, { name: 'Bob Johnson' }],
// //             status: 'Active',
// //           },
// //           {
// //             id: 2,
// //             title: 'Mayor Election 2025',
// //             description: 'Select the city mayor.',
// //             startDate: new Date(Date.now() + 86400000).toISOString(),
// //             endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
// //             candidates: [{ name: 'Carol White' }, { name: 'Dave Brown' }],
// //             status: 'Pending',
// //           },
// //         ];
// //         setElections(mockElections);
// //       } catch (err) {
// //         setError('Failed to load elections.');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     fetchElections();
// //   }, []);

// //   // Connect wallet
// //   const connectWallet = async () => {
// //     setIsLoading(true);
// //     setError('');
// //     try {
// //       if (!window.ethereum) {
// //         throw new Error('Please install MetaMask or another Ethereum wallet.');
// //       }
// //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
// //       setWalletAddress(accounts[0]);
// //       setIsWalletConnected(true);
// //       setSuccess('Wallet connected successfully!');
// //     } catch (err) {
// //       setError(err.message || 'Failed to connect wallet.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Open vote modal
// //   const openVoteModal = (election) => {
// //     if (!isWalletConnected) {
// //       setError('Please connect your wallet to vote.');
// //       return;
// //     }
// //     if (election.status !== 'Active') {
// //       setError('Voting is not available for this election.');
// //       return;
// //     }
// //     setSelectedElection(election);
// //     setSelectedCandidate('');
// //     setShowVoteModal(true);
// //   };

// //   // Handle vote submission
// //   const handleVote = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError('');
// //     setSuccess('');

// //     try {
// //       if (!selectedCandidate) {
// //         throw new Error('Please select a candidate.');
// //       }

// //       // Simulate blockchain interaction (vote casting)
// //       if (!window.ethereum) {
// //         throw new Error('Please install MetaMask.');
// //       }
// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();

// //       // Mock smart contract interaction
// //       await new Promise((resolve) => setTimeout(resolve, 1500));

// //       setSuccess(`Successfully voted for ${selectedCandidate} in ${selectedElection.title}!`);
// //       setShowVoteModal(false);
// //     } catch (err) {
// //       setError(err.message || 'Failed to cast vote.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex justify-between items-center mb-8">
// //           <h2 className="text-3xl font-extrabold text-gray-900">Elections</h2>
// //           {!isWalletConnected ? (
// //             <button
// //               onClick={connectWallet}
// //               disabled={isLoading}
// //               className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
// //             >
// //               {isLoading ? (
// //                 <>
// //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Connecting...
// //                 </>
// //               ) : (
// //                 <>
// //                   <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-5 w-5 mr-2" />
// //                   Connect Wallet
// //                 </>
// //               )}
// //             </button>
// //           ) : (
// //             <div className="text-sm text-gray-600">
// //               Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
// //             </div>
// //           )}
// //         </div>

// //         {error && (
// //           <div className="mb-6 rounded-md bg-red-50 p-4">
// //             <div className="flex">
// //               <div className="ml-3">
// //                 <h3 className="text-sm font-medium text-red-800">{error}</h3>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {success && (
// //           <div className="mb-6 rounded-md bg-green-50 p-4">
// //             <div className="flex">
// //               <div className="ml-3">
// //                 <h3 className="text-sm font-medium text-green-800">{success}</h3>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {isLoading && !showVoteModal && (
// //           <div className="text-center">
// //             <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //             </svg>
// //           </div>
// //         )}

// //         {!isLoading && elections.length === 0 && (
// //           <div className="text-center text-gray-500">No elections available.</div>
// //         )}

// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {elections.map((election) => (
// //             <div key={election.id} className="bg-white shadow rounded-lg p-6">
// //               <h3 className="text-lg font-medium text-gray-900">{election.title}</h3>
// //               <p className="mt-2 text-sm text-gray-600">{election.description}</p>
// //               <div className="mt-4 space-y-2">
// //                 <p className="text-sm text-gray-500">
// //                   <span className="font-medium">Start:</span> {new Date(election.startDate).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-gray-500">
// //                   <span className="font-medium">End:</span> {new Date(election.endDate).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-gray-500">
// //                   <span className="font-medium">Candidates:</span> {election.candidates.map((c) => c.name).join(', ')}
// //                 </p>
// //                 <p className="text-sm">
// //                   <span className="font-medium">Status:</span>{' '}
// //                   <span
// //                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                       election.status === 'Pending'
// //                         ? 'bg-yellow-100 text-yellow-800'
// //                         : election.status === 'Active'
// //                         ? 'bg-green-100 text-green-800'
// //                         : 'bg-red-100 text-red-800'
// //                     }`}
// //                   >
// //                     {election.status}
// //                   </span>
// //                 </p>
// //               </div>
// //               <div className="mt-6">
// //                 <button
// //                   onClick={() => openVoteModal(election)}
// //                   disabled={election.status !== 'Active' || isLoading}
// //                   className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
// //                     election.status === 'Active' && !isLoading
// //                       ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
// //                       : 'bg-gray-400 cursor-not-allowed'
// //                   }`}
// //                 >
// //                   Vote
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Vote Modal */}
// //       {showVoteModal && selectedElection && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-auto p-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-medium text-gray-900">Vote in {selectedElection.title}</h3>
// //               <button
// //                 onClick={() => setShowVoteModal(false)}
// //                 className="text-gray-400 hover:text-gray-500"
// //               >
// //                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>
// //             <form onSubmit={handleVote} className="space-y-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Select Candidate</label>
// //                 <div className="mt-2 space-y-2">
// //                   {selectedElection.candidates.map((candidate, index) => (
// //                     <div key={index} className="flex items-center">
// //                       <input
// //                         id={`candidate-${index}`}
// //                         name="candidate"
// //                         type="radio"
// //                         value={candidate.name}
// //                         checked={selectedCandidate === candidate.name}
// //                         onChange={(e) => setSelectedCandidate(e.target.value)}
// //                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
// //                       />
// //                       <label htmlFor={`candidate-${index}`} className="ml-3 block text-sm text-gray-900">
// //                         {candidate.name}
// //                       </label>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {error && (
// //                 <div className="rounded-md bg-red-50 p-4">
// //                   <div className="flex">
// //                     <div className="ml-3">
// //                       <h3 className="text-sm font-medium text-red-800">{error}</h3>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {success && (
// //                 <div className="rounded-md bg-green-50 p-4">
// //                   <div className="flex">
// //                     <div className="ml-3">
// //                       <h3 className="text-sm font-medium text-green-800">{success}</h3>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               <div>
// //                 <button
// //                   type="submit"
// //                   disabled={isLoading}
// //                   className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
// //                 >
// //                   {isLoading ? (
// //                     <>
// //                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                       </svg>
// //                       Casting Vote...
// //                     </>
// //                   ) : 'Cast Vote'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ElectionsPage;