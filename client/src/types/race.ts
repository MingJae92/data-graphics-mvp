export type Athlete = {
    id: string;
    name: string;
    country?: string;
    bib: string;
    speedKmh: number;
    distance: number;
    rank: number;
};

export type AthleteWithGap = Athlete & {
    gap: string;
};

export type RaceUpdateMessage = {
    type: 'RACE_UPDATE';
    timestamp: number;
    athletes: Athlete[];
};

export type ServerMessage =
    | RaceUpdateMessage
    | { type: 'RACE_START'; startTime: number }
    | { type: 'ACK'; status: string; message: string };
