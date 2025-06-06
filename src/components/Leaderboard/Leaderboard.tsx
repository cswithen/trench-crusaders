import styles from './Leaderboard.module.scss';
import type { Warband } from '../../types/Warband';
import { Link } from 'react-router-dom';
import { useFactions, useSubfactions } from '../../hooks/useFactions';

export type WarbandStats = {
  warband: Warband;
  matches: number;
  wins: number;
  losses: number;
  pending?: number;
};

// Battle thresholds and max field strength by battle number (1-indexed)
const battleData = [
  { battle: 1, threshold: 700, maxField: 10 },
  { battle: 2, threshold: 800, maxField: 11 },
  { battle: 3, threshold: 900, maxField: 12 },
  { battle: 4, threshold: 1000, maxField: 13 },
  { battle: 5, threshold: 1100, maxField: 14 },
  { battle: 6, threshold: 1200, maxField: 15 },
  { battle: 7, threshold: 1300, maxField: 16 },
  { battle: 8, threshold: 1400, maxField: 17 },
  { battle: 9, threshold: 1500, maxField: 18 },
  { battle: 10, threshold: 1600, maxField: 19 },
  { battle: 11, threshold: 1700, maxField: 20 },
  { battle: 12, threshold: 1800, maxField: 22 },
];


// Helper: get battle info for a warband based on their next match (matches + 1)
// Only use completed matches for threshold/maxField calculation
function getBattleInfoForWarband(completedMatches: number) {
  // Next match is completedMatches + 1, cap at 12
  const battleNum = Math.min(completedMatches + 1, 12);
  return battleData.find(b => b.battle === battleNum) ?? battleData[battleData.length - 1];
}

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
            <th>
              Threshold
              <span
                tabIndex={0}
                aria-label="Threshold and Max Field Strength values are based on completed matches only."
                title="Threshold and Max Field Strength values are based on completed matches only."
                style={{
                  display: 'inline-block',
                  marginLeft: 4,
                  color: '#888',
                  cursor: 'help',
                  fontSize: '1em',
                  verticalAlign: 'middle',
                  lineHeight: 1,
                  transition: 'opacity 0.1s',
                  outline: 'none'
                }}
                role="img"
                onMouseDown={e => e.preventDefault()}
              >
                ℹ️
              </span>
            </th>
            <th>
              Max Field Strength
              <span
                tabIndex={0}
                aria-label="Threshold and Max Field Strength values are based on completed matches only."
                title="Threshold and Max Field Strength values are based on completed matches only."
                style={{
                  display: 'inline-block',
                  marginLeft: 4,
                  color: '#888',
                  cursor: 'help',
                  fontSize: '1em',
                  verticalAlign: 'middle',
                  lineHeight: 1,
                  transition: 'opacity 0.1s',
                  outline: 'none'
                }}
                role="img"
                onMouseDown={e => e.preventDefault()}
              >
                ℹ️
              </span>
            </th>
            <th>Matches</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => {
            // s.matches is completed, s.pending is pending
            const battleInfo = getBattleInfoForWarband(s.matches);
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
                <td>{battleInfo.threshold}</td>
                <td>{battleInfo.maxField}</td>
                <td>{s.matches}{typeof s.pending === 'number' && s.pending > 0 ? ` (${s.pending})` : ''}</td>
                <td>{s.wins}</td>
                <td>{s.losses}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
