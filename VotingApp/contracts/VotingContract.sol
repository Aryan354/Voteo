// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

contract VotingContract {
    struct Candidate {
        string name;
        uint256 age;
        string partyRepresentation;
        uint256 citizenshipNumber;
        uint256 voteCount;
    }

    struct Voter {
        string name;
        uint256 age;
        uint256 citizenshipNumber;
        bool hasVoted;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => Voter) public voters;

    uint256 public candidateCount;
    uint256 public voterCount;

    // Event emitted when a new candidate is registered
    event CandidateRegistered(uint256 candidateId);

    // Event emitted when a new voter is registered
    event VoterRegistered(uint256 voterId);

    // Event emitted when a vote is cast
    event VoteCast(uint256 voterId, uint256 candidateId);

    function registerCandidate(string memory _name, uint256 _age, string memory _partyRepresentation, uint256 _citizenshipNumber) public {
        require(_age >= 18, "Candidates must be at least 18 years old.");
        require(_citizenshipNumber > 0, "Invalid citizenship number.");

        candidates[candidateCount] = Candidate(_name, _age, _partyRepresentation, _citizenshipNumber, 0);
        emit CandidateRegistered(candidateCount);
        candidateCount++;
    }

    function registerVoter(string memory _name, uint256 _age, uint256 _citizenshipNumber) public {
        require(_age >= 18, "Voters must be at least 18 years old.");
        require(_citizenshipNumber > 0, "Invalid citizenship number.");

        voters[voterCount] = Voter(_name, _age, _citizenshipNumber, false);
        emit VoterRegistered(voterCount);
        voterCount++;
    }

    function castVote(uint256 _voterId, uint256 _candidateId) public {
        require(_voterId < voterCount, "Invalid voter ID.");
        require(_candidateId < candidateCount, "Invalid candidate ID.");

        Voter storage voter = voters[_voterId];
        require(!voter.hasVoted, "You have already cast your vote.");

        Candidate storage candidate = candidates[_candidateId];
        require(candidate.age <= voter.age, "You cannot vote for a candidate younger than you.");

        // Check for double voting
        require(candidate.citizenshipNumber == voter.citizenshipNumber, "Your citizenship number does not match the candidate's.");

        // Check for fraudulent voting
        require(candidate.voteCount <= 1, "This candidate has already received more than one vote.");

        candidate.voteCount++;
        voter.hasVoted = true;

        emit VoteCast(_voterId, _candidateId);
    }
}
