import { useMemo } from 'react';
import { useRaceSocket } from './hooks/useRaceSocket';
import { LeaderboardRow } from './components/LeaderboardRow';
import type { AthleteWithGap } from './types/race';

export default function App() {
  const { connected, latestRaceUpdate } = useRaceSocket();

  const leaderboard: AthleteWithGap[] = useMemo(() => {
    if (latestRaceUpdate.length === 0) return [];

    const sorted = [...latestRaceUpdate].sort(
      (a, b) => a.rank - b.rank
    );

    const leaderDistance = sorted[0].distance;

    return sorted.map((athlete, index) => ({
      ...athlete,
      gap:
        index === 0
          ? 'Leader'
          : `+ ${(leaderDistance - athlete.distance).toFixed(1)} m`,
    }));
  }, [latestRaceUpdate]);

  return (
    <div className="min-h-screen w-screen bg-neutral-900 text-white font-mono">
      <div className="px-8">
        <header className="mb-6 flex justify-between items-center border-b border-neutral-700 pb-4">
          <h1 className="text-2xl font-bold text-yellow-500">
            GIRRAPHIC LIVE
          </h1>
          <span className={connected ? 'text-green-400' : 'text-red-400'}>
            {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </header>

        <main>
          {leaderboard.length === 0 ? (
            <div className="text-neutral-400">
              Waiting for race data...
            </div>
          ) : (
            <table className="w-full table-fixed border-collapse">
              <thead className="text-neutral-400 text-sm border-b border-neutral-700">
                <tr>
                  <th className="w-12 text-left px-2">#</th>
                  <th className="text-left px-2">Name</th>
                  <th className="w-32 text-left px-2">Country</th>
                  <th className="w-32 text-left px-2">Distance</th>
                  <th className="w-32 text-left px-2">Gap</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((athlete) => (
                  <LeaderboardRow
                    key={athlete.id}
                    athlete={athlete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
