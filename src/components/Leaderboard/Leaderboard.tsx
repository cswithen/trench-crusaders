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

export default function Leaderboard({ stats }: { stats: WarbandStats[] }) {
  const { data: factions = [] } = useFactions();
  const { data: allSubfactions = [] } = useSubfactions();
  return (
    <div className={styles.leaderboard}>
      <h3>Leaderboard</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Warband</th>
            <th>Faction / Subfaction</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Matches</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => {
            const faction = factions.find(f => f.id === s.warband.faction_id);
            const subfaction = allSubfactions.find(sf => sf.id === s.warband.subfaction_id);
            return (
              <tr key={s.warband.id}>
                <td>
                  <Link to={`/warbands/${s.warband.id}`} className={styles.link} aria-label={`View details for warband ${s.warband.name}`}>
                    {s.warband.name}
                  </Link>
                </td>
                <td>
                  <div>
                    {faction ? faction.name : <em>None</em>}
                  </div>
                  {subfaction && (
                    <div style={{ fontSize: '0.95em', color: '#888' }}>({subfaction.name})</div>
                  )}
                </td>
                <td>{s.wins}</td>
                <td>{s.losses}</td>
                <td>{s.matches}{typeof s.pending === 'number' && s.pending > 0 ? ` (${s.pending})` : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
