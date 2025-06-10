import { useParams } from 'react-router-dom';
import { OverlayProvider } from 'react-aria';
import { useWarbands, useUpdateWarband } from '../hooks/useWarbands';
import { useSkirmishes } from '../hooks/useSkirmishes';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect, useMemo } from 'react';
import Input from '../components/Shared/Input';
import Select from '../components/Shared/Select';
import Button from '../components/Shared/Button';
import { useFactions, useSubfactions } from '../hooks/useFactions';
import { WarbandMatchHistoryTable } from '../components/SkirmishTable/WarbandMatchHistoryTable';
import { useQuery } from '@tanstack/react-query';
import { skirmishReportService } from '../services/skirmishReportService';
import styles from './Warbands.module.scss';

export default function WarbandPage() {
    const { id } = useParams<{ id: string }>();
    const { warbands } = useWarbands();
    const updateWarband = useUpdateWarband();
    const { user } = useAuth();
    const warband = warbands.find((w) => String(w.id) === String(id));
    const { data: skirmishes = [] } = useSkirmishes(warband?.campaign_id || '');
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [factionId, setFactionId] = useState<string | null | undefined>(
        warband?.faction_id ?? null
    );
    const [subfactionId, setSubfactionId] = useState<string | null | undefined>(
        warband?.subfaction_id ?? null
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [subtitle, setSubtitle] = useState(warband?.warband_subtitle || '');
    const [description, setDescription] = useState(warband?.warband_description || '');

    const { data: factions = [] } = useFactions();
    const { data: subfactions = [] } = useSubfactions(factionId || undefined);

    useEffect(() => {
        setName(warband?.name || '');
        setFactionId(warband?.faction_id ?? null);
        setSubfactionId(warband?.subfaction_id ?? null);
        setSubtitle(warband?.warband_subtitle || '');
        setDescription(warband?.warband_description || '');
    }, [warband]);

    const { data: skirmishReports = [] } = useQuery({
        queryKey: ['skirmishReports', warband?.id ?? ''],
        queryFn: () => skirmishReportService.getAllByWarband(warband?.id ?? ''),
        enabled: !!warband,
    });

    const skirmishReportMap = useMemo(() => {
        const map: Record<string, typeof skirmishReports[0]> = {};
        for (const report of skirmishReports) {
            map[report.skirmish_id] = report;
        }
        return map;
    }, [skirmishReports]);

    const isOwner = user && warband && warband.owner_id === user.id;

    if (!warband) return <div>Warband not found.</div>;

    const allMatches = skirmishes.filter(
        (sk) =>
            sk.attacker_warband_id === warband.id ||
            sk.defender_warband_id === warband.id
    );
    const completedMatches = allMatches.filter((sk) => sk.winner_id);
    const pendingMatches = allMatches.filter((sk) => !sk.winner_id);
    const wins = completedMatches.filter(
        (sk) => sk.winner_id === warband.id
    ).length;
    const losses = completedMatches.filter(
        (sk) => sk.winner_id && sk.winner_id !== warband.id
    ).length;

    async function handleSave() {
        if (!warband) return;
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            await updateWarband.mutateAsync({
                id: warband.id,
                updates: {
                    name,
                    faction_id: factionId || null,
                    subfaction_id: subfactionId || null,
                    warband_subtitle: subtitle,
                    warband_description: description,
                },
            });
            setEditing(false);
            setSuccess(true);
        } catch {
            setError('Failed to update warband');
        } finally {
            setSaving(false);
        }
    }

    return (
        <OverlayProvider>
            <div className={styles.warbands}>
            <h2>Warband Details</h2>
            {editing ? (
                <>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={saving}
                        label="Warband Name"
                    />
                    <Input
                        value={subtitle}
                        onChange={(e) => {
                            if (e.target.value.length <= 50) setSubtitle(e.target.value);
                        }}
                        disabled={saving}
                        label="Subtitle (max 50 chars)"
                        maxLength={50}
                    />
                    <div style={{ margin: '1em 0' }}>
                        <Select
                            label="Faction"
                            value={factionId ?? ''}
                            onChange={(val) => {
                                setFactionId(val || null);
                                setSubfactionId(null);
                            }}
                            options={[
                                { value: '', label: 'None' },
                                ...factions.map((f) => ({
                                    value: f.id,
                                    label: f.name,
                                })),
                            ]}
                            disabled={saving}
                        />
                    </div>
                    <div style={{ margin: '1em 0' }}>
                        <Select
                            label="Subfaction"
                            value={subfactionId ?? ''}
                            onChange={(val) => setSubfactionId(val || null)}
                            options={[
                                { value: '', label: 'None' },
                                ...subfactions.map((sf) => ({
                                    value: sf.id,
                                    label: sf.name,
                                })),
                            ]}
                            disabled={saving || !factionId}
                        />
                    </div>
                    <div style={{ margin: '1em 0' }}>
                        <label htmlFor="warband-description" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
                            Description
                        </label>
                        <textarea
                            id="warband-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            style={{ width: '100%', fontFamily: 'inherit', fontSize: '1em', borderRadius: 6, border: '1px solid #ccc', padding: 8, resize: 'vertical' }}
                            disabled={saving}
                            placeholder="Describe your warband. You can use line breaks for paragraphs."
                        />
                        <div style={{ fontSize: '0.95em', color: '#888', marginTop: 2 }}>
                            You can use line breaks to create paragraphs.
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving || !name.trim()}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={() => setEditing(false)}
                        disabled={saving}
                        type="button"
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    {error && (
                        <span style={{ color: 'red', marginLeft: 8 }}>
                            {error}
                        </span>
                    )}
                </>
            ) : (
                <>
                    <h3>{warband.name}</h3>
                    {(() => {
                        const faction = factions.find(
                            (f) => f.id === warband.faction_id
                        );
                        const logoSrc =
                            faction && faction.logo_filename
                                ? `/assets/faction/${faction.logo_filename}.webp`
                                : undefined;
                        return logoSrc ? (
                            <img
                                src={logoSrc}
                                alt={faction ? `${faction.name} logo` : 'Faction logo'}
                                className={styles['faction-logo']}
                                style={{
                                    maxWidth: 128,
                                    maxHeight: 128,
                                    marginBottom: 8,
                                }}
                            />
                        ) : null;
                    })()}
                    <div>
                        <strong>Faction:</strong>{' '}
                        {(() => {
                            const faction = factions.find(
                                (f) => f.id === warband.faction_id
                            );
                            return faction ? faction.name : <em>None</em>;
                        })()}
                        <br />
                        <strong>Subfaction:</strong>{' '}
                        {(() => {
                            const subfaction = subfactions.find(
                                (sf) => sf.id === warband.subfaction_id
                            );
                            return subfaction ? subfaction.name : <em>None</em>;
                        })()}
                    </div>
                    {isOwner && (
                        <Button
                            onClick={() => {
                                setEditing(true);
                                setSuccess(false);
                                setName(warband.name);
                                setFactionId(warband.faction_id ?? null);
                                setSubfactionId(warband.subfaction_id ?? null);
                            }}
                        >
                            Edit
                        </Button>
                    )}
                    {success && (
                        <span style={{ color: 'green', marginLeft: 8 }}>
                            Warband updated!
                        </span>
                    )}
                <div style={{ margin: '1em 0' }}>
                    {warband.warband_subtitle && (
                        <div style={{ fontWeight: 500, fontSize: '1.1em', color: '#666', marginBottom: 4 }}>
                            {warband.warband_subtitle}
                        </div>
                    )}
                    {warband.warband_description && (
                        <div style={{ whiteSpace: 'pre-line', marginBottom: 8 }}>
                            {warband.warband_description}
                        </div>
                    )}
                </div>
                </>
            )}
            <div>
                <strong>Matches:</strong> {completedMatches.length}
                {pendingMatches.length > 0 && (
                    <span style={{ color: '#888' }}>
                        {' '}
                        ({pendingMatches.length} pending)
                    </span>
                )}
                <br />
                <strong>Wins:</strong> {wins}
                <br />
                <strong>Losses:</strong> {losses}
            </div>

            <h3>Match History</h3>
            <WarbandMatchHistoryTable
                warband={warband}
                skirmishes={skirmishes}
                warbands={warbands}
                skirmishReportMap={skirmishReportMap}
            />
        </div>
        </OverlayProvider>
    );
}
