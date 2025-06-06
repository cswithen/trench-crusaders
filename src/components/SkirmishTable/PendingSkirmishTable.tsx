import React from 'react';
import ThresholdAndMaxFieldStrength from '../SkirmishArena/ThresholdAndMaxFieldStrength';
import baseStyles from './SkirmishTableBase.module.scss';
import styles from './PendingSkirmishTable.module.scss';
import type { Warband } from '../../types/Warband';
import { SkirmishTableBase } from './SkirmishTableBase';
import Button from '../Shared/Button';

export interface PendingSkirmish {
    id: string;
    arena_name?: string | null;
    left_warband_id: string;
    right_warband_id: string;
    created_at?: string;
}

interface Props {
    skirmishes: PendingSkirmish[];
    warbands: (Warband & { completedMatches?: number })[];
    onMarkWinner: (skirmishId: string, winnerId: string) => void;
    onDelete: (skirmishId: string) => void;
    isMarkingWinner: boolean;
    isDeleting: boolean;
}

type SortKey = 'created_at' | 'arena' | 'attacker' | 'defender';
type SortOrder = 'asc' | 'desc';

const PendingSkirmishTable: React.FC<Props> = ({
    skirmishes,
    warbands,
    onMarkWinner,
    onDelete,
    isMarkingWinner,
    isDeleting,
}) => {
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
                            className={baseStyles['sort-header']}
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
                            className={baseStyles['sort-header']}
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
                            className={baseStyles['sort-header']}
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
                            className={baseStyles['sort-header']}
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
                    <tr
                        className={baseStyles['skirmish-table__row']}
                        key={sk.id}
                    >
                        <td>
                            <button
                                className={
                                    baseStyles['skirmish-list__button'] +
                                    ' ' +
                                    baseStyles['skirmish-table__expand-btn']
                                }
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
                        <td>{left?.name || sk.left_warband_id}</td>
                        <td>{right?.name || sk.right_warband_id}</td>
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
                return (
                    <>
                        <div className={styles['pending-skirmish-expanded']}>
                            <div
                                className={
                                    styles['pending-skirmish-expanded__created']
                                }
                            >
                                <strong>Created:</strong>
                                <br />
                                {sk.created_at
                                    ? new Date(sk.created_at).toLocaleString()
                                    : 'Unknown'}
                            </div>
                            <div
                                className={
                                    styles['pending-skirmish-expanded__sides']
                                }
                            >
                                <div
                                    className={
                                        styles[
                                            'pending-skirmish-expanded__side'
                                        ]
                                    }
                                >
                                    <strong>Attacker</strong>
                                    <ThresholdAndMaxFieldStrength
                                        completedMatches={
                                            left?.completedMatches ?? 0
                                        }
                                    />
                                    <Button
                                        variant="primary"
                                        className={
                                            styles[
                                                'skirmish-list__button--winner'
                                            ]
                                        }
                                        aria-label={`Mark ${left?.name || 'Attacker'} as winner`}
                                        onClick={() =>
                                            onMarkWinner(
                                                sk.id,
                                                sk.left_warband_id
                                            )
                                        }
                                        disabled={isMarkingWinner}
                                    >
                                        {left?.name || 'Attacker'} Won
                                    </Button>
                                </div>
                                <div
                                    className={
                                        styles[
                                            'pending-skirmish-expanded__side'
                                        ]
                                    }
                                >
                                    <strong>Defender</strong>
                                    <ThresholdAndMaxFieldStrength
                                        completedMatches={
                                            right?.completedMatches ?? 0
                                        }
                                    />
                                    <Button
                                        variant="primary"
                                        className={
                                            styles[
                                                'skirmish-list__button--defender'
                                            ]
                                        }
                                        aria-label={`Mark ${right?.name || 'Defender'} as winner`}
                                        onClick={() =>
                                            onMarkWinner(
                                                sk.id,
                                                sk.right_warband_id
                                            )
                                        }
                                        disabled={isMarkingWinner}
                                    >
                                        {right?.name || 'Defender'} Won
                                    </Button>
                                </div>
                            </div>
                            <div
                                className={
                                    styles['pending-skirmish-expanded__actions']
                                }
                            >
                                <Button
                                    variant="secondary"
                                    className={
                                        styles['skirmish-list__button--delete']
                                    }
                                    aria-label="Delete skirmish"
                                    onClick={() => onDelete(sk.id)}
                                    disabled={isDeleting}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </>
                );
            }}
        />
    );
};

export default PendingSkirmishTable;
