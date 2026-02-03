import { useMemo, useState } from 'react';
import type { Athlete } from '../types/race';

export type AthleteWithGap = Athlete & { gap: string };
export type SortKey = 'rank' | 'name' | 'distance' | 'gap' | 'country';
export type SortDirection = 'asc' | 'desc';

export function useSorttableLeaderboard(latestRaceUpdate: Athlete[]) {
    const [sortKey, setSortKey] = useState<SortKey>('rank');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const leaderboard: AthleteWithGap[] = useMemo(() => {
        if (latestRaceUpdate.length === 0) return [];

        const sortedByRank = [...latestRaceUpdate].sort(
            (a, b) => a.rank - b.rank
        );

        const leaderDistance = sortedByRank[0]?.distance ?? 0;

        const withGap: AthleteWithGap[] = sortedByRank.map((athlete, index) => ({
            ...athlete,
            gap:
                index === 0
                    ? 'Leader'
                    : `+ ${(leaderDistance - athlete.distance).toFixed(1)} m`,
        }));

        return [...withGap].sort((a, b) => {
            let aVal: any = a[sortKey];
            let bVal: any = b[sortKey];

            // Convert gap string to number for comparison
            if (sortKey === 'gap') {
                aVal = a.gap === 'Leader' ? 0 : parseFloat(a.gap.replace('+ ', '').replace(' m', ''));
                bVal = b.gap === 'Leader' ? 0 : parseFloat(b.gap.replace('+ ', '').replace(' m', ''));
            }

            if (typeof aVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
        });
    }, [latestRaceUpdate, sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortArrow = (key: SortKey) =>
        sortKey === key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '';

    return { leaderboard, handleSort, sortArrow };
}
