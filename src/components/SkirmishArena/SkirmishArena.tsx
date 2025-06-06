
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateSkirmish } from '../../hooks/useSkirmishes';
import styles from './SkirmishArena.module.scss';
import type { Warband } from '../../types/Warband';
import Button from '../Shared/Button';

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
    options: [
      'Great War',
    ],
  },
];



export default function SkirmishArena({ warbands, onSkirmishResult }: {
  warbands: Warband[];
  onSkirmishResult: (left: Warband | null, right: Warband | null, winner: 'left' | 'right', arenaName: string) => void;
}) {
  const { id: campaignId } = useParams<{ id: string }>();
  const createSkirmish = useCreateSkirmish();
  const [left, setLeft] = useState<Warband | null>(null);
  const [right, setRight] = useState<Warband | null>(null);
  const [arenaName, setArenaName] = useState<string>('');
  const [showForm, setShowForm] = useState(false);


  function handleWin(side: 'left' | 'right') {
    onSkirmishResult(left, right, side, arenaName);
    setLeft(null);
    setRight(null);
    setArenaName('');
  }

  function handleSelect(side: 'left' | 'right', id: string) {
    const warband = warbands.find(w => String(w.id) === id) || null;
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
    createSkirmish.mutate({
      campaign_id: campaignId,
      left_warband_id: left.id,
      right_warband_id: right.id,
      winner_id: null,
      arena_name: arenaName,
    }, {
      onSuccess: () => {
        setLeft(null);
        setRight(null);
        setArenaName('');
        setShowForm(false);
      }
    });
  }

  return (
    <div>
      {!showForm ? (
        <Button className={styles.button} onClick={() => setShowForm(true)} aria-label="Create Skirmish">Create Skirmish</Button>
      ) : (
        <div className={styles.arena}>
          <div className={styles.side}>
            <h4>Attacker</h4>
            <select
              value={left?.id || ''}
              onChange={e => handleSelect('left', e.target.value)}
              aria-label="Select attacker warband"
            >
              <option value="">Select warband...</option>
              {warbands.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <div style={{ marginTop: 8, fontWeight: 'bold', minHeight: 24 }}>
              {left ? left.name : <span style={{ color: '#888' }}>No warband selected</span>}
            </div>
            <Button onClick={() => setLeft(null)} aria-label="Remove attacker warband" disabled={!left}>✕</Button>
            <Button className={styles.button} onClick={() => handleWin('left')} disabled={!left || !right || !arenaName}>Win</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 220 }}>
            <div className={styles.vs}>VS</div>
            <div style={{ margin: '1rem 0', width: '100%' }}>
              <label htmlFor="arena-select" style={{ fontWeight: 500 }}>Arena Name:</label>
              <select
                id="arena-select"
                value={arenaName}
                onChange={e => setArenaName(e.target.value)}
                style={{ marginLeft: 8, width: '60%' }}
                aria-label="Select arena name"
              >
                <option value="">Select arena...</option>
                {arenaOptions.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <Button className={styles.button} onClick={handleLockIn} disabled={!left || !right || !arenaName || createSkirmish.status === 'pending'}>
              Lock In Battle
            </Button>
            <Button className={styles.button} onClick={() => setShowForm(false)} aria-label="Cancel Skirmish" style={{ marginTop: 8 }}>Cancel</Button>
          </div>

          <div className={styles.side}>
            <h4>Defender</h4>
            <select
              value={right?.id || ''}
              onChange={e => handleSelect('right', e.target.value)}
              aria-label="Select defender warband"
            >
              <option value="">Select warband...</option>
              {warbands.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <div style={{ marginTop: 8, fontWeight: 'bold', minHeight: 24 }}>
              {right ? right.name : <span style={{ color: '#888' }}>No warband selected</span>}
            </div>
            <Button onClick={() => setRight(null)} aria-label="Remove defender warband" disabled={!right}>✕</Button>
            <Button className={styles.button} onClick={() => handleWin('right')} disabled={!left || !right || !arenaName}>Win</Button>
          </div>
        </div>
      )}
    </div>
  );
}
