

import type { Skirmish } from '../../services/skirmishService';
import type { Warband } from '../../types/Warband';
import styles from './SkirmishTableBase.module.scss';

interface Props {
  skirmishes: Skirmish[];
  warbands: Warband[];
}



import React from 'react';
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

const CompletedSkirmishTable: React.FC<Props> = ({ skirmishes, warbands }) => {
  return (
    <SkirmishTableBase
      skirmishes={skirmishes}
      columns={[
        { key: 'arena', label: 'Arena' },
        { key: 'attacker', label: 'Attacker' },
        { key: 'defender', label: 'Defender' },
      ]}
      getRowKey={sk => sk.id}
      renderRow={(sk, expanded, toggleExpand) => {
        const left = warbands.find(w => w.id === sk.left_warband_id);
        const right = warbands.find(w => w.id === sk.right_warband_id);
        return (
          <tr className={styles['skirmish-table__row']} key={sk.id}>
            <td>
              <button
                className={styles['skirmish-table__expand-btn']}
                aria-label={expanded ? 'Collapse details' : 'Expand details'}
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
              {sk.winner_id && sk.winner_id !== sk.left_warband_id && skull}
            </td>
            <td>
              {right?.name || sk.right_warband_id}
              {sk.winner_id === sk.right_warband_id && trophy}
              {sk.winner_id && sk.winner_id !== sk.right_warband_id && skull}
            </td>
          </tr>
        );
      }}
      renderExpanded={sk => {
        const left = warbands.find(w => w.id === sk.left_warband_id);
        const right = warbands.find(w => w.id === sk.right_warband_id);
        const winner = warbands.find(w => w.id === sk.winner_id);
        return (
          <>
            <strong>Arena:</strong> {sk.arena_name || 'Unknown'}<br />
            <strong>Attacker:</strong> {left?.name || sk.left_warband_id}
            {sk.winner_id === sk.left_warband_id && trophy}
            {sk.winner_id && sk.winner_id !== sk.left_warband_id && skull}<br />
            <strong>Defender:</strong> {right?.name || sk.right_warband_id}
            {sk.winner_id === sk.right_warband_id && trophy}
            {sk.winner_id && sk.winner_id !== sk.right_warband_id && skull}<br />
            <strong>Winner:</strong> {winner?.name || sk.winner_id}<br />
            <strong>Created:</strong> {sk.created_at ? new Date(sk.created_at).toLocaleString() : 'Unknown'}
          </>
        );
      }}
    />
  );
};

export default CompletedSkirmishTable;
