import React, { useState } from 'react';
import SkirmishReportModal from './SkirmishReportModal';
import Button from '../Shared/Button';
import type { SkirmishReport } from '../../services/skirmishReportService';

export interface SkirmishReportButtonProps {
  warbandId: string;
  skirmishId: string;
  ownerId: string;
  report?: SkirmishReport | undefined;
}

export function SkirmishReportButton({ warbandId, skirmishId, ownerId, report }: SkirmishReportButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant={report ? 'primary' : 'secondary'}
        style={{ marginLeft: 6, fontFamily: 'IBM Plex Mono, Courier, monospace', fontSize: '0.9em', padding: '0.1em 0.5em' }}
        aria-label={report ? 'View or edit skirmish report' : 'Create skirmish report'}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
