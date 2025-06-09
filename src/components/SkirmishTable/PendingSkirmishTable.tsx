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
    attacker_warband_id: string;
    defender_warband_id: string;
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
                    const attackerA =
                        warbands.find((w) => w.id === a.attacker_warband_id)
                            ?.name || '';
                    const attackerB =
                        warbands.find((w) => w.id === b.attacker_warband_id)
                            ?.name || '';
                    aValue = attackerA.toLowerCase();
                    bValue = attackerB.toLowerCase();
                    break;
                }
                case 'defender': {
                    const defenderA =
                        warbands.find((w) => w.id === a.defender_warband_id)
                            ?.name || '';
                    const defenderB =
                        warbands.find((w) => w.id === b.defender_warband_id)
                            ?.name || '';
                    aValue = defenderA.toLowerCase();
                    bValue = defenderB.toLowerCase();
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
                const attacker = warbands.find((w) => w.id === sk.attacker_warband_id);
                const defender = warbands.find(
                    (w) => w.id === sk.defender_warband_id
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
                        <td>{attacker?.name || sk.attacker_warband_id}</td>
                        <td>{defender?.name || sk.defender_warband_id}</td>
                        <td>
                            {sk.created_at
                                ? new Date(sk.created_at).toLocaleString()
                                : 'Unknown'}
                        </td>
                    </tr>
                );
            }}
            renderExpanded={(sk) => {
                const attacker = warbands.find((w) => w.id === sk.attacker_warband_id);
                const defender = warbands.find(
                    (w) => w.id === sk.defender_warband_id
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
                                        attacker?.completedMatches ?? 0
                                    }
                                />
                                <Button
                                    variant="primary"
                                    className={
                                        styles[
                                            'skirmish-list__button--winner'
                                        ]
                                    }
                                    aria-label={`Mark ${attacker?.name || 'Attacker'} as winner`}
                                    onClick={() =>
                                        onMarkWinner(
                                            sk.id,
                                            sk.attacker_warband_id
                                        )
                                    }
                                    disabled={isMarkingWinner}
                                >
                                    {attacker?.name || 'Attacker'} Won
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
                                        defender?.completedMatches ?? 0
                                    }
                                />
                                <Button
                                    variant="primary"
                                    className={
                                        styles[
                                            'skirmish-list__button--defender'
                                        ]
                                    }
                                    aria-label={`Mark ${defender?.name || 'Defender'} as winner`}
                                    onClick={() =>
                                        onMarkWinner(
                                            sk.id,
                                            sk.defender_warband_id
                                        )
                                    }
                                    disabled={isMarkingWinner}
                                >
                                    {defender?.name || 'Defender'} Won
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
