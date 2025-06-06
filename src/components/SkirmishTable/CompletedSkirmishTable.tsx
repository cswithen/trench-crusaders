import React from 'react';
import type { Skirmish } from '../../services/skirmishService';
import type { Warband } from '../../types/Warband';
import styles from './SkirmishTableBase.module.scss';

interface Props {
    skirmishes: Skirmish[];
    warbands: Warband[];
}

import { SkirmishTableBase } from './SkirmishTableBase';

const trophy = (
    <span
        role="img"
        aria-label="Winner"
        className={styles['skirmish-table__winner-icon']}
        style={{ marginLeft: 4 }}
    >
        🏆
    </span>
);

const skull = (
    <span
        role="img"
        aria-label="Loser"
        className={styles['skirmish-table__loser-icon']}
        style={{ marginLeft: 4 }}
    >
        💀
    </span>
);

type SortKey = 'created_at' | 'arena' | 'attacker' | 'defender';
type SortOrder = 'asc' | 'desc';

const CompletedSkirmishTable: React.FC<Props> = ({ skirmishes, warbands }) => {
    const [sortKey, setSortKey] = React.useState<SortKey>('created_at');
    const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder(key === 'created_at' ? 'desc' : 'asc');
        }
    };

    const getAriaSort = (
        key: SortKey
    ): 'none' | 'ascending' | 'descending' | 'other' | undefined => {
        if (sortKey !== key) return 'none';
        if (sortOrder === 'asc') return 'ascending';
        if (sortOrder === 'desc') return 'descending';
        return 'none';
    };

    const sortedSkirmishes = React.useMemo(() => {
        return [...skirmishes].sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';
            switch (sortKey) {
                case 'created_at':
                    aValue = a.created_at || '';
                    bValue = b.created_at || '';
                    break;
                case 'arena':
                    aValue = (a.arena_name || '').toLowerCase();
                    bValue = (b.arena_name || '').toLowerCase();
                    break;
                case 'attacker': {
                    const leftA =
                        warbands.find((w) => w.id === a.left_warband_id)
                            ?.name || '';
                    const leftB =
                        warbands.find((w) => w.id === b.left_warband_id)
                            ?.name || '';
                    aValue = leftA.toLowerCase();
                    bValue = leftB.toLowerCase();
                    break;
                }
                case 'defender': {
                    const rightA =
                        warbands.find((w) => w.id === a.right_warband_id)
                            ?.name || '';
                    const rightB =
                        warbands.find((w) => w.id === b.right_warband_id)
                            ?.name || '';
                    aValue = rightA.toLowerCase();
                    bValue = rightB.toLowerCase();
                    break;
                }
                default:
                    break;
            }
            if (sortKey === 'created_at') {
                // Sort by date string
                return sortOrder === 'asc'
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            }
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return 0;
        });
    }, [skirmishes, sortKey, sortOrder, warbands]);

    const renderSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <SkirmishTableBase
            skirmishes={sortedSkirmishes}
            columns={[
                {
                    key: 'arena',
                    label: (
                        <button
                            type="button"
                            className={styles['sort-header']}
                            onClick={() => handleSort('arena')}
                            aria-sort={getAriaSort('arena')}
                        >
                            Arena{renderSortIndicator('arena')}
                        </button>
                    ),
                },
                {
                    key: 'attacker',
                    label: (
                        <button
                            type="button"
                            className={styles['sort-header']}
                            onClick={() => handleSort('attacker')}
                            aria-sort={getAriaSort('attacker')}
                        >
                            Attacker{renderSortIndicator('attacker')}
                        </button>
                    ),
                },
                {
                    key: 'defender',
                    label: (
                        <button
                            type="button"
                            className={styles['sort-header']}
                            onClick={() => handleSort('defender')}
                            aria-sort={getAriaSort('defender')}
                        >
                            Defender{renderSortIndicator('defender')}
                        </button>
                    ),
                },
                {
                    key: 'created_at',
                    label: (
                        <button
                            type="button"
                            className={styles['sort-header']}
                            onClick={() => handleSort('created_at')}
                            aria-sort={getAriaSort('created_at')}
                        >
                            Created{renderSortIndicator('created_at')}
                        </button>
                    ),
                },
            ]}
            getRowKey={(sk) => sk.id}
            renderRow={(sk, expanded, toggleExpand) => {
                const left = warbands.find((w) => w.id === sk.left_warband_id);
                const right = warbands.find(
                    (w) => w.id === sk.right_warband_id
                );
                return (
                    <tr className={styles['skirmish-table__row']} key={sk.id}>
                        <td>
                            <button
                                className={styles['skirmish-table__expand-btn']}
                                aria-label={
                                    expanded
                                        ? 'Collapse details'
                                        : 'Expand details'
                                }
                                onClick={toggleExpand}
                                aria-expanded={expanded}
                                tabIndex={0}
                            >
                                {expanded ? '▾' : '▸'}
                            </button>
                        </td>
                        <td>{sk.arena_name || 'Unknown Arena'}</td>
                        <td>
                            {left?.name || sk.left_warband_id}
                            {sk.winner_id === sk.left_warband_id && trophy}
                            {sk.winner_id &&
                                sk.winner_id !== sk.left_warband_id &&
                                skull}
                        </td>
                        <td>
                            {right?.name || sk.right_warband_id}
                            {sk.winner_id === sk.right_warband_id && trophy}
                            {sk.winner_id &&
                                sk.winner_id !== sk.right_warband_id &&
                                skull}
                        </td>
                        <td>
                            {sk.created_at
                                ? new Date(sk.created_at).toLocaleString()
                                : 'Unknown'}
                        </td>
                    </tr>
                );
            }}
            renderExpanded={(sk) => {
                const left = warbands.find((w) => w.id === sk.left_warband_id);
                const right = warbands.find(
                    (w) => w.id === sk.right_warband_id
                );
                const winner = warbands.find((w) => w.id === sk.winner_id);
                return (
                    <>
                        <strong>Arena:</strong> {sk.arena_name || 'Unknown'}
                        <br />
                        <strong>Attacker:</strong>{' '}
                        {left?.name || sk.left_warband_id}
                        {sk.winner_id === sk.left_warband_id && trophy}
                        {sk.winner_id &&
                            sk.winner_id !== sk.left_warband_id &&
                            skull}
                        <br />
                        <strong>Defender:</strong>{' '}
                        {right?.name || sk.right_warband_id}
                        {sk.winner_id === sk.right_warband_id && trophy}
                        {sk.winner_id &&
                            sk.winner_id !== sk.right_warband_id &&
                            skull}
                        <br />
                        <strong>Winner:</strong> {winner?.name || sk.winner_id}
                        <br />
                        <strong>Created:</strong>{' '}
                        {sk.created_at
                            ? new Date(sk.created_at).toLocaleString()
                            : 'Unknown'}
                    </>
                );
            }}
        />
    );
};

export default CompletedSkirmishTable;
