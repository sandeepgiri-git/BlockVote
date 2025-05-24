import { CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { ElectionData } from "../../contexts/ElectionContext";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoading";
import { Link } from "react-router-dom";

const ElectionsPage = () => {
  const {
    walletAddress,
    error,
    openVoteModal,
    elections,
    isLoading,
    success,
    connectWallet,
    showVoteModal,
    setShowVoteModal,
    isWalletConnected,
    selectedElection,
    fetchElections,
    handleVote,
    selectedCandidate,
    handleDis,
    setSelectedCandidate,
  } = ElectionData();

  const [activeTab, setActiveTab] = useState("All");

  // Filter elections based on active tab
  const filteredElections =
    elections?.filter((e) => (e.status === activeTab || activeTab === "All")) || [];

  filteredElections.reverse();
  // Tab options
  const tabs = [
    {
      name: "All",
      count: elections?.filter((e) => true).length || 0
    },
    {
      name: "Active",
      count: elections?.filter((e) => e.status === "Active").length || 0,
    },
    {
      name: "Pending",
      count: elections?.filter((e) => e.status === "Pending").length || 0,
    },
    {
      name: "Ended",
      count: elections?.filter((e) => e.status === "Ended").length || 0,
    },
  ];

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-2 m:px-6 lg:px-8">
      <Link
          to="/"
          className="inline-flex mb-3 items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
          aria-label="Back to elections"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back To Home
        </Link>
      <div className="flex justify-center items-center w-full ">
        <div className="relative">
          <input
            type="text"
            // value={searchQuery}
            // onChange={handleSearch}
            placeholder="Search election title or address"
            className="w-xs lg:w-2xl h-auto px-4 py-2 mb-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300 bg-white bg-opacity-80 backdrop-blur-md"
            aria-label="Search elections"
          />
          <svg
            className="absolute right-3 top-3 h-4 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl animate-fade-in">
            Vote in Elections
          </h2>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded"></div>
          <p className="mt-2 md:text-lg text-sm text-gray-600">
            Participate in secure, transparent elections powered by blockchain.
          </p>
        </div>

        <div className="mb-6 flex justify-center space-x-1 animate-fade-in">
          <div className="bg-white rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`md:px-6 px-5 py-1 text-xs font-medium rounded-full transition-all duration-300 relative overflow-hidden ${
                  activeTab === tab.name
                    ? "text-white"
                    : "bg-white bg-opacity-80 backdrop-blur-md text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                }`}
                aria-label={`Show ${tab.name.toLowerCase()} elections`}
              >
                {/* Background gradient with scale animation */}
                <span
                  className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 z-0 transition-all duration-300 origin-left ${
                    activeTab === tab.name ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                {/* Text content */}
                <span className="relative z-10">
                  {tab.name} ({tab.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-7">
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-xs font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : "animate-pulse"
              }`}
              aria-label="Connect MetaMask wallet"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    className="h-5 w-5 mr-2"
                  />
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
              <button
                onClick={() => handleDis()}
                className="px-2 py-1 border border-transparent text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 rounded-full mr-2"
              >
                Disconnect
              </button>
              <span className="font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          )}

          <Link
            to="/create-election"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-xs font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "animate-pulse"
            }`}
            aria-label="Create a new election"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>Create Election</>
            )}
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 animate-slide-in">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 animate-slide-in">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {isLoading && !showVoteModal && (
          <PageLoader message="Loading Elections..." />
        )}

        {/* {!isLoading && elections?.length === 0 && (
          <div className="text-center text-gray-600 text-lg bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg">
            No elections available at the moment.
          </div>
        )} */}

        {/* Tab Buttons */}

        {/* Elections Display */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
          key={activeTab}
        >
          {filteredElections.length === 0 ? (
            <div className="text-center text-gray-600 bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg animate-fade-in">
              No {activeTab.toLowerCase()} elections at the moment.
            </div>
          ) : (
            filteredElections.map((election) => (
              <div
                key={election.electionAddress}
                className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-in"
              >
                <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50">
                  <h4 className="text-xl font-bold text-gray-900">
                    {election.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {election.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 font-mono truncate">
                    ID: {election.electionAddress}
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                      <span>
                        <span className="font-medium">Start:</span>{" "}
                        {new Date(election.startDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                      <span>
                        <span className="font-medium">End:</span>{" "}
                        {new Date(election.endDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-teal-500" />
                      <span>
                        <span className="font-medium">Candidates:</span>{" "}
                        {election.candidates?.map((c) => c.name).join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-500">Status:</span>
                      <span
                        className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          election.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : election.status === "Active"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {election.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    {election.status === "Active" ? (
                      <button
                        onClick={() => openVoteModal(election)}
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          !isLoading
                            ? "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        aria-label={`Vote in ${election.title}`}
                      >
                        Vote Now
                      </button>
                    ) : election.status === "Pending" ? (
                      <button
                        disabled={true}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                        aria-label={`Voting not available for ${election.title}`}
                      >
                        Voting Not Started
                      </button>
                    ) : (
                      <Link
                        to={`/result/${election.electionAddress}`}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                        aria-label={`View results for ${election.title}`}
                      >
                        View Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vote Modal */}
        {showVoteModal && selectedElection && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto p-8 transform transition-all duration-300 scale-100 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Vote in {selectedElection.title}
                </h3>
                <button
                  onClick={() => setShowVoteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close vote modal"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={(e) =>
                  handleVote(e, selectedElection, selectedCandidate)
                }
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Candidate
                  </label>
                  <div className="mt-3 space-y-4">
                    {selectedElection.candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                          selectedCandidate === candidate.name
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:bg-gray-50"
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
                          aria-label={`Select ${candidate.name}`}
                        />
                        <label
                          htmlFor={`candidate-${index}`}
                          className="ml-3 flex items-center justify-between w-full text-sm text-gray-900"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <span className="text-gray-600 font-medium">
                                {candidate.name[0]}
                              </span>
                            </div>
                            <span>{candidate.name}</span>
                          </div>
                          <span className="ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {candidate.votes} votes
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 animate-slide-in">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-50 p-4 animate-slide-in">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    aria-label="Cast vote"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Casting Vote...
                      </>
                    ) : (
                      "Cast Vote"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionsPage;

//import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { ElectionData } from '../../contexts/ElectionContext';
// import { useEffect } from 'react';
// import PageLoader from '../../components/PageLoading';
// import { Link } from 'react-router-dom';
// import ELectionCard from '../../components/ELectionCard';

// const ElectionsPage = () => {
//   const {walletAddress, error,openVoteModal,elections,isLoading,
//     success,connectWallet,showVoteModal, setShowVoteModal,
//     isWalletConnected,selectedElection,fetchElections,handleVote,selectedCandidate,
//     setSelectedCandidate,

//   } = ElectionData();

//     useEffect(() => {
//         fetchElections();
//     }, []);

//     // if(isLoading){
//     //   return <PageLoader/>
//     // }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px irritating-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
//             Vote in Elections
//           </h2>
//           <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded"></div>
//           <p className="mt-4 text-lg text-gray-600">
//             Participate in secure, transparent elections powered by blockchain.
//           </p>
//           <button onClick={fetchElections}>Fetch elections</button>
//         </div>

//         <div className="flex justify-between items-center mb-8">
//           {!isWalletConnected ? (
//             <button
//               onClick={connectWallet}
//               disabled={isLoading}
//               className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'animate-pulse'}`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Connecting...
//                 </>
//               ) : (
//                 <>
//                   <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-6 mr-2" />
//                   Connect Wallet
//                 </>
//               )}
//             </button>
//           ) : (
//             <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
//               <span className="mr-2">Connected:</span>
//               <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
//             </div>
//           )}
//           <Link
//               to={"/create-election"}
//               className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'animate-pulse'}`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   Create Election
//                 </>
//               )}
//             </Link>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg bg-red-50 p-4 animate-slide-in">
//             <div className="flex">
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">{error}</h3>
//               </div>
//             </div>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 rounded-lg bg-green-50 p-4 animate-slide-in">
//             <div className="flex">
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-green-800">{success}</h3>
//               </div>
//             </div>
//           </div>
//         )}

//         {isLoading && !showVoteModal && (
//           <div className="text-center">
//             <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           </div>
//         )}

//         {!isLoading && elections?.length === 0 && (
//           <div className="text-center text-gray-500 text-lg">No elections available at the moment.</div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//           {elections?.map((election) => (
//             <div
//               key={election.electionAddress}
//               className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
//             >
//               <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50">
//                 <h3 className="text-xl font-bold text-gray-900">{election.title}</h3>
//                 <p className="mt-2 text-sm text-gray-600 line-clamp-3">{election.electionAddress}</p>
//                 <p className="mt-2 text-sm text-gray-600 line-clamp-3">{election.description}</p>
//                 <div className="mt-4 space-y-3">
//                   <div className="flex items-center text-sm text-gray-500">
//                     <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
//                     {/* <span>
//                       <span className="font-medium">Start:</span> {election.startDate}
//                     </span> */}
//                     <span>
//                       <span className="font-medium">Start:</span> {new Date(election.startDate).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
//                     {/* <span>
//                       <span className="font-medium">End:</span> {election.endDate}
//                     </span> */}
//                     <span>
//                       <span className="font-medium">End:</span> {new Date(election.endDate).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <UserGroupIcon className="h-5 w-5 mr-2 text-teal-500" />
//                     <span>
//                       <span className="font-medium">Candidates:</span> {election.candidates?.map((c) => c.name).join(', ')}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <span className="font-medium text-gray-500">Status:</span>
//                     <span
//                       className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
//                         election.status === 'Pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : election.status === 'Active'
//                           ? 'bg-teal-100 text-teal-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {election.status}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <button
//                     onClick={() => openVoteModal(election)}
//                     disabled={election.status !== 'Active' || isLoading}
//                     className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                       election.status === 'Active' && !isLoading
//                         ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300'
//                         : 'bg-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     Vote Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <ELectionCard elections={elections}/>

//         </div>
//       </div>

//       {/* Vote Modal */}
//       {showVoteModal && selectedElection && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto p-8 transform transition-all duration-300 scale-100 animate-fade-in">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-900">Vote in {selectedElection.title}</h3>
//               <button
//                 onClick={() => setShowVoteModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={(e) => handleVote(e,selectedElection, selectedCandidate)} className="space-y-6">
//               <div>
//               <label className="block text-sm font-medium text-gray-700">Select Candidate</label>
//               <div className="mt-3 space-y-4">
//                 {selectedElection.candidates.map((candidate, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
//                       selectedCandidate === candidate.name
//                         ? 'border-teal-500 bg-teal-50'
//                         : 'border-gray-200 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       id={`candidate-${index}`}
//                       name="candidate"
//                       type="radio"
//                       value={candidate.name}
//                       checked={selectedCandidate === candidate.name}
//                       onChange={(e) => setSelectedCandidate(e.target.value)}
//                       className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300"
//                     />
//                     <label
//                       htmlFor={`candidate-${index}`}
//                       className="ml-3 flex items-center justify-between w-full text-sm text-gray-900"
//                     >
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                           <span className="text-gray-600 font-medium">{candidate.name[0]}</span>
//                         </div>
//                         <span>{candidate.name}</span>
//                       </div>
//                       <span className="ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
//                         {candidate.votes} votes
//                       </span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//               {error && (
//                 <div className="rounded-lg bg-red-50 p-4 animate-slide-in">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="rounded-lg bg-green-50 p-4 animate-slide-in">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">{success}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Casting Vote...
//                   </>
//                   ) : 'Cast Vote'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ElectionsPage;
