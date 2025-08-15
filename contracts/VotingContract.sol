// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    struct Poll {
        uint256 id;
        string title;
        string description;
        string[] candidates;
        uint256[] votes;
        uint256 startTime;
        uint256 endTime;
        address creator;
        bool active;
    }

    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public userVotes;
    
    uint256 public pollCount;
    
    event PollCreated(
        uint256 indexed pollId,
        string title,
        string description,
        string[] candidates,
        uint256 startTime,
        uint256 endTime,
        address indexed creator
    );
    
    event VoteCast(
        uint256 indexed pollId,
        uint256 indexed candidateIndex,
        address indexed voter,
        uint256 timestamp
    );

    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _candidates,
        uint256 _durationInHours
    ) external {
        require(_candidates.length >= 2, "At least 2 candidates required");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_durationInHours > 0, "Duration must be positive");

        uint256 pollId = pollCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (_durationInHours * 1 hours);

        polls[pollId] = Poll({
            id: pollId,
            title: _title,
            description: _description,
            candidates: _candidates,
            votes: new uint256[](_candidates.length),
            startTime: startTime,
            endTime: endTime,
            creator: msg.sender,
            active: true
        });

        emit PollCreated(pollId, _title, _description, _candidates, startTime, endTime, msg.sender);
    }

    function vote(uint256 _pollId, uint256 _candidateIndex) external {
        require(_pollId < pollCount, "Poll does not exist");
        require(!hasVoted[_pollId][msg.sender], "Already voted");
        require(isPollActive(_pollId), "Poll is not active");
        require(_candidateIndex < polls[_pollId].candidates.length, "Invalid candidate");

        hasVoted[_pollId][msg.sender] = true;
        userVotes[_pollId][msg.sender] = _candidateIndex;
        polls[_pollId].votes[_candidateIndex]++;

        emit VoteCast(_pollId, _candidateIndex, msg.sender, block.timestamp);
    }

    function getAllPolls() external view returns (Poll[] memory) {
        Poll[] memory allPolls = new Poll[](pollCount);
        for (uint256 i = 0; i < pollCount; i++) {
            allPolls[i] = polls[i];
            allPolls[i].active = isPollActive(i);
        }
        return allPolls;
    }

    function getPoll(uint256 _pollId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        string[] memory candidates,
        uint256[] memory votes,
        uint256 startTime,
        uint256 endTime,
        address creator,
        bool active
    ) {
        require(_pollId < pollCount, "Poll does not exist");
        Poll storage poll = polls[_pollId];
        return (
            poll.id,
            poll.title,
            poll.description,
            poll.candidates,
            poll.votes,
            poll.startTime,
            poll.endTime,
            poll.creator,
            isPollActive(_pollId)
        );
    }

    function getResults(uint256 _pollId) external view returns (
        string[] memory candidates,
        uint256[] memory votes,
        uint256 totalVotes,
        uint256 winnerIndex
    ) {
        require(_pollId < pollCount, "Poll does not exist");
        Poll storage poll = polls[_pollId];
        
        uint256 maxVotes = 0;
        uint256 winner = 0;
        uint256 total = 0;
        
        for (uint256 i = 0; i < poll.votes.length; i++) {
            total += poll.votes[i];
            if (poll.votes[i] > maxVotes) {
                maxVotes = poll.votes[i];
                winner = i;
            }
        }
        
        return (poll.candidates, poll.votes, total, winner);
    }

    function isPollActive(uint256 _pollId) public view returns (bool) {
        require(_pollId < pollCount, "Poll does not exist");
        return block.timestamp <= polls[_pollId].endTime;
    }

    function hasUserVoted(uint256 _pollId, address _user) external view returns (bool) {
        require(_pollId < pollCount, "Poll does not exist");
        return hasVoted[_pollId][_user];
    }

    function getUserVote(uint256 _pollId, address _user) external view returns (uint256) {
        require(_pollId < pollCount, "Poll does not exist");
        require(hasVoted[_pollId][_user], "User has not voted");
        return userVotes[_pollId][_user];
    }
}
