


import type { Warband } from '../../types/Warband.js';
import styles from './WarbandCard.module.scss';
import { useUser } from '../../hooks/useUsers.js';
import { useCampaign } from '../../hooks/useCampaign.js';
import { useFactions, useSubfactions } from '../../hooks/useFactions';
import type { Profile } from '../../services/userService';

export default function WarbandCard({ warband }: { warband: Warband }) {
  const { data: owner } = useUser(warband.owner_id);
  const { data: campaign } = useCampaign(warband.campaign_id);
  const { data: factions = [] } = useFactions();
  const { data: subfactions = [] } = useSubfactions();
  const faction = factions.find(f => f.id === warband.faction_id);
  const subfaction = subfactions.find(sf => sf.id === warband.subfaction_id);
  return (
    <div className={styles.card}>
      <h3>{warband.name}</h3>
      <p>Owner: {(owner as Profile)?.display_name || (owner as Profile)?.email || warband.owner_id}</p>
      <p>Campaign: {campaign?.name || warband.campaign_id}</p>
      <div className={styles['meta']}>
        <span className={styles['meta__faction']}>
          <strong>Faction:</strong> {faction ? faction.name : <em>None</em>}
        </span>
        {subfaction && (
          <div className={styles['meta__subfaction']}>
            <strong>Subfaction:</strong> {subfaction.name}
          </div>
        )}
      </div>
    </div>
  );
}
