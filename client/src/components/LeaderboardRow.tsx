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
      <tr className="border-b border-neutral-800 text-xs sm:text-sm hover:bg-neutral-800 transition-colors">
        {/* Rank */}
        <td className="py-2 px-2 w-12">
          {athlete.rank}
        </td>

        {/* Name */}
        <td className="px-2 font-medium truncate">
          {athlete.name}
        </td>

        {/* Country (hidden on mobile) */}
        <td
          className={`hidden sm:table-cell px-2 ${hasCountry ? 'text-neutral-300' : 'text-neutral-500 italic'
            }`}
        >
          {athlete.country ?? '—'}
        </td>

        {/* Gap */}
        <td className="px-2 whitespace-nowrap">
          {athlete.gap}
        </td>

        {/* Distance (hidden on small + tablet) */}
        <td className="hidden md:table-cell px-2 text-neutral-400 whitespace-nowrap">
          {athlete.distance.toFixed(1)} m
        </td>

        {/* Action */}
        <td className="px-2">
          <button
            onClick={handlePushGraphic}
            className="
              w-full sm:w-auto
              bg-yellow-500 text-black
              px-2 py-1
              rounded
              hover:bg-yellow-600
              active:bg-yellow-700
              text-[10px] sm:text-xs
              font-semibold
            "
          >
            PUSH
          </button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.athlete.rank === nextProps.athlete.rank &&
      prevProps.athlete.distance === nextProps.athlete.distance &&
      prevProps.athlete.gap === nextProps.athlete.gap &&
      prevProps.athlete.country === nextProps.athlete.country
    );
  }
);
