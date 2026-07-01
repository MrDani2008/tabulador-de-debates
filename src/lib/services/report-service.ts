import type { BallotRepository } from '@/lib/repositories/ballot-repository';
import type { TeamRepository } from '@/lib/repositories/team-repository';
import type { SpeakerRepository } from '@/lib/repositories/speaker-repository';
import type { AdjudicatorRepository } from '@/lib/repositories/adjudicator-repository';
import type { RoundRepository } from '@/lib/repositories/round-repository';
import type { DebateRepository } from '@/lib/repositories/debate-repository';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  tournamentId: string;
  dataType: 'teams' | 'speakers' | 'adjudicators' | 'rounds' | 'debates' | 'ballots';
}

export interface ExportResult {
  filename: string;
  contentType: string;
  data: string;
}

export class ReportService {
  constructor(
    private ballotRepository: BallotRepository,
    private teamRepository: TeamRepository,
    private speakerRepository: SpeakerRepository,
    private adjudicatorRepository: AdjudicatorRepository,
    private roundRepository: RoundRepository,
    private debateRepository: DebateRepository,
  ) {}

  async exportData(options: ExportOptions): Promise<ExportResult> {
    const { format, tournamentId, dataType } = options;

    switch (dataType) {
      case 'teams':
        return this.exportTeams(tournamentId, format);
      case 'speakers':
        return this.exportSpeakers(tournamentId, format);
      case 'adjudicators':
        return this.exportAdjudicators(tournamentId, format);
      case 'rounds':
        return this.exportRounds(tournamentId, format);
      case 'debates':
        return this.exportDebates(tournamentId, format);
      case 'ballots':
        return this.exportBallots(tournamentId, format);
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  private async exportTeams(tournamentId: string, format: string): Promise<ExportResult> {
    const teams = await this.teamRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        teams.map((t) => ({
          ID: t.id,
          Name: t.name,
          Institution: t.institutionId,
          Status: t.status,
          Created: t.createdAt,
          Updated: t.updatedAt,
        })),
        'teams',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        teams.map((t) => ({
          ID: t.id,
          Name: t.name,
          Institution: t.institutionId,
          Status: t.status,
          Created: t.createdAt,
          Updated: t.updatedAt,
        })),
        'teams',
      );
    }

    return this.toPDF(teams, 'teams');
  }

  private async exportSpeakers(tournamentId: string, format: string): Promise<ExportResult> {
    const speakers = await this.speakerRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        speakers.map((s) => ({
          ID: s.id,
          Name: s.fullName,
          Email: s.email ?? '',
          Phone: s.phone ?? '',
          Team: s.teamId,
          Institution: s.institutionId,
          Status: s.status,
        })),
        'speakers',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        speakers.map((s) => ({
          ID: s.id,
          Name: s.fullName,
          Email: s.email ?? '',
          Phone: s.phone ?? '',
          Team: s.teamId,
          Institution: s.institutionId,
          Status: s.status,
        })),
        'speakers',
      );
    }

    return this.toPDF(speakers, 'speakers');
  }

  private async exportAdjudicators(tournamentId: string, format: string): Promise<ExportResult> {
    const adjudicators = await this.adjudicatorRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        adjudicators.map((a) => ({
          ID: a.id,
          Name: a.fullName,
          Email: a.email ?? '',
          Phone: a.phone ?? '',
          Category: a.category,
          Experience: a.experience,
          Institution: a.institutionId,
          Status: a.status,
        })),
        'adjudicators',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        adjudicators.map((a) => ({
          ID: a.id,
          Name: a.fullName,
          Email: a.email ?? '',
          Phone: a.phone ?? '',
          Category: a.category,
          Experience: a.experience,
          Institution: a.institutionId,
          Status: a.status,
        })),
        'adjudicators',
      );
    }

    return this.toPDF(adjudicators, 'adjudicators');
  }

  private async exportRounds(tournamentId: string, format: string): Promise<ExportResult> {
    const rounds = await this.roundRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        rounds.map((r) => ({
          ID: r.id,
          Number: r.number,
          Type: r.type,
          Status: r.status,
          Created: r.createdAt,
          Updated: r.updatedAt,
        })),
        'rounds',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        rounds.map((r) => ({
          ID: r.id,
          Number: r.number,
          Type: r.type,
          Status: r.status,
          Created: r.createdAt,
          Updated: r.updatedAt,
        })),
        'rounds',
      );
    }

    return this.toPDF(rounds, 'rounds');
  }

  private async exportDebates(tournamentId: string, format: string): Promise<ExportResult> {
    const debates = await this.debateRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        debates.map((d) => ({
          ID: d.id,
          Round: d.roundId,
          Room: d.roomId ?? '',
          Created: d.createdAt,
          Updated: d.updatedAt,
        })),
        'debates',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        debates.map((d) => ({
          ID: d.id,
          Round: d.roundId,
          Room: d.roomId ?? '',
          Created: d.createdAt,
          Updated: d.updatedAt,
        })),
        'debates',
      );
    }

    return this.toPDF(debates, 'debates');
  }

  private async exportBallots(tournamentId: string, format: string): Promise<ExportResult> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);

    if (format === 'csv') {
      return this.toCSV(
        ballots.map((b) => ({
          ID: b.id,
          Debate: b.debateId,
          Round: b.roundId,
          Status: b.status,
          Rankings: JSON.stringify(b.rankings),
          Scores: JSON.stringify(b.speakerScores),
          Comments: b.comments ?? '',
          Created: b.createdAt,
          Updated: b.updatedAt,
        })),
        'ballots',
      );
    }

    if (format === 'excel') {
      return this.toExcel(
        ballots.map((b) => ({
          ID: b.id,
          Debate: b.debateId,
          Round: b.roundId,
          Status: b.status,
          Rankings: JSON.stringify(b.rankings),
          Scores: JSON.stringify(b.speakerScores),
          Comments: b.comments ?? '',
          Created: b.createdAt,
          Updated: b.updatedAt,
        })),
        'ballots',
      );
    }

    return this.toPDF(ballots, 'ballots');
  }

  private toCSV(data: Record<string, unknown>[], dataType: string): ExportResult {
    if (data.length === 0) {
      return {
        filename: `${dataType}.csv`,
        contentType: 'text/csv',
        data: '',
      };
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header] ?? '');
          return value.includes(',') || value.includes('"') || value.includes('\n')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(','),
    );

    return {
      filename: `${dataType}.csv`,
      contentType: 'text/csv',
      data: [headers.join(','), ...rows].join('\n'),
    };
  }

  private toExcel(data: Record<string, unknown>[], dataType: string): ExportResult {
    if (data.length === 0) {
      return {
        filename: `${dataType}.xml`,
        contentType: 'application/xml',
        data: '',
      };
    }

    const headers = Object.keys(data[0]);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="${dataType}">
    <Table>
      <Row>
        ${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('\n        ')}
      </Row>
      ${data
        .map(
          (row) => `<Row>
        ${headers.map((h) => `<Cell><Data ss:Type="String">${String(row[h] ?? '')}</Data></Cell>`).join('\n        ')}
      </Row>`,
        )
        .join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`;

    return {
      filename: `${dataType}.xml`,
      contentType: 'application/xml',
      data: xml,
    };
  }

  private toPDF(data: unknown[], dataType: string): ExportResult {
    const content = JSON.stringify(data, null, 2);
    return {
      filename: `${dataType}.pdf`,
      contentType: 'application/pdf',
      data: content,
    };
  }
}
