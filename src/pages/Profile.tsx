




import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserCampaigns } from '../hooks/useUserCampaigns';
import Button from '../components/Shared/Button';
import Input from '../components/Shared/Input';
import Link from '../components/Shared/Link';
import styles from './Profile.module.scss';
import { useWarbands } from '../hooks/useWarbands';


export default function Profile() {
  const { user, signOut, updateDisplayName } = useAuth();
  const { campaigns, loading } = useUserCampaigns();
  const { warbands } = useWarbands();
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
            <Input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={saving}
              style={{ marginRight: 8 }}
              label="Display Name"
            />
            <Button onClick={handleSave} disabled={saving || !displayName.trim()} type="button">
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={() => setEditing(false)} disabled={saving} type="button" style={{ marginLeft: 4 }}>
              Cancel
            </Button>
            {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
          </>
        ) : (
          <>
            {user?.user_metadata?.display_name || <em>No display name set</em>}
            <Button onClick={() => setEditing(true)} style={{ marginLeft: 8 }} type="button">
              Edit
            </Button>
          </>
        )}
      </div>
      <p>Email: {user?.email}</p>
      <Button onClick={signOut} type="button">Sign Out</Button>
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