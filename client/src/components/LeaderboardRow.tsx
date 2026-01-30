import React from 'react';
import type { Athlete } from '../types/race';

type AthleteWithGap = Athlete & {
  gap: string;
};

type Props = {
  athlete: AthleteWithGap;
};

export const LeaderboardRow = React.memo(({ athlete }: Props) => {
  const hasCountry = Boolean(athlete.country);

  return (
    <tr className="border-b border-neutral-800 text-sm">
      <td className="py-2 px-2">{athlete.rank}</td>
      <td className="px-2">{athlete.name}</td>

      <td
        className={`px-2 ${
          hasCountry ? 'text-neutral-300' : 'text-neutral-500 italic'
        }`}
      >
        {athlete.country ?? '—'}
      </td>

      <td className="px-2">{athlete.gap}</td>

      <td className="px-2 text-neutral-400">
        {athlete.distance.toFixed(1)} m
      </td>
    </tr>
  );
});
