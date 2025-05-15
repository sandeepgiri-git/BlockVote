// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Election.sol";

contract ElectionFactory {
    address[] public elections;
    
    struct ElectionDetails {
        string title;
        string description;
        uint startDate;
        uint endDate;
        string status;
        address electionAddress;
    }

    event ElectionCreated(address electionAddress);
    event Voted(address indexed voter, uint indexed electionIndex, uint candidateId);

    function createElection(
        string memory title,
        string memory description,
        uint startDate,
        uint endDate,
        string[] memory candidateNames
    ) public {
        Election election = new Election(title, description, startDate, endDate, candidateNames);
        elections.push(address(election));
        emit ElectionCreated(address(election));
    }

    // Allows a voter to cast their vote in a specific election
    function vote(address electionAdd, uint candidateId) public returns(bool success) {
        uint electionIndex = 10000;
        for(uint i=0;i<elections.length; i++){
            if(elections[i] == electionAdd){
                electionIndex = i;
            }
        }
        require(electionIndex < elections.length, "Invalid election index");
        Election election = Election(electionAdd);
        
        // Get election details to check status
        (, , , , string memory status) = election.getDetails();
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Active")), 
               "Voting is not active");
        
        election.vote(candidateId,msg.sender);
        emit Voted(msg.sender, electionIndex, candidateId);
        return true;
    }

    // Gets the winner of a specific election
    function getWinner(address _election) public view returns (
        uint ,
        string memory ,
        uint 
    ) {
        Election election = Election(_election);
        
        // Get all candidates
        uint candidateCount = election.candidateCount();
        
        // Initialize tracking variables
        uint maxVotes = 0;
        uint winnerId = 0;
        string memory name;
        
        // Find candidate with most votes
        for (uint i = 0; i < candidateCount; i++) {
            (string memory _name,uint votes, uint id) = election.getCandidate(i);
            if (votes > maxVotes) {
                maxVotes = votes;
                winnerId = id;
                name = _name;
            }
        }
            
        return (winnerId, name, maxVotes);
    }

    // [Previous functions remain unchanged...]
    function getElections() public view returns (address[] memory) {
        return elections;
    }

    function getElectionDetails(uint index) public view returns (
        string memory title,
        string memory description,
        uint startDate,
        uint endDate,
        string memory status,
        address electionAddress
    ) {
        require(index < elections.length, "Invalid election index");
        Election election = Election(elections[index]);
        (title, description, startDate, endDate, status) = election.getDetails();
        electionAddress = elections[index];
    }

    function getElectionCandidates(uint electionIndex) public view returns (
        string[] memory names,
        uint[] memory voteCounts,
        uint[] memory ids
    ) {
        require(electionIndex < elections.length, "Invalid election index");
        Election election = Election(elections[electionIndex]);
        
        uint candidateCount = election.candidateCount();
        names = new string[](candidateCount);
        voteCounts = new uint[](candidateCount);
        ids = new uint[](candidateCount);
        
        for (uint i = 0; i < candidateCount; i++) {
            (string memory name, uint voteCount, uint id) = election.getCandidate(i);
            names[i] = name;
            voteCounts[i] = voteCount;
            ids[i] = id;
        }
    }

    function getElectionCount() public view returns (uint) {
        return elections.length;
    }
}




// import "./Election.sol";

// contract ElectionFactory {
//     address[] public elections;

//     event ElectionCreated(address electionAddress);

//     function createElection(
//         string memory title,
//         string memory description,
//         uint startDate,
//         uint endDate,
//         string[] memory candidateNames
//     ) public {
//         Election election = new Election(title, description, startDate, endDate, candidateNames);
//         elections.push(address(election));
//         emit ElectionCreated(address(election));
//     }

//     function getElections() public view returns (address[] memory) {
//         return elections;
//     }
// }
