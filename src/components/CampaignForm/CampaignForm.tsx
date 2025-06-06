import { useState } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns.js';
import styles from './CampaignForm.module.scss';
import Button from '../Shared/Button';
import Input from '../Shared/Input';

type CampaignFormProps = {
  onCreated?: () => void;
};

export default function CampaignForm({ onCreated }: CampaignFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createCampaign } = useCampaigns();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCampaign({ name, description });
    setName('');
    setDescription('');
    if (onCreated) onCreated();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        label="Campaign Name"
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        label="Description"
      />
      <Button type="submit">Create Campaign</Button>
    </form>
  );
}
