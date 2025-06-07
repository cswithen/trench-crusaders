import React from 'react';
import CampaignCard from '../components/CampaignCard/CampaignCard';
import CampaignForm from '../components/CampaignForm/CampaignForm';
import { useCampaigns } from '../hooks/useCampaigns.js';
import { useUserCampaigns } from '../hooks/useUserCampaigns';
import styles from './Campaigns.module.scss';
import type { Campaign } from '../types/Campaign';
import Button from '../components/Shared/Button';

export default function Campaigns() {
    const { campaigns: allCampaigns } = useCampaigns();
    const { campaigns: userCampaigns } = useUserCampaigns();
    const [showForm, setShowForm] = React.useState(false);
    const handleCreated = React.useCallback(() => {
        setShowForm(false);
    }, []);

    // Campaigns user is in
    const myCampaignIds = new Set(userCampaigns.map((c) => c.id));
    const myCampaigns = allCampaigns.filter((c) => myCampaignIds.has(c.id));
    // Campaigns user is NOT in
    const availableCampaigns = allCampaigns.filter(
        (c) => !myCampaignIds.has(c.id)
    );

    return (
        <div className={styles.campaigns}>
            <h2>Campaigns</h2>
            <section style={{ marginBottom: '2rem' }}>
                <h3>My Campaigns</h3>
                <div className={styles.list}>
                    {myCampaigns.length === 0 ? (
                        <p>No campaigns joined yet.</p>
                    ) : (
                        myCampaigns.map((c: Campaign) => (
                            <CampaignCard key={c.id} campaign={c} />
                        ))
                    )}
                </div>
            </section>
            <section>
                <h3>Available Campaigns</h3>
                <div style={{ marginBottom: '1rem' }}>
                    {!showForm && (
                        <Button
                            className={styles['rally-btn']}
                            onClick={() => setShowForm(true)}
                            aria-label="Show campaign creation form"
                            type="button"
                        >
                            Create Campaign +
                        </Button>
                    )}
                    {showForm && (
                        <div style={{ marginBottom: '1rem' }}>
                            <CampaignForm onCreated={handleCreated} />
                            <Button
                                className={styles['rally-btn']}
                                onClick={() => setShowForm(false)}
                                aria-label="Hide campaign creation form"
                                style={{ marginTop: 8 }}
                                type="button"
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
                <div className={styles.list}>
                    {availableCampaigns.length === 0 ? (
                        <p>No campaigns available to join.</p>
                    ) : (
                        availableCampaigns.map((c: Campaign) => (
                            <CampaignCard key={c.id} campaign={c} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
