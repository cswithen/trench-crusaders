import type { Campaign } from '../../types/Campaign.js';
import Button from '../Shared/Button';
import styles from './CampaignCard.module.scss';
import { useOaths } from '../../hooks/useOaths.js';
import { useLink } from 'react-aria';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { isPledged, pledge } = useOaths(campaign.id);
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink({
    elementType: 'a',
  }, ref);
  return (
    <div className={styles.card}>
      <h3>
        <Link
          to={`/campaigns/${campaign.id}`}
          {...linkProps}
          ref={ref}
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
