import { setElection, vote, getElection, getVotes } from "..";
import { Election } from "../model";

describe("Election ", () => {
  it("should create election", () => {
    let election = defaultElection();

    setElection(election);
    const result = getElection("22");
    expect(result ? result.id : null).toBe("22");
  });

  throws(
    "should fail to create an election with less than 2 candidates",
    (): void => {
      let election = defaultElection();
      election.candidates = [];

      setElection(election);
    },
    "election must have at least two candidates"
  );

  throws(
    "should fail to create an election with end time not in the future",
    (): void => {
      let election = defaultElection();
      election.endTime = Date.now();

      setElection(election);
    }
  );

  it("should vote", () => {
    let election = defaultElection();

    setElection(election);
    let result1 = getVotes("22");
    let vote1 = result1 ? result1.get("Jude") : 0;
    vote("22", "Jude");
    let result2 = getVotes("22");
    let vote2 = result2 ? result2.get("Jude") : 0;
    expect(vote1 + 1).toBe(vote2);
  });

  throws("should fail to vote after endtime", () => {
    let election = defaultElection();
    // very short time that elapses before
    // calling vote method
    let votingPeriod = 1;
    election.endTime = Date.now() + votingPeriod;

    setElection(election);
    vote("22", "Jude");
  });
});

function defaultElection(): Election {
  let election = new Election();

  election.candidates = ["Jude", "Ben"];
  election.position = "president";
  election.id = "22";
  election.description = "post of president";
  election.endTime = Date.now() + Date.now();

  return election;
}
