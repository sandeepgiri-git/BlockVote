import React, { useEffect, useState } from 'react';
import { FaChartBar, FaVoteYea, FaLock, FaWallet, FaUserCheck } from 'react-icons/fa';
import { UserData } from '../contexts/UserContext';
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoading';

const VotingDashboard = () => {
  // Sample state data
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeElections, setActiveElections] = useState([
    {
      id: 1,
      title: "Presidential Election 2025",
      candidates: ["Candidate A", "Candidate B", "Candidate C"],
      endDate: "2025-04-20",
      status: "Active",
    },
    {
      id: 2,
      title: "Local Governance Vote",
      candidates: ["Yes", "No"],
      endDate: "2025-04-15",
      status: "Active",
    }
  ]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [vote, setVote] = useState('');

  const stats = {
    totalVotes: 15432,
    verifiedVoters: 18324,
    activeElections: 2,
    blockchainTx: 15432
  };

  const connectWallet = () => {
    // Implement wallet connection logic here
    setWalletConnected(true);
  };

  const handleVote = (e) => {
    e.preventDefault();
    // Implement blockchain voting logic here
    console.log(`Vote cast for ${vote} in election ${selectedElection.title}`);
    setVote('');
  };

  const {isLoading} = UserData();

  if(isLoading) return <PageLoader/>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaVoteYea className="mr-2" /> Blockchain Voting Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Secure, transparent voting powered by blockchain technology</p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaWallet className="text-gray-500 mr-3" size={24} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Wallet Status</h2>
                  <p className="text-gray-600">
                    {walletConnected ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={connectWallet}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  walletConnected 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {walletConnected ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <FaChartBar className="text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVotes.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Votes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <FaUserCheck className="text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.verifiedVoters.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Verified Voters</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <FaVoteYea className="text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeElections}</p>
                  <p className="text-sm text-gray-600">Active Elections</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <FaLock className="text-gray-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.blockchainTx.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Blockchain Tx</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Elections */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Elections</h2>
              <div className="space-y-4">
                {activeElections.map(election => (
                  <div 
                    key={election.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition duration-300"
                    onClick={() => setSelectedElection(election)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{election.title}</h3>
                        <p className="text-sm text-gray-600">
                          Ends: {new Date(election.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {election.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voting Panel */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cast Your Vote</h2>
              {selectedElection ? (
                <form onSubmit={handleVote}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedElection.title}</h3>
                      <p className="text-sm text-gray-600">Select your choice:</p>
                    </div>
                    <div className="space-y-2">
                      {selectedElection.candidates.map((candidate, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`candidate-${index}`}
                            name="vote"
                            value={candidate}
                            checked={vote === candidate}
                            onChange={(e) => setVote(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label 
                            htmlFor={`candidate-${index}`} 
                            className="ml-2 text-sm text-gray-700"
                          >
                            {candidate}
                          </label>
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={!walletConnected || !vote}
                      className={`w-full px-4 py-2 rounded-lg transition duration-300 ${
                        walletConnected && vote
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Vote
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600">Select an election to cast your vote</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingDashboard;

// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';

// const VotingDashboard = () => {
//   // State management
//   const [currentAccount, setCurrentAccount] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [elections, setElections] = useState([]);
//   const [candidates, setCandidates] = useState([]);
//   const [votes, setVotes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });
//   const [newElection, setNewElection] = useState({ title: '', description: '', endTime: '' });
//   const [newCandidate, setNewCandidate] = useState({ name: '', description: '' });

//   // Mock data - replace with actual blockchain calls
//   useEffect(() => {
//     // This would be replaced with actual blockchain contract calls
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // Mock data
//         setElections([
//           { id: 1, title: 'Presidential Election 2023', description: 'Vote for the next president', endTime: '2023-12-31', active: true },
//           { id: 2, title: 'Community Proposal #45', description: 'Should we upgrade the community center?', endTime: '2023-11-15', active: false },
//         ]);
        
//         setCandidates([
//           { id: 1, electionId: 1, name: 'Alice Johnson', description: 'Progressive candidate', voteCount: 1245 },
//           { id: 2, electionId: 1, name: 'Bob Smith', description: 'Conservative candidate', voteCount: 987 },
//           { id: 3, electionId: 2, name: 'Yes', description: 'Approve the upgrade', voteCount: 543 },
//           { id: 4, electionId: 2, name: 'No', description: 'Reject the upgrade', voteCount: 321 },
//         ]);
        
//         setVotes([
//           { electionId: 1, candidateId: 1, voter: '0x123...abc', timestamp: '2023-10-01' },
//           { electionId: 2, candidateId: 3, voter: '0x123...abc', timestamp: '2023-10-02' },
//         ]);
//       } catch (error) {
//         showNotification('Failed to load data from blockchain', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Connect to blockchain wallet
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         setCurrentAccount(accounts[0]);
//         // Check if admin (this would be replaced with actual contract call)
//         setIsAdmin(accounts[0] === '0xAdminAddress');
//         showNotification('Wallet connected successfully', 'success');
//       } catch (error) {
//         showNotification('Failed to connect wallet', 'error');
//       }
//     } else {
//       showNotification('Please install MetaMask!', 'error');
//     }
//   };

//   // Create new election
//   const handleCreateElection = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       // This would be replaced with actual contract call
//       showNotification('Election created on blockchain', 'success');
//       setNewElection({ title: '', description: '', endTime: '' });
//     } catch (error) {
//       showNotification('Failed to create election', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Add candidate
//   const handleAddCandidate = async (electionId, e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       // This would be replaced with actual contract call
//       showNotification('Candidate added to election', 'success');
//       setNewCandidate({ name: '', description: '' });
//     } catch (error) {
//       showNotification('Failed to add candidate', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Cast vote
//   const handleVote = async (electionId, candidateId) => {
//     setIsLoading(true);
//     try {
//       // This would be replaced with actual contract call
//       showNotification('Vote cast successfully', 'success');
//     } catch (error) {
//       showNotification('Failed to cast vote', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Notification helper
//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-600 text-white shadow-md">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Blockchain Voting System</h1>
//           {currentAccount ? (
//             <div className="flex items-center space-x-4">
//               <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
//                 {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
//               </span>
//               {isAdmin && (
//                 <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
//                   Admin
//                 </span>
//               )}
//             </div>
//           ) : (
//             <button
//               onClick={connectWallet}
//               className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
//             >
//               Connect Wallet
//             </button>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Notification */}
//         {notification.show && (
//           <div
//             className={`mb-6 p-4 rounded-md ${
//               notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//             }`}
//           >
//             {notification.message}
//           </div>
//         )}

//         {/* Admin Section */}
//         {isAdmin && (
//           <div className="mb-12 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Panel</h2>
            
//             {/* Create Election Form */}
//             <div className="mb-8">
//               <h3 className="text-lg font-medium mb-3 text-gray-700">Create New Election</h3>
//               <form onSubmit={handleCreateElection} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={newElection.title}
//                     onChange={(e) => setNewElection({...newElection, title: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newElection.description}
//                     onChange={(e) => setNewElection({...newElection, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                   <input
//                     type="datetime-local"
//                     value={newElection.endTime}
//                     onChange={(e) => setNewElection({...newElection, endTime: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Creating...' : 'Create Election'}
//                 </button>
//               </form>
//             </div>

//             {/* Add Candidate Form */}
//             <div>
//               <h3 className="text-lg font-medium mb-3 text-gray-700">Add Candidate</h3>
//               <form onSubmit={(e) => handleAddCandidate(1, e)} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Election</label>
//                   <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     {elections.map(election => (
//                       <option key={election.id} value={election.id}>{election.title}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     value={newCandidate.name}
//                     onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newCandidate.description}
//                     onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Adding...' : 'Add Candidate'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Elections List */}
//         <div className="mb-12">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Active Elections</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {elections.filter(e => e.active).map(election => (
//               <div key={election.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-6">
//                   <h3 className="text-lg font-semibold mb-2 text-gray-800">{election.title}</h3>
//                   <p className="text-gray-600 mb-4">{election.description}</p>
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-sm text-gray-500">Ends: {election.endTime}</span>
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
//                   </div>
//                   <button
//                     onClick={() => document.getElementById(`modal-${election.id}`).showModal()}
//                     className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//                   >
//                     View Candidates
//                   </button>
//                 </div>

//                 {/* Election Modal */}
//                 <dialog id={`modal-${election.id}`} className="modal">
//                   <div className="modal-box max-w-3xl">
//                     <h3 className="font-bold text-lg mb-4">{election.title}</h3>
//                     <div className="space-y-4">
//                       {candidates.filter(c => c.electionId === election.id).map(candidate => (
//                         <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium text-gray-800">{candidate.name}</h4>
//                               <p className="text-sm text-gray-600 mt-1">{candidate.description}</p>
//                             </div>
//                             <div className="text-right">
//                               <div className="text-lg font-semibold text-blue-600">{candidate.voteCount} votes</div>
//                               {currentAccount && !votes.some(v => v.electionId === election.id && v.voter === currentAccount) && (
//                                 <button
//                                   onClick={() => handleVote(election.id, candidate.id)}
//                                   className="mt-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
//                                 >
//                                   Vote
//                                 </button>
//                               )}
//                               {votes.some(v => v.electionId === election.id && v.voter === currentAccount && v.candidateId === candidate.id) && (
//                                 <span className="mt-2 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
//                                   Your Vote
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="modal-action">
//                       <form method="dialog">
//                         <button className="btn">Close</button>
//                       </form>
//                     </div>
//                   </div>
//                 </dialog>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Past Elections */}
//         <div>
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Past Elections</h2>
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {elections.filter(e => !e.active).map(election => (
//                     <tr key={election.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{election.title}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{election.description}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{election.endTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           Ended
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <button
//                           onClick={() => document.getElementById(`modal-${election.id}`).showModal()}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           View Results
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-8 mt-12">
//         <div className="container mx-auto px-4 text-center">
//           <p>Blockchain Voting System - Secure, Transparent, Decentralized</p>
//           <p className="mt-2 text-gray-400 text-sm">Powered by Ethereum Smart Contracts</p>
//         </div>
//       </footer>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="text-gray-800">Processing blockchain transaction...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VotingDashboard;