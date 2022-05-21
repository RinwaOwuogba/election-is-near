import { Election, allElection } from "./model";
import { ContractPromiseBatch, context, PersistentMap } from "near-sdk-as";

export function setElection(election: Election): void {
  let elect = allElection.get(election.id);
  assert(elect === null, `an election with ${election.id} already exists`);
  assert(
    election.candidates.length >= 2,
    "election must have at two candidates"
  );
  assert(
    new Date(election.endTime).getTime() > Date.now(),
    "election end time must be in the future"
  );
  allElection.set(election.id, Election.fromPayload(election));
}

export function getElection(id: string): Election | null {
  return allElection.get(id);
}

export function getElections(): Election[] {
  return allElection.values();
}

export function vote(id: string, candidate: string): void {
  const election = getElection(id);
  if (election == null) {
    throw new Error("election not found");
  }

  election.vote(candidate);
  allElection.set(election.id, election);
}

export function getVotes(id: string): Map<string, u32> | null {
  const election = allElection.get(id);
  return election ? election.getVotes() : null;
}
