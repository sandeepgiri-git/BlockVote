import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { ElectionData } from '../contexts/ElectionContext'

const ELectionCard = ({elections}) => {
    const {openVoteModal, isLoading} = ElectionData();
  return (
    <>
      {elections?.map((election) => (
            <div
              key={election.electionAddress}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50">
                <h3 className="text-xl font-bold text-gray-900">{election.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{election.electionAddress}</p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{election.description}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                    {/* <span>
                      <span className="font-medium">Start:</span> {election.startDate}
                    </span> */}
                    <span>
                      <span className="font-medium">Start:</span> {new Date(election.startDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                    {/* <span>
                      <span className="font-medium">End:</span> {election.endDate}
                    </span> */}
                    <span>
                      <span className="font-medium">End:</span> {new Date(election.endDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <span>
                      <span className="font-medium">Candidates:</span> {election.candidates?.map((c) => c.name).join(', ')}
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
    </>
  )
}

export default ELectionCard
