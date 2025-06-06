




import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserCampaigns } from '../hooks/useUserCampaigns';
import { useLink } from 'react-aria';
import { Link } from 'react-router-dom';
import styles from './Profile.module.scss';
import { useWarbands } from '../hooks/useWarbands';


export default function Profile() {
  const { user, signOut, updateDisplayName } = useAuth();
  const { campaigns, loading } = useUserCampaigns();
  const { warbands } = useWarbands();
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink({ elementType: 'a' }, ref);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateDisplayName(displayName);
      setEditing(false);
    } catch {
      setError('Failed to update display name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Display Name:</strong>{' '}
        {editing ? (
          <>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={saving}
              style={{ marginRight: 8 }}
            />
            <button onClick={handleSave} disabled={saving || !displayName.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} disabled={saving} style={{ marginLeft: 4 }}>
              Cancel
            </button>
            {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
          </>
        ) : (
          <>
            {user?.user_metadata?.display_name || <em>No display name set</em>}
            <button onClick={() => setEditing(true)} style={{ marginLeft: 8 }}>
              Edit
            </button>
          </>
        )}
      </div>
      <p>Email: {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
      <h3>My Campaigns</h3>
      {loading ? (
        <div>Loading campaigns...</div>
      ) : (
        <ul>
          {campaigns.length === 0 && <li>No campaigns joined yet.</li>}
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                to={`/campaigns/${campaign.id}`}
                {...linkProps}
                ref={ref}
                className={styles.link}
              >
                {campaign.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h3>My Warbands</h3>
      <ul>
        {warbands.filter(w => w.owner_id === user?.id).length === 0 && <li>No warbands created yet.</li>}
        {warbands.filter(w => w.owner_id === user?.id).map(warband => (
          <li key={warband.id}>
            <Link to={`/warbands/${warband.id}`} className={styles.link} aria-label={`View details for warband ${warband.name}`}>
              {warband.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}