import React from 'react';
import type { AthleteWithGap } from '../types/race';
import { useRaceSocket } from '../hooks/useRaceSocket';

type Props = {
  athlete: AthleteWithGap;
};

export const LeaderboardRow = React.memo(
  ({ athlete }: Props) => {
    const { sendCommand } = useRaceSocket();
    const hasCountry = Boolean(athlete.country);

    const handlePushGraphic = () => {
      const country = athlete.country ?? '—';
      const message = `RENDER_GRAPHIC*SCENE=LOWER_THIRD*NAME=${athlete.name}*COUNTRY=${country}*GAP=${athlete.gap}`;
      sendCommand(message);
      console.log('Sent command:', message);
    };

    return (
      <tr className="border-b border-neutral-800 text-sm">
        <td className="py-2 px-2">{athlete.rank}</td>
        <td className="px-2">{athlete.name}</td>
        <td className={`px-2 ${hasCountry ? 'text-neutral-300' : 'text-neutral-500 italic'}`}>
          {athlete.country ?? '—'}
        </td>
        <td className="px-2">{athlete.gap}</td>
        <td className="px-2 text-neutral-400">{athlete.distance.toFixed(1)} m</td>
        <td className="px-2">
          <button
            onClick={handlePushGraphic}
            className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 text-xs"
          >
            PUSH GRAPHIC
          </button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if relevant fields changed
    return (
      prevProps.athlete.rank === nextProps.athlete.rank &&
      prevProps.athlete.distance === nextProps.athlete.distance &&
      prevProps.athlete.gap === nextProps.athlete.gap &&
      prevProps.athlete.country === nextProps.athlete.country
    );
  }
);
