export interface AdjudicatorInput {
  id: string;
  institutionId: string;
  category: string;
  experience: string;
  workload: number;
}

export interface DebateInput {
  id: string;
  teamInstitutionIds: string[];
}

export interface ConflictInput {
  adjudicatorId: string;
  targetId: string;
  conflictType: string;
}

export interface AllocationResult {
  debateId: string;
  chairId: string;
  panelIds: string[];
}

export function allocateAdjudicators(
  adjudicators: AdjudicatorInput[],
  debates: DebateInput[],
  conflicts: ConflictInput[],
  panelSize: number = 3,
): AllocationResult[] {
  const sorted = [...adjudicators].sort((a, b) => {
    const catOrder: Record<string, number> = {
      CHAIR: 0,
      PANELIST: 1,
      WING: 2,
      TRAINING: 3,
    };
    const expOrder: Record<string, number> = {
      SENIOR: 0,
      EXPERIENCED: 1,
      INTERMEDIATE: 2,
      NOVICE: 3,
    };
    const catDiff = (catOrder[a.category] ?? 4) - (catOrder[b.category] ?? 4);
    if (catDiff !== 0) return catDiff;
    return (expOrder[a.experience] ?? 4) - (expOrder[b.experience] ?? 4);
  });

  const results: AllocationResult[] = [];
  const workloadMap = new Map(sorted.map((a) => [a.id, a.workload]));

  for (const debate of debates) {
    const chair = selectChair(sorted, debate, conflicts, workloadMap);
    if (!chair) continue;

    const remaining = sorted.filter(
      (a) =>
        a.id !== chair.id &&
        !isConflict(a.id, chair.id, conflicts) &&
        !debate.teamInstitutionIds.includes(a.institutionId),
    );

    const panel: string[] = [];
    for (const adj of remaining) {
      if (panel.length >= panelSize - 1) break;
      if (!panel.some((p) => isConflict(p, adj.id, conflicts))) {
        panel.push(adj.id);
        workloadMap.set(adj.id, (workloadMap.get(adj.id) ?? 0) + 1);
      }
    }

    workloadMap.set(chair.id, (workloadMap.get(chair.id) ?? 0) + 1);

    results.push({
      debateId: debate.id,
      chairId: chair.id,
      panelIds: panel,
    });
  }

  return results;
}

function selectChair(
  adjudicators: AdjudicatorInput[],
  debate: DebateInput,
  conflicts: ConflictInput[],
  workloadMap: Map<string, number>,
): AdjudicatorInput | null {
  const eligible = adjudicators.filter(
    (a) =>
      a.category === 'CHAIR' &&
      !debate.teamInstitutionIds.includes(a.institutionId) &&
      !conflicts.some(
        (c) =>
          c.adjudicatorId === a.id &&
          debate.teamInstitutionIds.includes(c.targetId),
      ),
  );

  if (eligible.length === 0) return null;

  return eligible.reduce((best, current) => {
    const bestWorkload = workloadMap.get(best.id) ?? 0;
    const currWorkload = workloadMap.get(current.id) ?? 0;
    return currWorkload < bestWorkload ? current : best;
  });
}

function isConflict(adjId1: string, adjId2: string, conflicts: ConflictInput[]): boolean {
  return conflicts.some(
    (c) =>
      (c.adjudicatorId === adjId1 && c.targetId === adjId2) ||
      (c.adjudicatorId === adjId2 && c.targetId === adjId1),
  );
}
