import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ElectionData } from '../../contexts/ElectionContext';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CompletedElectionSummary = () => {
  const { isWalletConnected } = ElectionData();
  const { id } = useParams(); // e.g., /elections/1/summary

  // Dummy election data (completed)
  // const election2 = {
  //   id: id || '1',
  //   title: 'Student Council Election 2025',
  //   description: 'Election for the 2025-2026 student council president.',
  //   startDate: '2025-05-13T10:00:00+05:30', // IST
  //   endDate: '2025-05-13T11:00:00+05:30', // IST
  //   status: 'Ended',
  //   totalVoters: 100,
  //   candidates: [
  //     { name: 'Alice Smith', votes: 50 },
  //     { name: 'Bob Johnson', votes: 30 },
  //     { name: 'Charlie Brown', votes: 20 },
  //   ],
  // };

  const election1 = JSON.parse(localStorage.getItem("endedElections")).filter((e) => {
    return e.electionAddress === id;
  }) 
  const election = election1[0];

  let totalVoters = 0;
  election.candidates.forEach(e => {
    totalVoters += e.votes;
  });

  election["totalVoters"] = totalVoters;
  // console.log(election)

  // Memoize winner and vote percentages
  const {winner, votePercentages } = useMemo(() => {
    const winner = election?.candidates?.reduce((prev, curr) =>
      curr.votes > prev.votes ? curr : prev
    );
    const percentages = election?.candidates?.map((candidate) => ({
      name: candidate.name,
      percentage: election.totalVoters > 0 ? (candidate.votes / election.totalVoters) * 100 : 0,
    }));
    return { winner, votePercentages: percentages };
  }, [election.candidates, election.totalVoters]);

  // Bar chart data
  const chartData = {
    labels: election?.candidates?.map((c) => c.name),
    datasets: [
      {
        label: 'Votes',
        data: election?.candidates?.map((c) => c.votes),
        backgroundColor: ['#38bdf8', '#14b8a6', '#0ea5e9'],
        borderColor: ['#1e40af', '#115e59', '#083344'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} votes (${votePercentages[context.dataIndex].percentage.toFixed(1)}%)`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Votes',
          color: '#1f2937',
        },
        ticks: {
          color: '#1f2937',
        },
      },
      x: {
        ticks: {
          color: '#1f2937',
        },
      },
    },
    maintainAspectRatio: false,
  };

  // useEffect(() =>{
  //   getData()
  // },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="mb-6 h-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded mx-auto w-20 animate-fade-in"></div>
        <h1 className="text-center text-4xl font-extrabold text-gray-900 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            {election.title} - Summary
          </span>
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in">
          Election ID: {election.electionAddress} | Status: Ended
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg sm:rounded-xl sm:p-6 border border-teal-100 animate-slide-in">
          {/* Winner */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{!election.winner ? "No one voted" : election.winner?.length == 1 ? "Winner" : "Draw"}</h2>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg px-4 py-2 animate-fade-in">
              <span className="text-lg font-medium">{election.candidates[0].votes != 0 && (election?.winner?.length == 1 ? election.winner[0]?.name : 
                                <div className='flex flex-col gap-2 '>
                                  {election.winner?.map((c) => (
                                    <p key={c.name}>
                                      {c.name} 
                                    </p>
                                  ))}
                                </div>
                              )}</span>
              <span className="text-sm">
                {winner.votes} votes ({votePercentages.find((p) => p.name === winner.name).percentage.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Total Voters */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Total Voters</h2>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xl font-bold animate-fade-in">
              {election.totalVoters}
            </div>
          </div>

          {/* Candidates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidates</h2>
            <div className="space-y-4">
              {election.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-teal-100 animate-fade-in"
                  role="region"
                  aria-label={`Candidate ${candidate.name}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center text-white font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                    <span className="text-lg font-medium text-gray-900">{candidate.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {candidate.votes} votes ({votePercentages[index].percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vote Distribution Bar Chart */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Distribution</h2>
            <div className="relative h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Election Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="block text-sm font-medium text-gray-700">Description</span>
                <p className="mt-1 text-sm text-gray-600">{election.description}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">Start Date</span>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(election.startDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                <span className="block text-sm font-medium text-gray-700 mt-2">End Date</span>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(election.endDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedElectionSummary;



// import { useEffect, useMemo, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// const CompletedElectionSummary = () => {
//   const { id } = useParams(); // e.g., /elections/1/summary

//   // Fetch election from localStorage
//   const election1 = JSON.parse(localStorage.getItem("endedElections"))?.filter((e) => e.electionAddress === id) || [];
//   const election = election1[0];

//   // Calculate total voters
//   let totalVoters = 0;
//   if (election?.candidates) {
//     election.candidates.forEach(e => {
//       totalVoters += e.votes;
//     });
//     election.totalVoters = totalVoters;
//   }

//   // Memoize winner and vote percentages
//   const { winner, votePercentages } = useMemo(() => {
//     const winner = election?.candidates?.reduce((prev, curr) =>
//       curr.votes > prev.votes ? curr : prev, election.candidates[0]
//     ) || { name: 'N/A', votes: 0 };
//     const percentages = election?.candidates?.map((candidate) => ({
//       name: candidate.name,
//       percentage: election.totalVoters > 0 ? (candidate.votes / election.totalVoters) * 100 : 0,
//     })) || [];
//     return { winner, votePercentages: percentages };
//   }, [election?.candidates, election?.totalVoters]);

//   // Bar chart data
//   const barChartData = {
//     labels: election?.candidates?.map((c) => c.name) || [],
//     datasets: [
//       {
//         label: 'Votes',
//         data: election?.candidates?.map((c) => c.votes) || [],
//         backgroundColor: ['#38bdf8', '#14b8a6', '#0ea5e9'],
//         borderColor: ['#1e40af', '#115e59', '#083344'],
//         borderWidth: 1,
//         borderRadius: 8,
//         barThickness: 40,
//       },
//     ],
//   };

//   const barChartOptions = {
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: '#1f2937',
//         titleColor: '#fff',
//         bodyColor: '#fff',
//         callbacks: {
//           label: (context) => `${context.label}: ${context.raw} votes (${votePercentages[context.dataIndex]?.percentage.toFixed(1)}%)`,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Votes',
//           color: '#1f2937',
//           font: { size: 14, weight: 'bold' },
//         },
//         ticks: { color: '#1f2937', font: { size: 12 } },
//         grid: { color: '#e5e7eb' },
//       },
//       x: {
//         ticks: { color: '#1f2937', font: { size: 12 } },
//         grid: { display: false },
//       },
//     },
//     maintainAspectRatio: false,
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart',
//     },
//   };

//   // Doughnut chart data
//   const doughnutChartData = {
//     labels: election?.candidates?.map((c) => c.name) || [],
//     datasets: [
//       {
//         data: election?.candidates?.map((c) => c.votes) || [],
//         backgroundColor: ['#38bdf8', '#14b8a6', '#0ea5e9'],
//         borderColor: ['#fff'],
//         borderWidth: 2,
//         hoverOffset: 20,
//       },
//     ],
//   };

//   const doughnutChartOptions = {
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: '#1f2937',
//           font: { size: 12 },
//           padding: 20,
//         },
//       },
//       tooltip: {
//         backgroundColor: '#1f2937',
//         titleColor: '#fff',
//         bodyColor: '#fff',
//         callbacks: {
//           label: (context) => `${context.label}: ${context.raw} votes (${votePercentages[context.dataIndex]?.percentage.toFixed(1)}%)`,
//         },
//       },
//     },
//     cutout: '60%',
//     maintainAspectRatio: false,
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart',
//     },
//   };

//   if (!election) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center">
//         <div className="text-center text-gray-600 text-lg animate-fade-in">
//           Election not found.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-200 py-16 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
//         <div className="mb-8 h-1 bg-gradient-to-r from-blue-700 to-teal-700 rounded mx-auto w-24 animate-fade-in delay-100"></div>
//         <h1 className="text-center text-5xl font-extrabold text-gray-900 animate-fade-in delay-200">
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-700">
//             {election.title}
//           </span>
//         </h1>
//         <p className="mt-3 text-center text-base text-gray-700 animate-fade-in delay-300">
//           Election Address: <span className="font-mono">{election.electionAddress.slice(0, 6)}...{election.electionAddress.slice(-4)}</span> | Status: <span className="font-semibold text-teal-700">Ended</span>
//         </p>
//       </div>

//       <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-4xl space-y-12">
//         {/* Winner Card */}
//         <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-teal-200 animate-slide-in delay-400">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Winner</h2>
//           <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-blue-700 to-teal-700 text-white rounded-xl px-6 py-4 shadow-lg transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-500">
//             <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
//               {winner.name.charAt(0)}
//             </div>
//             <div>
//               <span className="text-xl font-semibold">{winner.name}</span>
//               <p className="text-sm opacity-90">
//                 {winner.votes} votes ({votePercentages.find((p) => p.name === winner.name)?.percentage.toFixed(1)}%)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Total Voters Card */}
//         <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-teal-200 animate-slide-in delay-600">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Total Voters</h2>
//           <div className="flex justify-center">
//             <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg animate-fade-in delay-700">
//               {election.totalVoters}
//               <div className="absolute inset-0 rounded-full border-4 border-teal-300 opacity-50 animate-pulse"></div>
//             </div>
//           </div>
//         </div>

//         {/* Candidates List */}
//         <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-teal-200 animate-slide-in delay-800">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Candidates</h2>
//           <div className="space-y-4">
//             {election.candidates.map((candidate, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between bg-white bg-opacity-95 p-4 rounded-xl shadow-sm border border-teal-100 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in"
//                 style={{ animationDelay: `${900 + index * 100}ms` }}
//                 role="region"
//                 aria-label={`Candidate ${candidate.name}`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-700 to-teal-700 flex items-center justify-center text-white text-lg font-bold">
//                     {candidate.name.charAt(0)}
//                   </div>
//                   <span className="text-lg font-semibold text-gray-900">{candidate.name}</span>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-700">
//                     {candidate.votes} votes
//                   </p>
//                   <p className="text-sm text-teal-600">
//                     {votePercentages[index]?.percentage.toFixed(1)}%
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-teal-200 animate-slide-in delay-1000">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Vote Distribution</h2>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Bar Chart */}
//             <div className="relative h-80">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Votes by Candidate</h3>
//               <Bar data={barChartData} options={barChartOptions} />
//             </div>
//             {/* Doughnut Chart */}
//             <div className="relative h-80">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Vote Share</h3>
//               <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
//             </div>
//           </div>
//         </div>

//         {/* Election Info Card */}
//         <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-teal-200 animate-slide-in delay-1100">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Election Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <span className="block text-sm font-medium text-gray-700">Description</span>
//               <p className="mt-1 text-sm text-gray-600 leading-relaxed">{election.description}</p>
//             </div>
//             <div>
//               <span className="block text-sm font-medium text-gray-700">Start Date</span>
//               <p className="mt-1 text-sm text-gray-600">
//                 {new Date(election.startDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
//               </p>
//               <span className="block text-sm font-medium text-gray-700 mt-4">End Date</span>
//               <p className="mt-1 text-sm text-gray-600">
//                 {new Date(election.endDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompletedElectionSummary;


// // import { useMemo } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { UserData } from '../../contexts/UserContext';
// // import { Pie } from 'react-chartjs-2';
// // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// // // Register Chart.js components
// // ChartJS.register(ArcElement, Tooltip, Legend);

// // const ElectionDetails = () => {
// //   const { isWalletConnected } = UserData();
// //   const { id } = useParams(); // e.g., /elections/1

// //   // Dummy election data
// //   const election = {
// //     id: id || '1',
// //     title: 'Student Council Election 2025',
// //     description: 'Vote for the next student council president to lead our university for the 2025-2026 term.',
// //     startDate: '2025-05-13T10:00',
// //     endDate: '2025-05-13T11:00',
// //     status: 'Ongoing',
// //     totalVoters: 100,
// //     candidates: [
// //       { name: 'Alice Smith', votes: 40, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
// //       { name: 'Bob Johnson', votes: 35, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
// //       { name: 'Charlie Brown', votes: 25, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
// //     ],
// //   };

// //   // Memoize vote percentages
// //   const votePercentages = useMemo(() => {
// //     return election.candidates.map((candidate) => ({
// //       name: candidate.name,
// //       percentage: election.totalVoters > 0 ? (candidate.votes / election.totalVoters) * 100 : 0,
// //     }));
// //   }, [election.candidates, election.totalVoters]);

// //   // Pie chart data
// //   const chartData = {
// //     labels: election.candidates.map((c) => c.name),
// //     datasets: [
// //       {
// //         data: election.candidates.map((c) => c.votes),
// //         backgroundColor: ['#38bdf8', '#14b8a6', '#0ea5e9'],
// //         borderColor: ['#1e40af', '#115e59', '#083344'],
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const chartOptions = {
// //     plugins: {
// //       legend: {
// //         position: 'bottom',
// //         labels: {
// //           color: '#1f2937',
// //           font: {
// //             size: 14,
// //           },
// //         },
// //       },
// //       tooltip: {
// //         callbacks: {
// //           label: (context) => `${context.label}: ${context.raw} votes (${votePercentages[context.dataIndex].percentage.toFixed(1)}%)`,
// //         },
// //       },
// //     },
// //     maintainAspectRatio: false,
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 py-12 sm:px-6 lg:px-8">
// //       <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
// //         <div className="mb-6 h-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded mx-auto w-24 animate-fade-in"></div>
// //         <h1 className="text-center text-4xl font-extrabold text-gray-900 animate-fade-in">
// //           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
// //             {election.title}
// //           </span>
// //         </h1>
// //         <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in">
// //           Election ID: {election.id}
// //         </p>
// //       </div>

// //       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
// //         <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg sm:rounded-xl sm:p-8 border border-teal-100 animate-slide-in">
// //           {/* Election Info */}
// //           <div className="mb-8">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Details</h2>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div className="space-y-4">
// //                 <div>
// //                   <span className="block text-sm font-medium text-gray-700">Description</span>
// //                   <p className="mt-1 text-sm text-gray-600">{election.description}</p>
// //                 </div>
// //                 <div>
// //                   <span className="block text-sm font-medium text-gray-700">Status</span>
// //                   <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
// //                     {election.status}
// //                   </span>
// //                 </div>
// //               </div>
// //               <div className="space-y-4">
// //                 <div>
// //                   <span className="block text-sm font-medium text-gray-700">Start Date</span>
// //                   <p className="mt-1 text-sm text-gray-600">
// //                     {new Date(election.startDate).toLocaleString()}
// //                   </p>
// //                 </div>
// //                 <div>
// //                   <span className="block text-sm font-medium text-gray-700">End Date</span>
// //                   <p className="mt-1 text-sm text-gray-600">
// //                     {new Date(election.endDate).toLocaleString()}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Total Voters */}
// //           <div className="mb-8 text-center">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-2">Total Voters</h2>
// //             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-2xl font-bold animate-fade-in">
// //               {election.totalVoters}
// //             </div>
// //           </div>

// //           {/* Candidates */}
// //           <div className="mb-8">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidates</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// //               {election.candidates.map((candidate, index) => (
// //                 <div
// //                   key={index}
// //                   className="bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-teal-100 transition-transform duration-300 hover:scale-105 animate-fade-in"
// //                   role="region"
// //                   aria-label={`Candidate ${candidate.name}`}
// //                 >
// //                   <img
// //                     src={candidate.avatar}
// //                     alt={`${candidate.name} avatar`}
// //                     className="w-16 h-16 rounded-full mx-auto mb-2"
// //                   />
// //                   <h3 className="text-lg font-medium text-gray-900 text-center">{candidate.name}</h3>
// //                   <p className="text-sm text-gray-600 text-center">
// //                     Votes: {candidate.votes} ({votePercentages[index].percentage.toFixed(1)}%)
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Vote Counts Pie Chart */}
// //           <div className="mb-8">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Distribution</h2>
// //             <div className="relative h-64">
// //               <Pie data={chartData} options={chartOptions} />
// //             </div>
// //           </div>

// //           {/* Vote Button (Placeholder) */}
// //           <div className="text-center">
// //             <button
// //               disabled={!isWalletConnected}
// //               className={`inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${
// //                 !isWalletConnected ? 'opacity-70 cursor-not-allowed' : ''
// //               }`}
// //               aria-label="Vote in election"
// //             >
// //               {isWalletConnected ? 'Vote Now' : 'Connect Wallet to Vote'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ElectionDetails;