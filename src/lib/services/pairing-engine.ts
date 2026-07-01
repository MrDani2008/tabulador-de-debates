export interface TeamPairingInput {
  id: string;
  institutionId: string;
  history: TeamHistory;
}

export interface TeamHistory {
  opponents: string[];
  govCount: number;
  oppCount: number;
  openCount: number;
  closeCount: number;
  positions: PositionCount;
}

export interface PositionCount {
  AG: number;
  AO: number;
  BG: number;
  BO: number;
}

export interface DebatePairing {
  teams: [string, string, string, string];
  positions: {
    AG: string;
    AO: string;
    BG: string;
    BO: string;
  };
  isBye: boolean;
}

export interface PairingResult {
  pairings: DebatePairing[];
  byes: string[];
}

export function createEmptyHistory(): TeamHistory {
  return {
    opponents: [],
    govCount: 0,
    oppCount: 0,
    openCount: 0,
    closeCount: 0,
    positions: { AG: 0, AO: 0, BG: 0, BO: 0 },
  };
}

export function generatePairings(teams: TeamPairingInput[]): PairingResult {
  if (teams.length < 2) {
    return { pairings: [], byes: teams.map((t) => t.id) };
  }

  const shuffled = shuffleArray([...teams]);
  const pairings: DebatePairing[] = [];
  const byes: string[] = [];

  const hasOddTeams = shuffled.length % 2 !== 0;
  if (hasOddTeams) {
    const byeTeam = selectByeTeam(shuffled);
    byes.push(byeTeam.id);
    shuffled.splice(shuffled.indexOf(byeTeam), 1);
  }

  for (let i = 0; i < shuffled.length; i += 2) {
    const team1 = shuffled[i];
    const team2 = shuffled[i + 1];

    if (team1.institutionId === team2.institutionId && i + 2 < shuffled.length) {
      const swapped = swapToAvoidInstitutionClash(shuffled, i);
      if (swapped) {
        pairings.push(createDebatePairing(team1, team2));
      } else {
        pairings.push(createDebatePairing(team1, team2));
      }
    } else {
      pairings.push(createDebatePairing(team1, team2));
    }
  }

  return { pairings, byes };
}

export function assignPositions(
  pairings: DebatePairing[],
  teams: Map<string, TeamPairingInput>,
): DebatePairing[] {
  return pairings.map((pairing) => {
    if (pairing.isBye) return pairing;

    const [team1Id, team2Id, team3Id, team4Id] = pairing.teams;
    const team1 = teams.get(team1Id)!;
    const team2 = teams.get(team2Id)!;
    const team3 = teams.get(team3Id)!;
    const team4 = teams.get(team4Id)!;

    const opening = selectOpeningPair(team1, team2);
    const closing = selectOpeningPair(team3, team4);

    const gov1 = selectGovernmentTeam(opening[0], opening[1]);
    const opp1 = gov1.id === opening[0].id ? opening[1] : opening[0];

    const gov2 = selectGovernmentTeam(closing[0], closing[1]);
    const opp2 = gov2.id === closing[0].id ? closing[1] : closing[0];

    const agPos = selectSpecificPosition(gov1);
    const aoPos = selectSpecificPosition(opp1);
    const bgPos = selectSpecificPosition(gov2);
    const boPos = selectSpecificPosition(opp2);

    return {
      ...pairing,
      positions: {
        AG: agPos.id,
        AO: aoPos.id,
        BG: bgPos.id,
        BO: boPos.id,
      },
    };
  });
}

function selectByeTeam(teams: TeamPairingInput[]): TeamPairingInput {
  return teams.reduce((weakest, current) => {
    const weakScore = getTeamStrengthScore(weakest);
    const currScore = getTeamStrengthScore(current);
    return currScore < weakScore ? current : weakest;
  });
}

function getTeamStrengthScore(team: TeamPairingInput): number {
  const h = team.history;
  return h.govCount + h.oppCount + h.openCount + h.closeCount;
}

function createDebatePairing(
  opening1: TeamPairingInput,
  opening2: TeamPairingInput,
  closing1?: TeamPairingInput,
  closing2?: TeamPairingInput,
): DebatePairing {
  const t3 = closing1 ?? opening1;
  const t4 = closing2 ?? opening2;

  return {
    teams: [opening1.id, opening2.id, t3.id, t4.id],
    positions: { AG: '', AO: '', BG: '', BO: '' },
    isBye: false,
  };
}

function selectOpeningPair(
  team1: TeamPairingInput,
  team2: TeamPairingInput,
): [TeamPairingInput, TeamPairingInput] {
  const t1Gov = team1.history.govCount;
  const t2Gov = team2.history.govCount;

  if (t1Gov < t2Gov) return [team1, team2];
  if (t2Gov < t1Gov) return [team2, team1];
  return team1.id < team2.id ? [team1, team2] : [team2, team1];
}

function selectGovernmentTeam(
  team1: TeamPairingInput,
  team2: TeamPairingInput,
): TeamPairingInput {
  const t1Opp = team1.history.oppCount;
  const t2Opp = team2.history.oppCount;

  if (t1Opp > t2Opp) return team1;
  if (t2Opp > t1Opp) return team2;
  return team1.id < team2.id ? team1 : team2;
}

function selectSpecificPosition(
  team: TeamPairingInput,
): TeamPairingInput {
  return team;
}

function swapToAvoidInstitutionClash(
  teams: TeamPairingInput[],
  index: number,
): boolean {
  for (let j = index + 2; j < teams.length; j++) {
    if (teams[j].institutionId !== teams[index].institutionId) {
      const temp = teams[index + 1];
      teams[index + 1] = teams[j];
      teams[j] = temp;
      return true;
    }
  }
  return false;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
