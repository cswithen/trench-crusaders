import ThresholdAndMaxFieldStrength from './ThresholdAndMaxFieldStrength';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateSkirmish } from '../../hooks/useSkirmishes';
import styles from './SkirmishArena.module.scss';
import type { Warband } from '../../types/Warband';
import Button from '../Shared/Button';
import Select from '../Shared/Select';

const arenaOptions = [
    {
        label: 'Early Campaign (Battles 1-3)',
        options: [
            { value: 'Claim No Man’s Land', label: 'Claim No Man’s Land' },
            { value: 'Hunt for Heroes-early', label: 'Hunt for Heroes' },
            { value: 'Hill 223', label: 'Hill 223' },
            { value: 'Relic Hunt', label: 'Relic Hunt' },
            { value: 'Supply Raid', label: 'Supply Raid' },
            { value: 'Random Encounter', label: 'Random Encounter' },
        ],
    },
    {
        label: 'Mid-Campaign (Battles 4-9)',
        options: [
            { value: 'Hunt for Heroes-mid', label: 'Hunt for Heroes' },
            { value: 'Armoured Train', label: 'Armoured Train' },
            { value: 'Storming the Shores-mid', label: 'Storming the Shores' },
            { value: 'Claim No Man’s Land-mid', label: 'Claim No Man’s Land' },
            { value: 'Dragon Hunt-mid', label: 'Dragon Hunt' },
            { value: 'Random Encounter', label: 'Random Encounter' },
        ],
    },
    {
        label: 'Endgame (Battles 9-11)',
        options: [
            { value: 'Trench Warfare', label: 'Trench Warfare' },
            { value: 'Dragon Hunt-end', label: 'Dragon Hunt' },
            { value: 'From Below', label: 'From Below' },
            { value: 'Fields of Glory', label: 'Fields of Glory' },
            { value: 'Storming the Shores-end', label: 'Storming the Shores' },
            { value: 'Random Encounter', label: 'Random Encounter' },
        ],
    },
    {
        label: 'Final Battle (Battle 12)',
        options: [{ value: 'Great War', label: 'Great War' }],
    },
];

type WarbandWithMatches = Warband & { completedMatches?: number };
export default function SkirmishArena({
    warbands,
}: {
    warbands: WarbandWithMatches[];
}) {
    const { id: campaignId } = useParams<{ id: string }>();
    const createSkirmish = useCreateSkirmish();
    const [attacker, setAttacker] = useState<WarbandWithMatches | null>(null);
    const [defender, setDefender] = useState<WarbandWithMatches | null>(null);
    const [arenaName, setArenaName] = useState<string>('__select_arena__');
    const [showForm, setShowForm] = useState(false);

    function handleSelect(side: 'attacker' | 'defender', id: string) {
        const warband = warbands.find((w) => String(w.id) === id) || null;
        if (side === 'attacker') {
            setAttacker(warband);
            if (warband && defender?.id === warband.id) setDefender(null);
        } else {
            setDefender(warband);
            if (warband && attacker?.id === warband.id) setAttacker(null);
        }
    }

    function handleLockIn() {
        if (!campaignId || !attacker || !defender || !arenaName) return;
        let backendArenaName = arenaName;
        for (const group of arenaOptions) {
            const found = group.options.find((opt) => opt.value === arenaName);
            if (found) {
                backendArenaName = found.label;
                break;
            }
        }
        createSkirmish.mutate(
            {
                campaign_id: campaignId,
                attacker_warband_id: attacker.id,
                defender_warband_id: defender.id,
                winner_id: null,
                arena_name: backendArenaName,
            },
            {
                onSuccess: () => {
                    setAttacker(null);
                    setDefender(null);
                    setArenaName('');
                    setShowForm(false);
                },
            }
        );
    }

    return (
        <div>
            {!showForm ? (
                <Button
                    className={styles.button}
                    onClick={() => setShowForm(true)}
                    aria-label="Create Skirmish"
                >
                    Create Skirmish
                </Button>
            ) : (
                <div className={styles.arena}>
                    <div className={styles.side}>
                        <h4>Attacker</h4>
                        <Select
                            label="Attacker Warband"
                            value={attacker?.id ? String(attacker.id) : ''}
                            onChange={(val) => handleSelect('attacker', val)}
                            options={[
                                {
                                    value: '',
                                    label: 'Select warband...',
                                    disabled: true,
                                },
                                ...warbands.map((w) => ({
                                    value: String(w.id),
                                    label: w.name,
                                })),
                            ]}
                            required
                            aria-label="Select attacker warband"
                        />
                        <div
                            className={styles['threshold-fields']}
                            style={{ width: '100%' }}
                        >
                            <ThresholdAndMaxFieldStrength
                                completedMatches={
                                    attacker?.completedMatches ?? undefined
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.centerColumn}>
                        <div className={styles.vs}>VS</div>
                        <div className={styles.arenaSelectWrapper}>
                            <Select
                                label="Arena Name"
                                value={arenaName}
                                onChange={setArenaName}
                                options={[
                                    {
                                        value: '__select_arena__',
                                        label: 'Select arena...',
                                        disabled: true,
                                    },
                                    ...arenaOptions.flatMap(
                                        (group, groupIdx) => [
                                            {
                                                value: `__group_${groupIdx}__`,
                                                label: `--- ${group.label} ---`,
                                                disabled: true,
                                            },
                                            ...group.options,
                                        ]
                                    ),
                                ]}
                                required
                                aria-label="Select arena name"
                            />
                        </div>
                        <Button
                            className={styles.button}
                            onClick={handleLockIn}
                            disabled={
                                !attacker ||
                                !defender ||
                                !arenaName ||
                                arenaName === '__select_arena__' ||
                                createSkirmish.status === 'pending'
                            }
                        >
                            Lock In Battle
                        </Button>
                        <Button
                            className={
                                styles.button + ' ' + styles.cancelButton
                            }
                            onClick={() => setShowForm(false)}
                            aria-label="Cancel Skirmish"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className={styles.side}>
                        <h4>Defender</h4>
                        <Select
                            label="Defender Warband"
                            value={defender?.id ? String(defender.id) : ''}
                            onChange={(val) => handleSelect('defender', val)}
                            options={[
                                {
                                    value: '',
                                    label: 'Select warband...',
                                    disabled: true,
                                },
                                ...warbands.map((w) => ({
                                    value: String(w.id),
                                    label: w.name,
                                })),
                            ]}
                            required
                            aria-label="Select defender warband"
                        />
                        <div
                            className={styles['threshold-fields']}
                            style={{ width: '100%' }}
                        >
                            <ThresholdAndMaxFieldStrength
                                completedMatches={
                                    defender?.completedMatches ?? undefined
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
