import React from 'react';
import WarbandCard from '../components/WarbandCard/WarbandCard';
import WarbandForm from '../components/WarbandForm/WarbandForm';
import { useWarbands } from '../hooks/useWarbands.js';
import styles from './Warbands.module.scss';
import type { Warband } from '../types/Warband';
import Link from '../components/Shared/Link';
import Button from '../components/Shared/Button';

export default function Warbands() {
  const { warbands } = useWarbands();
  const [showForm, setShowForm] = React.useState(false);

  // Handler to close the form after creation
  const handleWarbandCreated = React.useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <div className={styles.warbands}>
      <h2>Warbands</h2>
      <div style={{ marginBottom: '1rem' }}>
        {!showForm && (
          <Button
            className={styles['rally-btn']}
            onClick={() => setShowForm(true)}
            aria-label="Show warband creation form"
          >
            Rally Warband +
          </Button>
        )}
        {showForm && (
          <div style={{ marginBottom: '1rem' }}>
            <WarbandForm onCreated={handleWarbandCreated} />
            <Button
              className={styles['rally-btn']}
              onClick={() => setShowForm(false)}
              aria-label="Hide warband creation form"
              style={{ marginTop: 8 }}
              variant="secondary"
              type="button"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
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
