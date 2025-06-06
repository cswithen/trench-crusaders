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

const PendingSkirmishTable: React.FC<Props> = ({
    skirmishes,
    warbands,
    onMarkWinner,
    onDelete,
    isMarkingWinner,
    isDeleting,
}) => {
    return (
        <SkirmishTableBase
            skirmishes={skirmishes}
            columns={[
                { key: 'arena', label: 'Arena' },
                { key: 'attacker', label: 'Attacker' },
                { key: 'defender', label: 'Defender' },
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
