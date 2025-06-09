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
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
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
            warband_subtitle: subtitle,
            warband_description: description,
        });
        setName('');
        setSubtitle('');
        setDescription('');
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
                    onChange={(e) => setName(e.target.value)}
                    required
                    label="Warband Name"
                />
                <Input
                    type="text"
                    placeholder="Subtitle (max 50 chars)"
                    value={subtitle}
                    onChange={(e) => {
                        if (e.target.value.length <= 50) setSubtitle(e.target.value);
                    }}
                    maxLength={50}
                    label="Subtitle (max 50 chars)"
                />
                <Select
                    label="Campaign"
                    value={campaignId}
                    onChange={setCampaignId}
                    options={[
                        { value: '', label: 'Select Campaign', disabled: true },
                        ...campaigns.map((c) => ({
                            value: c.id,
                            label: c.name,
                        })),
                    ]}
                    required
                />
            </div>
            <div className={styles['form-row']}>
                <Select
                    label="Faction"
                    value={factionId ?? ''}
                    onChange={(val) => {
                        setFactionId(val || '');
                        setSubfactionId('');
                    }}
                    options={[
                        { value: '', label: 'No Faction' },
                        ...factions.map((f) => ({
                            value: f.id,
                            label: f.name,
                        })),
                    ]}
                    aria-label="Select Faction"
                />
                <Select
                    label="Subfaction"
                    value={subfactionId ?? ''}
                    onChange={(val) => setSubfactionId(val || '')}
                    options={[
                        { value: '', label: 'No Subfaction' },
                        ...subfactions.map((sf) => ({
                            value: sf.id,
                            label: sf.name,
                        })),
                    ]}
                    aria-label="Select Subfaction"
                    disabled={!factionId}
                />
            </div>
            <div className={styles['form-row']}>
                <label htmlFor="warband-description" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Description
                </label>
                <textarea
                    id="warband-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    style={{ width: '100%', fontFamily: 'inherit', fontSize: '1em', borderRadius: 6, border: '1px solid #ccc', padding: 8, resize: 'vertical' }}
                    placeholder="Describe your warband. You can use line breaks for paragraphs."
                />
                <div style={{ fontSize: '0.95em', color: '#888', marginTop: 2 }}>
                    You can use line breaks to create paragraphs.
                </div>
            </div>
            <div className={styles['form-actions']}>
                <Button type="submit" className={styles['submit-btn']}>
                    Create Warband
                </Button>
            </div>
        </form>
    );
}
