import { useState } from 'react';
import SkirmishReportModal from './SkirmishReportModal';
import Button from '../Shared/Button';


interface SkirmishReportButtonProps {
  warbandId: string;
  skirmishId: string;
  ownerId: string;
}

export default function SkirmishReportButton({ warbandId, skirmishId, ownerId }: SkirmishReportButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        style={{ marginLeft: 6, fontFamily: 'IBM Plex Mono, Courier, monospace', fontSize: '0.9em', padding: '0.1em 0.5em' }}
        aria-label="View or edit skirmish report"
        onClick={e => {
          if (typeof e === 'object' && 'stopPropagation' in e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
          }
          setOpen(true);
        }}
      >
        📝
      </Button>
      <SkirmishReportModal
        open={open}
        onClose={() => setOpen(false)}
        warbandId={warbandId}
        skirmishId={skirmishId}
        ownerId={ownerId}
      />
    </>
  );
}
