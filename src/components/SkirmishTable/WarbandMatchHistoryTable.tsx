import React from 'react';
import type { Skirmish } from '../../services/skirmishService';
import type { Warband } from '../../types/Warband';
import styles from './WarbandMatchHistoryTable.module.scss';

interface Props {
    warband: Warband;
    skirmishes: Skirmish[];
    warbands: Warband[];
}

export const WarbandMatchHistoryTable: React.FC<Props> = ({
    warband,
    skirmishes,
    warbands,
}) => {
    const matches = skirmishes.filter(
        (sk) =>
            sk.attacker_warband_id === warband.id ||
            sk.defender_warband_id === warband.id
    );

    return (
        <table className={styles['match-history-table']}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Arena</th>
                    <th>Opponent</th>
                    <th>Role</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                {matches.length === 0 && (
                    <tr>
                        <td colSpan={5}>
                            <em>No matches yet.</em>
                        </td>
                    </tr>
                )}
                {matches.map((sk) => {
                    // Determine if this warband was the attacker or defender
                    const isAttacker = sk.attacker_warband_id === warband.id;
                    const opponent = warbands.find(
                        (w) =>
                            w.id ===
                            (isAttacker ? sk.defender_warband_id : sk.attacker_warband_id)
                    );
                    let result: 'win' | 'loss' | 'pending';
                    if (!sk.winner_id) result = 'pending';
                    else if (sk.winner_id === warband.id) result = 'win';
                    else result = 'loss';
                    const role = isAttacker ? 'Attacker' : 'Defender';
                    return (
                        <tr
                            key={sk.id}
                            className={
                                styles['match-history-table__row'] +
                                ' ' +
                                (result === 'win'
                                    ? styles['match-history-table__row--win']
                                    : result === 'loss'
                                      ? styles['match-history-table__row--loss']
                                      : styles[
                                            'match-history-table__row--pending'
                                        ])
                            }
                        >
                            <td>
                                {sk.created_at
                                    ? new Date(
                                          sk.created_at
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                            </td>
                            <td>{sk.arena_name || 'Unknown'}</td>
                            <td>
                                {opponent?.name || opponent?.id || 'Unknown'}
                            </td>
                            <td>{role}</td>
                            <td style={{ textTransform: 'capitalize' }}>
                                {result}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default WarbandMatchHistoryTable;
