import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Mock Data State
let raceStartTime = Date.now();

// State variable to track if race is running
let isRaceActive = true;

const ATHLETES = [
    { id: '1', name: 'S. White', country: 'USA', bib: '012', speedKmh: 18.5, distance: 0 },
    { id: '2', name: 'M. Smith', country: 'CAN', bib: '014', speedKmh: 17.2, distance: 0 },
    { id: '3', name: 'J. Strife', country: 'MEX', bib: '131', speedKmh: 16.8, distance: 0 },
    { id: '4', name: 'W. Lee', country: 'KOR', bib: '017', speedKmh: 19.1, distance: 0 },
    { id: '5', name: 'A. Johnson', country: 'GBR', bib: '021', speedKmh: 17.9, distance: 0 },
    { id: '6', name: 'L. Müller', country: 'GER', bib: '045', speedKmh: 18.3, distance: 0 },
    { id: '7', name: 'T. Yamamoto', country: 'JPN', bib: '033', speedKmh: 17.5, distance: 0 },
    { id: '8', name: 'R. Patel', country: 'IND', bib: '056', speedKmh: 18.0, distance: 0 },
    { id: '9', name: 'C. Rossi', country: 'ITA', bib: '062', speedKmh: 17.7, distance: 0 },
    { id: '10', name: 'P. Garcia', country: 'ESP', bib: '078', speedKmh: 18.2, distance: 0 },
    { id: '11', name: 'H. Nguyen', country: 'VNM', bib: '089', speedKmh: 17.1, distance: 0 },
    { id: '12', name: 'E. Andersson', country: 'SWE', bib: '094', speedKmh: 18.8, distance: 0 },
    { id: '13', name: 'K. Kim', country: 'KOR', bib: '103', speedKmh: 16.9, distance: 0 },
    { id: '14', name: 'B. Brown', country: 'AUS', bib: '118', speedKmh: 18.4, distance: 0 },
    { id: '15', name: 'D. Silva', country: 'BRA', bib: '124', speedKmh: 17.6, distance: 0 },
    { id: '16', name: 'I. Novak', country: 'CZE', bib: '137', speedKmh: 17.3, distance: 0 },
    { id: '17', name: 'G. Petrov', country: 'BUL', bib: '142', speedKmh: 18.1, distance: 0 },
    { id: '18', name: 'M. Lopez', country: 'ARG', bib: '156', speedKmh: 17.8, distance: 0 },
    { id: '19', name: 'Y. Diallo', country: 'SEN', bib: '167', speedKmh: 17.4, distance: 0 },
    { id: '20', name: 'F. Dubois', country: 'FRA', bib: '178', speedKmh: 18.6, distance: 0 },
];

console.log("WebSocket Server started on ws://localhost:8080");

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial data immediately
    ws.send(JSON.stringify({ type: 'RACE_START', startTime: raceStartTime }));

    // Handle messages from the client
    ws.on('message', (message) => {
        const msg = message.toString();
        console.log(`Received command: ${msg}`);

        // Simple validation response
        if (msg.startsWith('RENDER_GRAPHIC')) {
            // Simulate an engine acknowledgement
            ws.send(JSON.stringify({ type: 'ACK', status: 'ON_AIR', message: 'Graphic received' }));
        }

        // Any additional command handling can go here
    });
});

const UPDATE_INTERVAL_MS = 1000;
// Simulate the race loop (updates every Xms)
setInterval(() => {
    if (!isRaceActive) return;

    // Update distances randomly based on speed
    ATHLETES.forEach(athlete => {
        // Add distance (meters) + random variance
        const movement = (athlete.speedKmh * 1000 / 3600) + (Math.random() * 2 - 1);
        athlete.distance += movement;
    });

    // Sort by distance (descending) to get current rank
    const sortedAthletes = [...ATHLETES].sort((a, b) => b.distance - a.distance);

    // Broadcast to all clients
    const payload = JSON.stringify({
        type: 'RACE_UPDATE',
        timestamp: Date.now(),
        athletes: sortedAthletes.map((a, index) => ({
            ...a,
            rank: index + 1,
            // Intentionally omit 'country' occasionally for the 4th place runner to test error handling
            country: (index === 3 && Math.random() > 0.5) ? undefined : a.country
        }))
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, UPDATE_INTERVAL_MS);