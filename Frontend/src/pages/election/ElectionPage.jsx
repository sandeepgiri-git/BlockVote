import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ElectionData } from '../../contexts/ElectionContext';
import PageLoader from '../../components/PageLoading';
import { ethers } from 'ethers';

const CreateElection = () => {
  const { createElection, isWalletConnected, connectWallet  } = ElectionData();
  const navigate = useNavigate();
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElectionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCandidateChange = (index, value) => {
    const updatedCandidates = [...electionForm.candidates];
    updatedCandidates[index].name = value;
    setElectionForm((prev) => ({
      ...prev,
      candidates: updatedCandidates,
    }));
  };

  const addCandidate = () => {
    if (electionForm.candidates.length < 10) {
      setElectionForm((prev) => ({
        ...prev,
        candidates: [...prev.candidates, { name: '' }],
      }));
    } else {
      setError('Maximum 10 candidates allowed.');
    }
  };

  const removeCandidate = (index) => {
    if (electionForm.candidates.length > 1) {
      const updatedCandidates = electionForm.candidates.filter((_, i) => i !== index);
      setElectionForm((prev) => ({
        ...prev,
        candidates: updatedCandidates,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!electionForm.title || !electionForm.description || !electionForm.startDate || !electionForm.endDate) {
        throw new Error('All fields are required.');
      }
      if (electionForm.candidates.some((c) => !c.name)) {
        throw new Error('All candidate names are required.');
      }
      if (new Date(electionForm.startDate) >= new Date(electionForm.endDate)) {
        throw new Error('End date must be after start date.');
      }
      if (!isWalletConnected) {
        throw new Error('Please connect your wallet.');
      }

      // Convert candidate names to bytes32
      const proposalNames = electionForm.candidates
        .filter((c) => c.name.trim())
        .map((c) => ethers.encodeBytes32String(c.name));

      if (proposalNames.length < 2) {
        throw new Error('At least two candidates are required.');
      }

      // Create election data
      const newElection = {
        title: electionForm.title,
        description: electionForm.description,
        startDate: electionForm.startDate,
        endDate: electionForm.endDate,
        candidates: electionForm.candidates,
      };

      await createElection(newElection);

      setSuccess(`Election "${electionForm.title}" deployed at ${contractAddress}`);
      setElectionForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '' }],
      });
      
    } catch (err) {
      setError(err.message || 'Failed to create election.');
    } finally {
      setIsLoading(false);
      navigate('/elections');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px-8">
      {isLoading && <PageLoader message="Deploying Election..." />}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Create New Election
          </span>
        </h2>

        <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl p-8 border border-teal-100 animate-slide-in">
          {!isWalletConnected && (
            <div className="mb-6 text-center">
              <button
                onClick={connectWallet}
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-md"
                aria-label="Connect MetaMask wallet"
              >
                Connect Wallet
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Election Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={electionForm.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                placeholder="e.g., Presidential Election 2025"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={electionForm.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                placeholder="Describe the election..."
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={electionForm.startDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={electionForm.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                  aria-required="true"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidates
              </label>
              {electionForm.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                    required
                    className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300"
                    placeholder={`Candidate ${index + 1} Name`}
                    aria-required="true"
                    aria-label={`Candidate ${index + 1} name`}
                  />
                  {electionForm.candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="p-2 text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"
                      aria-label={`Remove candidate ${index + 1}`}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCandidate}
                className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-teal-600 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
                aria-label="Add another candidate"
              >
                + Add Candidate
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-slide-in">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 animate-slide-in">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isWalletConnected}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 ${isLoading || !isWalletConnected ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-label="Create election"
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
                  Deploying Election...
                </>
              ) : (
                'Create Election'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/elections"
            className="text-sm text-teal-600 hover:text-teal-800 underline"
            aria-label="View all elections"
          >
            View All Elections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ElectionData } from '../../contexts/ElectionContext';

// const CreateElection = () => {
//   const {createElection} = ElectionData();
//   const navigate = useNavigate()
//   // State for election form
//   const [electionForm, setElectionForm] = useState({
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     candidates: [{ name: '' }],
//   });
//   const [elections, setElections] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setElectionForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle candidate input changes
//   const handleCandidateChange = (index, value) => {
//     const updatedCandidates = [...electionForm.candidates];
//     updatedCandidates[index].name = value;
//     setElectionForm((prev) => ({
//       ...prev,
//       candidates: updatedCandidates,
//     }));
//   };

//   // Add a new candidate field
//   const addCandidate = () => {
//     setElectionForm((prev) => ({
//       ...prev,
//       candidates: [...prev.candidates, { name: '' }],
//     }));
//   };

//   // Remove a candidate field
//   const removeCandidate = (index) => {
//     if (electionForm.candidates.length > 1) {
//       const updatedCandidates = electionForm.candidates.filter((_, i) => i !== index);
//       setElectionForm((prev) => ({
//         ...prev,
//         candidates: updatedCandidates,
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Validate form
//       if (!electionForm.title || !electionForm.description || !electionForm.startDate || !electionForm.endDate) {
//         throw new Error('All fields are required.');
//       }
//       if (electionForm.candidates.some((c) => !c.name)) {
//         throw new Error('All candidate names are required.');
//       }
//       if (new Date(electionForm.startDate) >= new Date(electionForm.endDate)) {
//         throw new Error('End date must be after start date.');
//       }
      
//       // Mock election data
//       const newElection = {
//         title: electionForm.title,
//         description: electionForm.description,
//         startDate: electionForm.startDate,
//         endDate: electionForm.endDate,
//         candidates: electionForm.candidates,
//         // status: new Date() < new Date(electionForm.startDate) ? 'Pending' : new Date() < new Date(electionForm.endDate) ? 'Active' : 'Ended',
//       };
      
//       // console.log(newElection);
//       await createElection(newElection);
//       // Update elections list
//       setElections((prev) => [...prev, newElection]);

//       // Reset form
//       setElectionForm({
//         title: '',
//         description: '',
//         startDate: '',
//         endDate: '',
//         candidates: [{ name: '' }],
//       });

//       setSuccess('Election created successfully!');
//       navigate("/elections")
//     } catch (err) {
//       setError(err.message || 'Failed to create election.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
//           Admin: Create Election
//         </h2>

//         {/* Election Creation Form */}
//         <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">New Election</h3>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                 Election Title
//               </label>
//               <input
//                 id="title"
//                 name="title"
//                 type="text"
//                 value={electionForm.title}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="e.g., Presidential Election 2025"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={electionForm.description}
//                 onChange={handleInputChange}
//                 required
//                 rows="4"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Describe the election..."
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
//                   Start Date
//                 </label>
//                 <input
//                   id="startDate"
//                   name="startDate"
//                   type="datetime-local"
//                   value={electionForm.startDate}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
//                   End Date
//                 </label>
//                 <input
//                   id="endDate"
//                   name="endDate"
//                   type="datetime-local"
//                   value={electionForm.endDate}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Candidates
//               </label>
//               {electionForm.candidates.map((candidate, index) => (
//                 <div key={index} className="flex items-center space-x-2 mb-2">
//                   <input
//                     type="text"
//                     value={candidate.name}
//                     onChange={(e) => handleCandidateChange(index, e.target.value)}
//                     required
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     placeholder={`Candidate ${index + 1} Name`}
//                   />
//                   {electionForm.candidates.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeCandidate(index)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addCandidate}
//                 className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
//               >
//                 + Add Candidate
//               </button>
//             </div>

//             {error && (
//               <div className="rounded-md bg-red-50 p-4">
//                 <div className="flex">
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {success && (
//               <div className="rounded-md bg-green-50 p-4">
//                 <div className="flex">
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-green-800">{success}</h3>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Election...
//                   </>
//                 ) : 'Create Election'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateElection;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';

// const CreateElection = () => {
//   const navigate = useNavigate();
//   const [election, setElection] = useState({
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     candidates: [{ name: '', description: '' }]
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setElection(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCandidateChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedCandidates = [...election.candidates];
//     updatedCandidates[index][name] = value;
//     setElection(prev => ({ ...prev, candidates: updatedCandidates }));
//   };

//   const addCandidate = () => {
//     setElection(prev => ({
//       ...prev,
//       candidates: [...prev.candidates, { name: '', description: '' }]
//     }));
//   };

//   const removeCandidate = (index) => {
//     if (election.candidates.length <= 1) return;
//     const updatedCandidates = [...election.candidates];
//     updatedCandidates.splice(index, 1);
//     setElection(prev => ({ ...prev, candidates: updatedCandidates }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validate dates
//       if (new Date(election.startDate) >= new Date(election.endDate)) {
//         throw new Error('End date must be after start date');
//       }

//       // Validate candidates
//       if (election.candidates.some(c => !c.name.trim())) {
//         throw new Error('All candidates must have names');
//       }

//       // Send to backend
//       const response = await axios.post('/api/elections', election, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       toast.success('Election created successfully!');
//       navigate('/admin/elections');
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || 'Failed to create election');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Election</h1>
          
//           <form onSubmit={handleSubmit}>
//             {/* Election Details */}
//             <div className="space-y-6 mb-8">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                   Election Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={election.title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={election.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Date *
//                   </label>
//                   <input
//                     type="datetime-local"
//                     id="startDate"
//                     name="startDate"
//                     value={election.startDate}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
//                     End Date *
//                   </label>
//                   <input
//                     type="datetime-local"
//                     id="endDate"
//                     name="endDate"
//                     value={election.endDate}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Candidates Section */}
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium text-gray-900">Candidates</h2>
//                 <button
//                   type="button"
//                   onClick={addCandidate}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Add Candidate
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {election.candidates.map((candidate, index) => (
//                   <div key={index} className="bg-gray-50 p-4 rounded-md">
//                     <div className="flex justify-between items-start mb-3">
//                       <h3 className="text-sm font-medium text-gray-700">Candidate #{index + 1}</h3>
//                       {election.candidates.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeCandidate(index)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>

//                     <div className="space-y-3">
//                       <div>
//                         <label htmlFor={`candidate-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
//                           Name *
//                         </label>
//                         <input
//                           type="text"
//                           id={`candidate-name-${index}`}
//                           name="name"
//                           value={candidate.name}
//                           onChange={(e) => handleCandidateChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label htmlFor={`candidate-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
//                           Description
//                         </label>
//                         <textarea
//                           id={`candidate-description-${index}`}
//                           name="description"
//                           value={candidate.description}
//                           onChange={(e) => handleCandidateChange(index, e)}
//                           rows={2}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/elections')}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Creating...' : 'Create Election'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateElection;