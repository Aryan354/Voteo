import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/VotingContract.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterAddress, setVoterAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    initializeWeb3();
    initializeContract();
    fetchCandidates();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 provider not found');
    }
  };

  const initializeContract = async () => {
    if (web3) {
      try {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract', error);
      }
    }
  };

  const fetchCandidates = async () => {
    if (contract) {
      try {
        setLoading(true);
        const candidatesCount = await contract.methods.getCandidatesCount().call();
        const candidatesArray = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contract.methods.candidates(i).call();
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates', error);
        setLoading(false);
      }
    }
  };

  const handleVote = async () => {
    if (contract && selectedCandidate && voterAddress) {
      try {
        setLoading(true);
        await contract.methods.vote(selectedCandidate.id).send({ from: voterAddress });
        alert('Vote cast successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Error casting vote', error);
        setLoading(false);
      }
    } else {
      setErrorMessage('Please select a candidate and enter your address.');
    }
  };

  const renderCandidates = () => {
    return candidates.map((candidate) => (
      <div key={candidate.id} className="p-4 m-4 bg-gray-200 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <p className="mt-2">Party: {candidate.party}</p>
        <p className="mt-2">Age: {candidate.age}</p>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-semibold text-center mb-8">Voting Application</h1>

      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <div className="flex flex-wrap justify-center">
          {renderCandidates()}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
        <div className="flex items-center mb-4">
          <label htmlFor="voterAddress" className="mr-2">Your Address:</label>
          <input
            type="text"
            id="voterAddress"
            className="p-2 border border-gray-300 rounded-lg"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="selectedCandidate" className="mr-2">Select Candidate:</label>
          <select
            id="selectedCandidate"
            className="p-2 border border-gray-300 rounded-lg"
            value={selectedCandidate ? selectedCandidate.id : ''}
            onChange={(e) =>
              setSelectedCandidate(candidates.find((c) => c.id === Number(e.target.value)))
            }
          >
            <option value="">-- Select --</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleVote}
          disabled={loading}
        >
          {loading ? 'Submitting Vote...' : 'Cast Vote'}
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
