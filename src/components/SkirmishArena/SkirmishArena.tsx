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
            'Claim No Man’s Land',
            'Hunt for Heroes',
            'Hill 223',
            'Relic Hunt',
            'Supply Raid',
        ],
    },
    {
        label: 'Mid-Campaign (Battles 4-9)',
        options: [
            'Hunt for Heroes',
            'Armoured Train',
            'Storming the Shores',
            'Claim No Man’s Land',
            'Dragon Hunt',
        ],
    },
    {
        label: 'Endgame (Battles 9-11)',
        options: [
            'Trench Warfare',
            'Dragon Hunt',
            'From Below',
            'Fields of Glory',
            'Storming the Shores',
        ],
    },
    {
        label: 'Final Battle (Battle 12)',
        options: ['Great War'],
    },
];

// Accepts warbands with completedMatches property
type WarbandWithMatches = Warband & { completedMatches?: number };
export default function SkirmishArena({ warbands }: { warbands: WarbandWithMatches[] }) {
    const { id: campaignId } = useParams<{ id: string }>();
    const createSkirmish = useCreateSkirmish();
    const [left, setLeft] = useState<WarbandWithMatches | null>(null);
    const [right, setRight] = useState<WarbandWithMatches | null>(null);
    const [arenaName, setArenaName] = useState<string>('');
    const [showForm, setShowForm] = useState(false);

    function handleSelect(side: 'left' | 'right', id: string) {
        const warband = warbands.find((w) => String(w.id) === id) || null;
        if (side === 'left') {
            setLeft(warband);
            if (warband && right?.id === warband.id) setRight(null);
        } else {
            setRight(warband);
            if (warband && left?.id === warband.id) setLeft(null);
        }
    }

    function handleLockIn() {
        if (!campaignId || !left || !right || !arenaName) return;
        createSkirmish.mutate(
            {
                campaign_id: campaignId,
                left_warband_id: left.id,
                right_warband_id: right.id,
                winner_id: null,
                arena_name: arenaName,
            },
            {
                onSuccess: () => {
                    setLeft(null);
                    setRight(null);
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
                            value={left?.id ? String(left.id) : ''}
                            onChange={(val) => handleSelect('left', val)}
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
                        <div className={styles['threshold-fields']} style={{ width: '100%' }}>
                          <ThresholdAndMaxFieldStrength
                            completedMatches={left?.completedMatches ?? 0}
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
                                        value: '',
                                        label: 'Select arena...',
                                        disabled: true,
                                    },
                                    ...arenaOptions.flatMap((group) => [
                                        {
                                            value: '',
                                            label: `--- ${group.label} ---`,
                                            disabled: true,
                                        },
                                        ...group.options.map((opt) => ({
                                            value: opt,
                                            label: opt,
                                        })),
                                    ]),
                                ]}
                                required
                                aria-label="Select arena name"
                                // width handled by SCSS
                            />
                        </div>
                        <Button
                            className={styles.button}
                            onClick={handleLockIn}
                            disabled={
                                !left ||
                                !right ||
                                !arenaName ||
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
                            value={right?.id ? String(right.id) : ''}
                            onChange={(val) => handleSelect('right', val)}
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
                        <div className={styles['threshold-fields']} style={{ width: '100%' }}>
                          <ThresholdAndMaxFieldStrength
                            completedMatches={right?.completedMatches ?? 0}
                          />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
