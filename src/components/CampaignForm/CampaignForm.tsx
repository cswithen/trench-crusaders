import { useState } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns.js';
import styles from './CampaignForm.module.scss';
import Button from '../Shared/Button';

export default function CampaignForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createCampaign } = useCampaigns();

  return (
    <form className={styles.form} onSubmit={e => { e.preventDefault(); createCampaign({ name, description }); setName(''); setDescription(''); }}>
      <input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <Button type="submit">Create Campaign</Button>
    </form>
  );
}
