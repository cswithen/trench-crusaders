import { useParams } from 'react-router-dom';
import { useWarbands, useUpdateWarband } from '../hooks/useWarbands';
import { useSkirmishes } from '../hooks/useSkirmishes';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import Input from '../components/Shared/Input';
import Select from '../components/Shared/Select';
import Button from '../components/Shared/Button';
import { useFactions, useSubfactions } from '../hooks/useFactions';
import WarbandMatchHistoryTable from '../components/SkirmishTable/WarbandMatchHistoryTable';
import styles from './Warbands.module.scss';
  
export default function WarbandPage() {
  const { id } = useParams<{ id: string }>();
  const { warbands } = useWarbands();
  const updateWarband = useUpdateWarband();
  const { user } = useAuth();
  const warband = warbands.find(w => String(w.id) === String(id));
  // Only fetch skirmishes after warband is loaded
  const { data: skirmishes = [] } = useSkirmishes(warband?.campaign_id || '');
  // Hooks must be called unconditionally
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [factionId, setFactionId] = useState<string | null | undefined>(warband?.faction_id ?? null);
  const [subfactionId, setSubfactionId] = useState<string | null | undefined>(warband?.subfaction_id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Factions and subfactions
  const { data: factions = [] } = useFactions();
  const { data: subfactions = [] } = useSubfactions(factionId || undefined);

  // Set name when warband loads or changes
  useEffect(() => {
    setName(warband?.name || '');
    setFactionId(warband?.faction_id ?? null);
    setSubfactionId(warband?.subfaction_id ?? null);
  }, [warband]);

  if (!warband) return <div>Warband not found.</div>;


  // Calculate stats (match CampaignDetails logic)
  const allMatches = skirmishes.filter(sk => sk.left_warband_id === warband.id || sk.right_warband_id === warband.id);
  const completedMatches = allMatches.filter(sk => sk.winner_id);
  const pendingMatches = allMatches.filter(sk => !sk.winner_id);
  const wins = completedMatches.filter(sk => sk.winner_id === warband.id).length;
  const losses = completedMatches.filter(sk => sk.winner_id && sk.winner_id !== warband.id).length;

  const isOwner = user?.id === warband.owner_id;

  async function handleSave() {
    if (!warband) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateWarband.mutateAsync({
        id: warband.id,
        updates: {
          name,
          faction_id: factionId || null,
          subfaction_id: subfactionId || null,
        },
      });
      setEditing(false);
      setSuccess(true);
    } catch {
      setError('Failed to update warband');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.warbands}>
      <h2>Warband Details</h2>
      {editing ? (
        <>
          <Input value={name} onChange={e => setName(e.target.value)} disabled={saving} label="Warband Name" />
          <div style={{ margin: '1em 0' }}>
            <Select
              label="Faction"
              value={factionId ?? ''}
              onChange={val => {
                setFactionId(val || null);
                setSubfactionId(null);
              }}
              options={[
                { value: '', label: 'None' },
                ...factions.map(f => ({ value: f.id, label: f.name }))
              ]}
              disabled={saving}
            />
          </div>
          <div style={{ margin: '1em 0' }}>
            <Select
              label="Subfaction"
              value={subfactionId ?? ''}
              onChange={val => setSubfactionId(val || null)}
              options={[
                { value: '', label: 'None' },
                ...subfactions.map(sf => ({ value: sf.id, label: sf.name }))
              ]}
              disabled={saving || !factionId}
            />
          </div>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>Save</Button>
          <Button onClick={() => setEditing(false)} disabled={saving} type="button" variant="secondary">Cancel</Button>
          {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
        </>
      ) : (
        <>
          <h3>{warband.name}</h3>
          <div>
            <strong>Faction:</strong> {factions.find(f => f.id === warband.faction_id)?.name || <em>None</em>}<br />
            <strong>Subfaction:</strong> {subfactions.find(sf => sf.id === warband.subfaction_id)?.name || <em>None</em>}
          </div>
          {isOwner && <Button onClick={() => {
            setEditing(true);
            setSuccess(false);
            setName(warband.name);
            setFactionId(warband.faction_id ?? null);
            setSubfactionId(warband.subfaction_id ?? null);
          }}>Edit</Button>}
          {success && <span style={{ color: 'green', marginLeft: 8 }}>Warband updated!</span>}
        </>
      )}
      <div>
        <strong>Matches:</strong> {completedMatches.length}
        {pendingMatches.length > 0 && (
          <span style={{ color: '#888' }}> ({pendingMatches.length} pending)</span>
        )}<br />
        <strong>Wins:</strong> {wins}<br />
        <strong>Losses:</strong> {losses}
      </div>

      <h3>Match History</h3>
      <WarbandMatchHistoryTable warband={warband} skirmishes={skirmishes} warbands={warbands} />
    </div>
  );
}
