// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    string public title;
    string public description;
    uint public startDate;
    uint public endDate;
    address public admin;

    uint public candidateCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(bytes32 => bool) public votersAadhar;

    constructor(
        string memory _title,
        string memory _description,
        uint _startDate,
        uint _endDate,
        string[] memory _candidateNames
    ) {
        admin = msg.sender;
        title = _title;
        description = _description;
        startDate = _startDate;
        endDate = _endDate;

        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates[candidateCount] = Candidate(candidateCount, _candidateNames[i], 0);
            candidateCount++;
        }
    }


    function vote(uint _candidateId, address sender, string memory aadharNumber) public {
        bytes32 hashedAadhar = keccak256(abi.encodePacked(aadharNumber));

        require(!voters[sender], "Already voted");
        require(!votersAadhar[hashedAadhar], "Aadhaar already used to vote");

        require(_candidateId >= 0 && _candidateId < candidateCount, "Invalid candidate");

        voters[sender] = true;
        votersAadhar[hashedAadhar] = true;
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint index) public view returns (string memory, uint, uint) {
        require(index < candidateCount, "Invalid index");
        Candidate memory c = candidates[index];
        return (c.name, c.voteCount, c.id);
    }


    function getDetails() public view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        string memory
    ) {
        return (title, description, startDate, endDate, getStatus());
    }

    function getStatus() public view returns (string memory) {
        if (block.timestamp < startDate) return "Pending";
        else if (block.timestamp >= startDate && block.timestamp <= endDate) return "Active";
        else return "Ended";
    }
}



// contract Election {
//     struct Candidate {
//         uint id;
//         string name;
//         uint voteCount;
//     }

//     string public title;
//     string public description;
//     uint public startDate;
//     uint public endDate;
//     address public admin;

//     uint public candidateCount;

//     mapping(uint => Candidate) public candidates;
//     mapping(address => bool) public voters;

//     constructor(
//         string memory _title,
//         string memory _description,
//         uint _startDate,
//         uint _endDate,
//         string[] memory _candidateNames
//     ) {
//         admin = msg.sender;
//         title = _title;
//         description = _description;
//         startDate = _startDate;
//         endDate = _endDate;

//         for (uint i = 0; i < _candidateNames.length; i++) {
//             candidates[candidateCount] = Candidate(candidateCount, _candidateNames[i], 0);
//             candidateCount++;
//         }
//     }

//     function vote(uint _candidateId) public {
//         require(block.timestamp >= startDate, "Voting not started");
//         require(block.timestamp <= endDate, "Voting ended");
//         require(!voters[msg.sender], "Already voted");
//         require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");

//         voters[msg.sender] = true;
//         candidates[_candidateId].voteCount++;
//     }

//     function getCandidate(uint index) public view returns (string memory, uint) {
//         require(index < candidateCount, "Invalid index");
//         Candidate memory c = candidates[index];
//         return (c.name, c.voteCount);
//     }

//     function getDetails() public view returns (
//         string memory,
//         string memory,
//         uint256,
//         uint256,
//         string memory
//     ) {
//         return (title, description, startDate, endDate, getStatus());
//     }

//     function getStatus() public view returns (string memory) {
//         if (block.timestamp < startDate) return "Pending";
//         else if (block.timestamp >= startDate && block.timestamp <= endDate) return "Active";
//         else return "Ended";
//     }
// }
