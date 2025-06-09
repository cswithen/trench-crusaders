import React from 'react';
import type { Warband } from '../../types/Warband.js';
import styles from './WarbandCard.module.scss';
import { useUser } from '../../hooks/useUsers.js';
import { useCampaign } from '../../hooks/useCampaign.js';
import { useFactions, useSubfactions } from '../../hooks/useFactions';
import type { Profile } from '../../services/userService';
import { useSkirmishes } from '../../hooks/useSkirmishes';

export default function WarbandCard({ warband }: { warband: Warband }) {
    const { data: owner } = useUser(warband.owner_id);
    const { data: campaign } = useCampaign(warband.campaign_id);
    const { data: factions = [] } = useFactions();
    const { data: subfactions = [] } = useSubfactions();
    const { data: skirmishes = [] } = useSkirmishes(warband.campaign_id);
    const faction = factions.find((f) => f.id === warband.faction_id);
    const subfaction = subfactions.find(
        (sf) => sf.id === warband.subfaction_id
    );

    const allMatches = skirmishes.filter(
        (sk) =>
            sk.attacker_warband_id === warband.id ||
            sk.defender_warband_id === warband.id
    );
    const completedMatches = allMatches.filter((sk) => sk.winner_id);
    const wins = completedMatches.filter(
        (sk) => sk.winner_id === warband.id
    ).length;
    const losses = completedMatches.filter(
        (sk) => sk.winner_id && sk.winner_id !== warband.id
    ).length;
    const pending = allMatches.filter((sk) => !sk.winner_id).length;

    const logoSrc =
        faction && faction.logo_filename
            ? `/assets/faction/${faction.logo_filename}.webp`
            : undefined;

    // Only one state declaration for description open/close
    const [descOpen, setDescOpen] = React.useState(false);

    return (
        <div className={styles.card}>
            {logoSrc && (
                <img
                    src={logoSrc}
                    alt={faction ? `${faction.name} logo` : 'Faction logo'}
                    className={styles['faction-logo']}
                />
            )}
            <h3 className={styles['warband-name']}>
                {warband.name}
            </h3>
            <p>
                <strong>Patron:</strong>{' '}
                {(owner as Profile)?.display_name ||
                    (owner as Profile)?.email ||
                    warband.owner_id}
            </p>
            <div className={styles['meta']}>
                <span className={styles['meta__faction']}>
                    <strong>Faction:</strong>{' '}
                    {faction ? faction.name : <em>None</em>}
                </span>
                {subfaction && (
                    <div className={styles['meta__subfaction']}>
                        <strong>Subfaction:</strong> {subfaction.name}
                    </div>
                )}
            </div>
            <p>
                <strong>Campaign:</strong> {campaign && campaign.name}
            </p>
            <div className={styles.stats}>
                <span className={styles['stats--wins']}>
                    <strong>Wins:</strong>&nbsp;{wins}
                </span>
                <span className={styles['stats--losses']}>
                    <strong>Losses:</strong>&nbsp;{losses}
                </span>
                <span className={styles['stats--pending']}>
                    <strong>Ongoing:</strong>&nbsp;{pending}
                </span>
            </div>
            {(warband.warband_subtitle || warband.warband_description) && (
                <>
                    {(warband.warband_description) && (
                        <button
                            type="button"
                            className={styles['expand-description-btn']}
                            aria-expanded={descOpen}
                            aria-controls={`desc-${warband.id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setDescOpen((o) => !o);
                            }}
                            tabIndex={0}
                            title={descOpen ? 'Hide Description' : 'Show Description'}
                        >
                            <span aria-hidden="true" className={styles['expand-icon']}>
                                {descOpen ? '▾' : '▸'}
                            </span>
                        </button>
                    )}
                    {descOpen && (
                        <div
                            id={`desc-${warband.id}`}
                            className={styles['warband-description']}
                            aria-live="polite"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {warband.warband_subtitle && (
                                <div className={styles['warband-subtitle']} style={{ marginBottom: warband.warband_description ? 8 : 0 }}>
                                    {warband.warband_subtitle}
                                </div>
                            )}
                            {warband.warband_description}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
