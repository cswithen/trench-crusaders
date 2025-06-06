
import React, { useState } from 'react';
import { useFactions, useSubfactions } from '../../hooks/useFactions';
import { useWarbands } from '../../hooks/useWarbands.js';
import { useCampaigns } from '../../hooks/useCampaigns.js';
import { useAuth } from '../../hooks/useAuth';
import styles from './WarbandForm.module.scss';
import Button from '../Shared/Button';

export default function WarbandForm() {
  const [name, setName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const { createWarband } = useWarbands();
  const { campaigns } = useCampaigns();
  const { user } = useAuth();
  const { data: factions = [] } = useFactions();
  const [factionId, setFactionId] = useState<string | null>('');
  const { data: subfactions = [] } = useSubfactions(factionId || undefined);
  const [subfactionId, setSubfactionId] = useState<string | null>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId || !user) return;
    createWarband({
      name,
      campaign_id: campaignId,
      owner_id: user.id,
      faction_id: factionId || null,
      subfaction_id: subfactionId || null,
    });
    setName('');
    setCampaignId('');
    setFactionId('');
    setSubfactionId('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Warband Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <select
        value={campaignId}
        onChange={e => setCampaignId(e.target.value)}
        required
      >
        <option value="" disabled>Select Campaign</option>
        {campaigns.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        value={factionId ?? ''}
        onChange={e => {
          setFactionId(e.target.value || '');
          setSubfactionId(''); // Reset subfaction if faction changes
        }}
        aria-label="Select Faction"
      >
        <option value="">No Faction</option>
        {factions.map(f => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>
      <select
        value={subfactionId ?? ''}
        onChange={e => setSubfactionId(e.target.value || '')}
        aria-label="Select Subfaction"
        disabled={!factionId}
      >
        <option value="">No Subfaction</option>
        {subfactions.map(sf => (
          <option key={sf.id} value={sf.id}>{sf.name}</option>
        ))}
      </select>
      <Button type="submit">Create Warband</Button>
    </form>
  );
}
