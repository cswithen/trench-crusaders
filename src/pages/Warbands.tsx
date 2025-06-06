

import WarbandCard from '../components/WarbandCard/WarbandCard';
import WarbandForm from '../components/WarbandForm/WarbandForm';
import { useWarbands } from '../hooks/useWarbands.js';
import styles from './Warbands.module.scss';
import type { Warband } from '../types/Warband';
import Link from '../components/Shared/Link';

export default function Warbands() {
  const { warbands } = useWarbands();

  return (
    <div className={styles.warbands}>
      <h2>Warbands</h2>
      <WarbandForm />
      <div className={styles.list}>
        {(warbands as Warband[]).map((w: Warband) => (
          <div key={w.id} className={styles['warband-entry']}>
            <Link
              to={`/warbands/${w.id}`}
              aria-label={`View details for warband ${w.name}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <WarbandCard warband={w} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
