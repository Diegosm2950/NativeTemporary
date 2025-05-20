export interface Team {
    id: string;
    name: string;
    shortName: string;
    logo: string;
  }
  
  export interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    league: string;
    status: 'scheduled' | 'live' | 'finished';
    homeScore?: number;
    awayScore?: number;
    matchDay: number;
  }