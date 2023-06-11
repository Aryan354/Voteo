const { BN } = require("web3-utils");



it("should allow candidate registration", async () => {
  const candidateName = "John Doe";
  const candidateAge = 35;
  const candidateParty = "Party A";
  const candidateCitizenshipNumber = new BN(123); // Update with a valid BigNumber value

  await votingContract.registerCandidate(
    candidateName,
    candidateAge,
    candidateParty,
    candidateCitizenshipNumber,
    { from: accounts[0] }
  );

  const candidate = await votingContract.getCandidate(accounts[0]);

  assert.equal(candidate.name, candidateName, "Candidate name mismatch");
  assert.equal(candidate.age, candidateAge, "Candidate age mismatch");
  assert.equal(candidate.party, candidateParty, "Candidate party mismatch");
  assert.equal(
    candidate.citizenshipNumber.toString(),
    candidateCitizenshipNumber.toString(),
    "Candidate citizenship number mismatch"
  );
});

it("should allow voter registration", async () => {
  const voterName = "Jane Smith";
  const voterAge = 30;
  const voterCitizenshipNumber = new BN(789); // Update with a valid BigNumber value

  await votingContract.registerVoter(
    voterName,
    voterAge,
    voterCitizenshipNumber,
    { from: accounts[1] }
  );

  const voter = await votingContract.getVoter(accounts[1]);

  assert.equal(voter.name, voterName, "Voter name mismatch");
  assert.equal(voter.age, voterAge, "Voter age mismatch");
  assert.equal(
    voter.citizenshipNumber.toString(),
    voterCitizenshipNumber.toString(),
    "Voter citizenship number mismatch"
  );
});
