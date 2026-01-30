# Girraphic Software Developer Task

You are provided with a monorepo containing a backend Node.js WebSocket Server (simulating a race timing engine) and a React frontend (the graphics operator's dashboard). You must build out the frontend to ingest incoming telemetry data, visualise the race order for an operator, and send formatted commands back to the engine.

## Setup Instructions

This repository is structured as a monorepo. You will need to run the backend server and frontend client in separate terminal windows.

### 1. Start the Race Server (Backend)

- `server/` contains the backend, set up with Express, TypeScript, and WebSockets
  - Entry point is at `server/src/index.ts`

The server emulates the timing provider and pushes JSON updates every second.

```bash
cd server
npm install
npm run dev
```

_Console output should indicate that the WebSocket Server has started on ws://localhost:8080._

### 2. Start the Dashboard (Frontend)

- `client/` contains the frontend, set up as a Vite + React + TypeScript application.
  - Entry point is at `client/src/App.tsx`
  - Tailwind CSS is installed for in-line styling (you may use plain CSS or any other styling solution)

```bash
cd client
npm install
npm run dev
```

_Open http://localhost:5173 in your browser to view the frontend._

## Your Task

We suggest spending between **2–3 hour(s)** on the task. We prioritise **code structure, architecture, and type safety** over a fully polished design.

- You may install any additional packages you wish to use.
- You do not have to use every package that is pre-installed and can style the application however you wish.
- You are not required to complete every requirement as long as the base functionality is complete (1-3, ingesting data and rendering data), particularly if you have less experience with React compared to other frameworks.

### Requirements

1. **WebSocket connection:** Connect to the WebSocket server from the client and show the connection status, store the latest incoming `RACE_UPDATE` data packet.
2. **Leaderboard UI:** render a list of athletes sorted by Rank (by default), displaying and formatting whichever information you find relevant appropriately
3. **Error Handling:** The server simulates "messy" real-world data. It will occasionally send incomplete records (e.g., an athlete missing a country code). Decide how best to handle the UI/UX for this "dirty" data.
4. **TypeSafety:** the current application does not make use of TypeScript type definitions, incorporate this anywhere across the client and server applications.
   - You may duplicate these definitions in both applications if needed
5. **Data Logic ("Gap to Leader"):**
   - Add a "gap" column for each athlete to give some context.
   - **1st Place:** Display "Leader" in the Gap column.
   - **Others:** Calculate and display the **distance** (in metres) between the current athlete and the current leader (e.g., "+ 45.2m").
6. **"Push to Air" functionality:** simulate sending a command to an external graphics engine (like Vizrt or Unreal Engine).
   - Add a **PUSH GRAPHIC** button to each athlete row.
   - When clicked, send a message back to the WebSocket server using this **exact plaintext format**:

   ```text
   RENDER_GRAPHIC*SCENE=LOWER_THIRD*NAME=[AthleteName]*COUNTRY=[Country]*GAP=[GapValue]
   ```

   _Example:_ `RENDER_GRAPHIC*SCENE=LOWER_THIRD*NAME=S. White*COUNTRY=USA*GAP=+12.5m`

7. **Add a race toggle command:** The race engine currently runs indefinitely. Implement a new control and WebSocket message handler for the command `TOGGLE_RACE` to pause/resume the generation of new race data.
8. Given any extra time, add any additional features you would find useful, for example one of the following:
   - **Performance:** Prevent unnecessary re-renders of the leaderboard rows when data hasn't changed.
   - **Auto-Reconnection:** If the server restarts or the connection drops, implement logic to automatically attempt to reconnect.
   - **UI:** Add the ability to sort the leaderboard by more than just the position rows

---

## Submission

1.  Delete the `node_modules` folders in both `client` and `server`.
2.  Zip the entire root directory.
3.  Send the zip file over email via link (e.g. Google Drive).

We wish you the best of luck!
