import React from 'react';
import type { Skirmish } from '../../services/skirmishService';
import type { Warband } from '../../types/Warband';
import styles from './WarbandMatchHistoryTable.module.scss';

interface Props {
  warband: Warband;
  skirmishes: Skirmish[];
  warbands: Warband[];
}

export const WarbandMatchHistoryTable: React.FC<Props> = ({ warband, skirmishes, warbands }) => {
  // Only show matches where this warband participated
  const matches = skirmishes.filter(sk => sk.left_warband_id === warband.id || sk.right_warband_id === warband.id);

  return (
    <table className={styles['match-history-table']}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Arena</th>
          <th>Opponent</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {matches.length === 0 && (
          <tr><td colSpan={4}><em>No matches yet.</em></td></tr>
        )}
        {matches.map(sk => {
          const isLeft = sk.left_warband_id === warband.id;
          const opponent = warbands.find(w => w.id === (isLeft ? sk.right_warband_id : sk.left_warband_id));
          let result: 'win' | 'loss' | 'pending';
          if (!sk.winner_id) result = 'pending';
          else if (sk.winner_id === warband.id) result = 'win';
          else result = 'loss';
          return (
            <tr
              key={sk.id}
              className={
                result === 'win' ? styles['match-history-table__row--win'] :
                result === 'loss' ? styles['match-history-table__row--loss'] :
                styles['match-history-table__row--pending']
              }
            >
              <td>{sk.created_at ? new Date(sk.created_at).toLocaleDateString() : 'Unknown'}</td>
              <td>{sk.arena_name || 'Unknown'}</td>
              <td>{opponent?.name || opponent?.id || 'Unknown'}</td>
              <td style={{ textTransform: 'capitalize' }}>{result}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WarbandMatchHistoryTable;
