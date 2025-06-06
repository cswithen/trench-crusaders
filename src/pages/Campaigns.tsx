import CampaignCard from '../components/CampaignCard/CampaignCard';
import CampaignForm from '../components/CampaignForm/CampaignForm';
import { useCampaigns } from '../hooks/useCampaigns.js';
import styles from './Campaigns.module.scss';

import type { Campaign } from '../types/Campaign';

export default function Campaigns() {
  const { campaigns } = useCampaigns();
  return (
    <div className={styles.campaigns}>
      <h2>Campaigns</h2>
      <CampaignForm />
      <div className={styles.list}>
        {(campaigns as Campaign[]).map((c: Campaign) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}
