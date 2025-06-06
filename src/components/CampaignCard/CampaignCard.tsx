import type { Campaign } from '../../types/Campaign.js';
import Button from '../Shared/Button';
import styles from './CampaignCard.module.scss';
import { useOaths } from '../../hooks/useOaths.js';
import Link from '../Shared/Link';

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { isPledged, pledge } = useOaths(campaign.id);
  return (
    <div className={styles.card}>
      <h3>
        <Link
          to={`/campaigns/${campaign.id}`}
          className={styles.link}
        >
          {campaign.name}
        </Link>
      </h3>
      <p>{campaign.description}</p>
      <Button onClick={() => pledge()} disabled={isPledged}>
        {isPledged ? 'Joined' : 'Join Campaign'}
      </Button>
    </div>
  );
}
