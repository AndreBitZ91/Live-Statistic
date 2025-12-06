export enum ShotResult {
  GOAL = 'GOAL',
  SAVE = 'SAVE',
  MISS = 'MISS',
  BLOCK = 'BLOCK',
  TURNOVER = 'TURNOVER',
  TECHNICAL_FAULT = 'FAULT',
  TWO_MIN = '2MIN'
}

export enum CourtZone {
  LEFT_WING = 'Left Wing',
  RIGHT_WING = 'Right Wing',
  PIVOT = '6m / Pivot',
  BACK_LEFT = 'Left Back',
  BACK_RIGHT = 'Right Back',
  BACK_CENTER = 'Center Back',
  PENALTY = '7m Penalty',
  FAST_BREAK = 'Fast Break',
  UNKNOWN = 'General'
}

export enum TeamSide {
  HOME = 'HOME',
  AWAY = 'AWAY'
}

// Internal standard positions
export enum PlayerPosition {
  GK = 'GK',
  LW = 'LW',
  RW = 'RW',
  PV = 'PV',
  LB = 'LB',
  RB = 'RB',
  CB = 'CB'
}

export interface Player {
  id: string;
  number: string;
  name: string;
  position: PlayerPosition;
  isGoalkeeper: boolean;
}

export interface Suspension {
  id: string;
  playerId: string;
  startTime: number;
  endTime: number;
}

export interface Shot {
  id: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  result: ShotResult;
  zone: CourtZone;
  playerId: string;
  team: TeamSide;
  timestamp: number;
  gameTime: number;
}

export interface MatchMeta {
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  isLive: boolean;
  gameTime: number; // Seconds remaining (30:00 down to 0)
  isTimerRunning: boolean;
  period: 1 | 2;
  homeScore: number;
  awayScore: number;
}

export interface TeamState {
  roster: Player[];
  onCourt: string[]; // Array of Player IDs (max 7)
  suspensions: Suspension[];
}