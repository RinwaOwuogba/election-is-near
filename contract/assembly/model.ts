import {
  PersistentUnorderedMap,
  u128,
  context,
  PersistentMap,
} from "near-sdk-as";

@nearBindgen
export class Election {
  id: string;
  candidates: string[];
  scores: PersistentMap<string, u32>;
  position: string;
  description: string;
  owner: string;
  votes: u32;
  voted: PersistentMap<string, bool>;
  endTime: i64;

  public static fromPayload(payload: Election): Election {
    const election = new Election();
    election.id = payload.id;
    election.candidates = payload.candidates;
    election.position = payload.position;
    election.owner = context.sender;
    election.description = payload.description;
    election.votes = 0;
    election.scores = new PersistentMap<string, u32>(
      `y${allElection.length + 1}`
    );
    election.voted = new PersistentMap<string, bool>(
      `t${allElection.length + 1}`
    );
    election.endTime = payload.endTime;
    return election;
  }
  public vote(candidate: string): void {
    let votes = 0;
    assert(!this.voted.contains(context.sender), "Already Voted");
    assert(new Date(this.endTime).getTime() > Date.now(), "election is closed");

    if (this.scores.contains(candidate)) {
      votes = this.scores.getSome(candidate);
    }

    this.scores.set(candidate, votes + 1);
    this.votes += 1;
    this.voted.set(context.sender, true);
  }

  public getVotes(): Map<string, u32> {
    let scores = new Map<string, u32>();
    for (let i = 0; i < this.candidates.length; i++) {
      let votes = 0;

      let candidate = this.candidates[i];
      if (this.scores.contains(candidate)) {
        votes = this.scores.getSome(candidate);
      }
      scores.set(candidate, votes);
    }

    return scores;
  }
}

let counter = 0;
export const allElection = new PersistentUnorderedMap<string, Election>("v");
