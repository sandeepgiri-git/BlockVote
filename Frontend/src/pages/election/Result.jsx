// import { Link } from 'react-router-dom';
// import PageLoader from '../../components/PageLoading';

// const ResultPage = () => {
//   // Dummy election data
//   const dummyElections = [
//     {
//       title: 'Presidential Election 2024',
//       description: 'Election for the national president.',
//       endDate: '2024-11-10T17:00:00',
//       contractAddress: '0x1234...5678',
//       winner: 'Alice Smith',
//     },
//     {
//       title: 'Student Council 2025',
//       description: 'Vote for the student council president.',
//       endDate: '2025-03-15T12:00:00',
//       contractAddress: '0x9012...3456',
//       winner: 'Bob Johnson',
//     },
//     {
//       title: 'Mayor Election 2024',
//       description: 'City mayor election.',
//       endDate: '2024-12-01T20:00:00',
//       contractAddress: '0x7890...1234',
//       winner: 'Carol White',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px-8">
//       {/* Optional PageLoader for static display */}
//       {/* <PageLoader message="Loading Winners..." /> */}
//       <div className="max-w-4xl mx-auto">
//         {/* Back Button */}
//         <div className="mb-6">
//           <Link
//             to="/elections"
//             className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-sm"
//             aria-label="Back to elections"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//             Back
//           </Link>
//         </div>

//         {/* Title */}
//         <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 animate-fade-in">
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
//             Election Winners
//           </span>
//         </h2>

//         {/* Search Bar */}
//         <div className="mb-8">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by election title or contract address..."
//               className="w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300 bg-white bg-opacity-80 backdrop-blur-md"
//               aria-label="Search elections"
//             />
//             <svg
//               className="absolute right-3 top-3 h-5 w-5 text-gray-400"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Winners List */}
//         <div className="grid gap-6">
//           {dummyElections.map((election) => (
//             <div
//               key={election.contractAddress}
//               className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-teal-100 animate-slide-in hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
//                   <p className="mt-1 text-sm text-gray-600">{election.description}</p>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Ended: {new Date(election.endDate).toLocaleString()}
//                   </p>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Contract: <span className="font-mono text-xs">{election.contractAddress}</span>
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-700">Winner:</p>
//                   <p className="text-lg font-bold text-teal-600">{election.winner}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLoader from '../../components/PageLoading';

const ResultPage = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask.');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask.');
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const response = await axios.get('/api/elections');
    //   const allElections = response.data;

      // Filter completed elections and fetch winners
    //   const completedElections = await Promise.all(
    //     allElections
    //       .filter((election) => new Date(election.endDate) < new Date())
    //       .map(async (election) => {
    //         try {
    //           const contract = new ethers.Contract(election.contractAddress, BallotABI, provider);
    //           const winnerBytes32 = await contract.winnerName();
    //           const winnerName = ethers.decodeBytes32String(winnerBytes32);
    //           return { ...election, winner: winnerName || 'No votes cast' };
    //         } catch (err) {
    //           console.error(`Error fetching winner for ${election.contractAddress}:`, err);
    //           return { ...election, winner: 'Error fetching winner' };
    //         }
    //       })
    //   );

        const completedElections = [
            {
                title: 'Presidential Election 2024',
                description: 'Election for the national president.',
                endDate: '2024-11-10T17:00:00',
                contractAddress: '0x1234...5678',
                winner: 'Alice Smith',
            },
            {
                title: 'Student Council 2025',
                description: 'Vote for the student council president.',
                endDate: '2025-03-15T12:00:00',
                contractAddress: '0x9012...3456',
                winner: 'Bob Johnson',
            },
            {
                title: 'Mayor Election 2024',
                description: 'City mayor election.',
                endDate: '2024-12-01T20:00:00',
                contractAddress: '0x7890...1234',
                winner: 'Carol White',
            },
        ];

      setElections(completedElections);
      setFilteredElections(completedElections);
    } catch (err) {
      setError('Failed to load elections: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = elections.filter(
      (election) =>
        election.title.toLowerCase().includes(query) ||
        election.contractAddress.toLowerCase().includes(query)
    );
    setFilteredElections(filtered);
  };

  useEffect(() => {
    if (isWalletConnected) {
      fetchElections();
    }
  }, [isWalletConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px-8">
      {isLoading && <PageLoader message="Loading Winners..." />}
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/elections"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
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
            Back
          </Link>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Election Winners
          </span>
        </h2>

        {/* Wallet Connection */}
        {!isWalletConnected && (
          <div className="mb-8 text-center">
            <button
              onClick={connectWallet}
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-md"
              aria-label="Connect MetaMask wallet"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Search Bar */}
        {isWalletConnected && (
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by election title or contract address..."
                className="w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300 bg-white bg-opacity-80 backdrop-blur-md"
                aria-label="Search elections"
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400"
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
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 animate-slide-in">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Winners List */}
        {isWalletConnected && (
          <div className="grid gap-6">
            {filteredElections.length === 0 ? (
              <p className="text-center text-gray-600">No completed elections found.</p>
            ) : (
              filteredElections.map((election) => (
                <div
                  key={election.contractAddress}
                  className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-teal-100 animate-slide-in hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{election.description}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Ended: {new Date(election.endDate).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Contract: <span className="font-mono text-xs">{election.contractAddress}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Winner:</p>
                      <p className="text-lg font-bold text-teal-600">{election.winner}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;