
import React, { useState } from 'react';
import { useFactions, useSubfactions } from '../../hooks/useFactions';
import { useWarbands } from '../../hooks/useWarbands.js';
import { useCampaigns } from '../../hooks/useCampaigns.js';
import { useAuth } from '../../hooks/useAuth';
import styles from './WarbandForm.module.scss';

import Button from '../Shared/Button';
import Input from '../Shared/Input';
import Select from '../Shared/Select';

type WarbandFormProps = {
  onCreated?: () => void;
};

export default function WarbandForm({ onCreated }: WarbandFormProps) {
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
    if (onCreated) onCreated();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles['form-row']}>
        <Input
          type="text"
          placeholder="Warband Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          label="Warband Name"
        />
        <Select
          label="Campaign"
          value={campaignId}
          onChange={setCampaignId}
          options={[
            { value: '', label: 'Select Campaign', disabled: true },
            ...campaigns.map(c => ({ value: c.id, label: c.name }))
          ]}
          required
        />
      </div>
      <div className={styles['form-row']}>
        <Select
          label="Faction"
          value={factionId ?? ''}
          onChange={val => {
            setFactionId(val || '');
            setSubfactionId('');
          }}
          options={[
            { value: '', label: 'No Faction' },
            ...factions.map(f => ({ value: f.id, label: f.name }))
          ]}
          aria-label="Select Faction"
        />
        <Select
          label="Subfaction"
          value={subfactionId ?? ''}
          onChange={val => setSubfactionId(val || '')}
          options={[
            { value: '', label: 'No Subfaction' },
            ...subfactions.map(sf => ({ value: sf.id, label: sf.name }))
          ]}
          aria-label="Select Subfaction"
          disabled={!factionId}
        />
      </div>
      <div className={styles['form-actions']}>
        <Button type="submit" className={styles['submit-btn']}>
          Create Warband
        </Button>
      </div>
    </form>
  );
}
