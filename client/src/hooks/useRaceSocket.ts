import { useEffect, useRef, useState } from 'react';
import type { ServerMessage, Athlete } from '../types/race';

const WS_URL = 'ws://localhost:8080';

export function useRaceSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [latestRaceUpdate, setLatestRaceUpdate] = useState<Athlete[]>([]);

  useEffect(() => {
    // Function to establish WebSocket connection
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onclose = () => {
        setConnected(false);
        // Attempt to reconnect after 2 seconds
        setTimeout(connect, 2000);
      };

      ws.onmessage = (event) => {
        let msg: ServerMessage;

        try {
          msg = JSON.parse(event.data) as ServerMessage;
        } catch (error) {
          console.error('Failed to parse WebSocket message:', event.data);
          return;
        }

        // Only update race data if type is 'RACE_UPDATE'
        if (msg.type === 'RACE_UPDATE') {
          setLatestRaceUpdate(msg.athletes);
        }
      };
    };

    connect();

    // Cleanup on unmount
    return () => {
      socketRef.current?.close();
    };
  }, []);

  // Function to send any command to the server
  const sendCommand = (command: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(command);
    } else {
      console.warn('WebSocket is not open. Command not sent:', command);
    }
  };

  return { connected, latestRaceUpdate, sendCommand };
}
