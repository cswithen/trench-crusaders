import styles from './Leaderboard.module.scss';
import type { Warband } from '../../types/Warband';
import Link from '../Shared/Link';
import { useFactions, useSubfactions } from '../../hooks/useFactions';

export type WarbandStats = {
    warband: Warband;
    matches: number;
    wins: number;
    losses: number;
    pending?: number;
};

import React from 'react';

type SortKey = 'warband' | 'faction' | 'wins' | 'losses' | 'matches';
type SortOrder = 'asc' | 'desc';

export default function Leaderboard({ stats }: { stats: WarbandStats[] }) {
    const { data: factions = [] } = useFactions();
    const { data: allSubfactions = [] } = useSubfactions();
    const [sortKey, setSortKey] = React.useState<SortKey>('wins');
    const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder(key === 'wins' ? 'desc' : 'asc');
        }
    };

    // Map internal sort order to ARIA-compliant values
    const getAriaSort = (
        key: SortKey
    ): 'none' | 'ascending' | 'descending' | 'other' | undefined => {
        if (sortKey !== key) return 'none';
        if (sortOrder === 'asc') return 'ascending';
        if (sortOrder === 'desc') return 'descending';
        return 'none';
    };

    const sortedStats = React.useMemo(() => {
        return [...stats].sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';
            switch (sortKey) {
                case 'warband':
                    aValue = a.warband.name.toLowerCase();
                    bValue = b.warband.name.toLowerCase();
                    break;
                case 'faction':
                    aValue =
                        factions
                            .find((f) => f.id === a.warband.faction_id)
                            ?.name?.toLowerCase() || '';
                    bValue =
                        factions
                            .find((f) => f.id === b.warband.faction_id)
                            ?.name?.toLowerCase() || '';
                    break;
                case 'wins':
                    aValue = a.wins;
                    bValue = b.wins;
                    break;
                case 'losses':
                    aValue = a.losses;
                    bValue = b.losses;
                    break;
                case 'matches':
                    aValue = a.matches;
                    bValue = b.matches;
                    break;
                default:
                    break;
            }
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else if (
                typeof aValue === 'number' &&
                typeof bValue === 'number'
            ) {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [stats, sortKey, sortOrder, factions]);

    const renderSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <>
            <h3>Leaderboard</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <button
                                type="button"
                                className={styles['sort-header']}
                                onClick={() => handleSort('warband')}
                                aria-sort={getAriaSort('warband')}
                            >
                                Warband{renderSortIndicator('warband')}
                            </button>
                        </th>
                        <th>
                            <button
                                type="button"
                                className={styles['sort-header']}
                                onClick={() => handleSort('faction')}
                                aria-sort={getAriaSort('faction')}
                            >
                                Faction / Subfaction
                                {renderSortIndicator('faction')}
                            </button>
                        </th>
                        <th>
                            <button
                                type="button"
                                className={styles['sort-header']}
                                onClick={() => handleSort('wins')}
                                aria-sort={getAriaSort('wins')}
                            >
                                Wins{renderSortIndicator('wins')}
                            </button>
                        </th>
                        <th>
                            <button
                                type="button"
                                className={styles['sort-header']}
                                onClick={() => handleSort('losses')}
                                aria-sort={getAriaSort('losses')}
                            >
                                Losses{renderSortIndicator('losses')}
                            </button>
                        </th>
                        <th>
                            <button
                                type="button"
                                className={styles['sort-header']}
                                onClick={() => handleSort('matches')}
                                aria-sort={getAriaSort('matches')}
                            >
                                Matches{renderSortIndicator('matches')}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStats.map((s) => {
                        const faction = factions.find(
                            (f) => f.id === s.warband.faction_id
                        );
                        const subfaction = allSubfactions.find(
                            (sf) => sf.id === s.warband.subfaction_id
                        );
                        return (
                            <tr key={s.warband.id}>
                                <td>
                                    <Link
                                        to={`/warbands/${s.warband.id}`}
                                        className={styles.link}
                                        aria-label={`View details for warband ${s.warband.name}`}
                                    >
                                        {s.warband.name}
                                    </Link>
                                </td>
                                <td>
                                    <div>
                                        {faction ? faction.name : <em>None</em>}
                                    </div>
                                    {subfaction && (
                                        <div
                                            style={{
                                                fontSize: '0.95em',
                                                color: '#888',
                                            }}
                                        >
                                            ({subfaction.name})
                                        </div>
                                    )}
                                </td>
                                <td>{s.wins}</td>
                                <td>{s.losses}</td>
                                <td>
                                    {s.matches}
                                    {typeof s.pending === 'number' &&
                                    s.pending > 0
                                        ? ` (${s.pending})`
                                        : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
