import { useRaceSocket } from './hooks/useRaceSocket';
import { LeaderboardRow } from './components/LeaderboardRow';
import { useSorttableLeaderboard } from './hooks/useSorttableLeaderboard';

export default function App() {
  const { connected, latestRaceUpdate } = useRaceSocket();
  const { leaderboard, handleSort, sortArrow } = useSorttableLeaderboard(latestRaceUpdate);

  return (
    <div className="min-h-screen w-screen bg-neutral-900 text-white font-mono">
      <div className="px-8">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center border-b border-neutral-700 pb-4">
          <h1 className="text-2xl font-bold text-yellow-500">GIRRAPHIC LIVE</h1>
          <span className={connected ? 'text-green-400' : 'text-red-400'}>
            {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </header>

        {/* Leaderboard */}
        <main>
          {leaderboard.length === 0 ? (
            <div className="text-neutral-400">Waiting for race data...</div>
          ) : (
            <div className="overflow-y-auto max-h-[600px] border border-neutral-700 rounded-md">
              <table className="w-full table-fixed border-collapse">
                <thead className="text-neutral-400 text-sm sticky top-0 bg-neutral-900 border-b border-neutral-700 z-10">
                  <tr>
                    <th className="w-12 text-left px-2 py-2 cursor-pointer" onClick={() => handleSort('rank')}>
                      # {sortArrow('rank')}
                    </th>
                    <th className="text-left px-2 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortArrow('name')}
                    </th>
                    <th className="w-32 text-left px-2 py-2 cursor-pointer" onClick={() => handleSort('country')}>
                      Country {sortArrow('country')}
                    </th>
                    <th className="w-32 text-left px-2 py-2 cursor-pointer" onClick={() => handleSort('gap')}>
                      Gap {sortArrow('gap')}
                    </th>
                    <th className="w-32 text-left px-2 py-2 cursor-pointer" onClick={() => handleSort('distance')}>
                      Distance {sortArrow('distance')}
                    </th>
                    <th className="w-32 text-left px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((athlete) => (
                    <LeaderboardRow key={athlete.id} athlete={athlete} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
