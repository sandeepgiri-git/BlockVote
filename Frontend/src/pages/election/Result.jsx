
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLoader from '../../components/PageLoading';
import { ElectionData } from '../../contexts/ElectionContext';
import { CalendarIcon } from '@heroicons/react/24/outline';

const ResultPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {isWalletConnected, connectWallet,fetchElections ,filteredElections, setFilteredElections,isLoading,errorRes,result} = ElectionData();
  const [search, setSearch] = useState([])
  const handleSearch = (e) => {
    console.log(filteredElections);
    setFilteredElections(JSON.parse(localStorage.getItem("endedElections")) || [])
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // console.log(query)
    const filtered = filteredElections.filter(
      (election) =>
        (election?.title?.toString().toLowerCase().includes(query) ||
        election?.contractAddress?.toString().toLowerCase().includes(query))
    );
    setFilteredElections(filtered);
  };

  useEffect(() => {
    fetchElections()
  }, []);

//   useEffect(() => {
//   const loadData = async () => {
//     // Load cached data immediately for better UX
//     const stored = localStorage.getItem("endedElections");
//     if (stored) {
//       try {
//         setFilteredElections(JSON.parse(stored));
//       } catch (e) {
//         console.error("Failed to parse stored elections", e);
//       }
//     }
    
//     // Then fetch fresh data
//     await result();
//   };

//   loadData();
// }, []); // Empty dependency array to run only once on mount

  if(isLoading)
     return <PageLoader/>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-6 md:py-12 sm:px-6 lg:px-8">
      {/* {isLoading && <PageLoader message="Loading Winners..." />} */}
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-2 flex w-full justify-between  ">
          <Link
            to="/"
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
          <button 
            className="md:mr-0 mr-2 inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
            onClick={result}
          > refresh </button>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4 md:mb-10 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600">
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
          <div className="mb-5">
            <div className="relative mx-2 md:mx-0">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by election title or contract address..."
                className="w-full px-4 py-3 border rounded-full border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300 bg-white bg-opacity-80 backdrop-blur-md"
                aria-label="Search elections"
              />
              <svg
                className="absolute right-3 top-3 h-6 w-5 text-gray-400"
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
        {errorRes && (
          <div className="mb-6 rounded-md bg-red-50 p-4 animate-slide-in">
            <p className="text-sm text-red-800">{errorRes}</p>
          </div>
        )}

        {/* Winners List */}
        
        {isWalletConnected && (
          <div className="space-y-1">
            {filteredElections.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round"  strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">{searchQuery.length > 0 ? "No election found" : "No completed elections" }</h3>
                <p className="mt-1 text-gray-500">Elections will appear here once they've ended</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:mx-0 mx-2 ">
                {filteredElections.map((election) => (
                  <div
                    key={election.electionAddress}
                    className="pb-1 relative bg-gradient-to-r from-blue-200 to-teal-300 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Ribbon for completed status */}
                    <div className="absolute mt-6 mr-1 top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 transform rotate-45 translate-x-8 -translate-y-1 w-32 text-center">
                      Completed
                    </div>
                    
                    <div className="md:p-6 px-3 py-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {election.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{election.description}</p>
                          
                          <div className="mt-2 space-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                              Ended: {new Date(election.endDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span className="truncate font-mono text-xs">{election.electionAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Winner section with trophy icon */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className='flex flex-row items-center gap-1 md:gap-3'>
                            <p className="md:text-xl font-medium text-gray-500">Winner:</p>
                            <div className="flex items-center mt-1">
                              <div className="md:h-8 md:w-8 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-1">
                                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h4 className="md:text-lg  font-bold text-gray-800">{election?.candidates[0].name}</h4>
                            </div>
                          </div>
                          <div className="flex flex-row items-center gap-3 bg-teal-50 rounded-lg px-2 py-0 md:px-3 md:py-2">
                            <p className="text-sm text-gray-500">Total votes</p>
                            <p className="text-xl font-bold text-teal-600">{election?.candidates[0].votes}</p>
                          </div>
                        </div>
                      </div>

                      {/* View results button */}
                      <Link 
                        to={`/result/${election.electionAddress}`}
                        className="mt-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                      >
                        View full results
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;