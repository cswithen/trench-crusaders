import React, { useEffect, useState } from 'react';
// Simple UUID v4 generator for client-side fallback
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
import Modal from '../../components/Shared/Modal';
import Button from '../../components/Shared/Button';
import styles from './SkirmishReportModal.module.scss';
import { skirmishReportService } from '../../services/skirmishReportService';
import type { SkirmishReport } from '../../services/skirmishReportService';

import { useAuth } from '../../hooks/useAuth';

interface SkirmishReportModalProps {
  open: boolean;
  onClose: () => void;
  warbandId: string;
  skirmishId: string;
  ownerId: string;
}

export default function SkirmishReportModal({ open, onClose, warbandId, skirmishId, ownerId }: SkirmishReportModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [report, setReport] = useState<SkirmishReport | null>(null);
  const [form, setForm] = useState<Omit<SkirmishReport, 'id' | 'warband_id' | 'skirmish_id'>>({
    title: '',
    content: '',
    commander_name: '',
    outcome: '',
    commendations: '',
    casualties: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      skirmishReportService.getByWarbandAndSkirmish(warbandId, skirmishId)
        .then((r) => {
          setReport(r);
          if (r) setForm({
            title: r.title || '',
            content: r.content || '',
            commander_name: r.commander_name || '',
            outcome: r.outcome || '',
            commendations: r.commendations || '',
            casualties: r.casualties || '',
          });
        })
        .finally(() => setLoading(false));
      setEditing(false);
      setError(null);
    }
  }, [open, warbandId, skirmishId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value ?? '' }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = await skirmishReportService.upsert({
        ...form,
        warband_id: warbandId,
        skirmish_id: skirmishId,
        id: report?.id ?? uuidv4(),
      });
      setReport(saved);
      setEditing(false);
    } catch {
      setError('Failed to save report.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>Skirmish Report</div>
        {loading ? (
          <div>Loading...</div>
        ) : report && !editing ? (
          <div>
            <div className={styles.typewriter}>
              {report.title && <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{report.title}</div>}
              {report.commander_name && <div>Commander: {report.commander_name}</div>}
              {report.outcome && <div>Outcome: {report.outcome}</div>}
              {report.commendations && <div>Commendations: {report.commendations}</div>}
              {report.casualties && <div>Casualties: {report.casualties}</div>}
              {report.content && <div style={{ marginTop: 12, whiteSpace: 'pre-line' }}>{report.content}</div>}
            </div>
            <div className={styles.actions}>
              {user?.id === ownerId && (
                <Button onClick={() => setEditing(true)} variant="secondary">Edit</Button>
              )}
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : user?.id === ownerId ? (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-title">Title</label>
              <input
                className={styles.input}
                id="report-title"
                name="title"
                value={form.title ?? ''}
                onChange={handleChange}
                maxLength={100}
                autoFocus
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-commander">Commander Name</label>
              <input
                className={styles.input}
                id="report-commander"
                name="commander_name"
                value={form.commander_name ?? ''}
                onChange={handleChange}
                maxLength={60}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-outcome">Outcome</label>
              <input
                className={styles.input}
                id="report-outcome"
                name="outcome"
                value={form.outcome ?? ''}
                onChange={handleChange}
                maxLength={60}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-commendations">Commendations</label>
              <input
                className={styles.input}
                id="report-commendations"
                name="commendations"
                value={form.commendations ?? ''}
                onChange={handleChange}
                maxLength={120}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-casualties">Casualties</label>
              <input
                className={styles.input}
                id="report-casualties"
                name="casualties"
                value={form.casualties ?? ''}
                onChange={handleChange}
                maxLength={120}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="report-content">Report Content</label>
              <textarea
                className={styles.textarea}
                id="report-content"
                name="content"
                value={form.content ?? ''}
                onChange={handleChange}
                rows={7}
                maxLength={4000}
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <div className={styles.actions}>
              <Button type="submit" disabled={loading}>Save</Button>
              <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            </div>
          </form>
        ) : (
          <div className={styles.typewriter}>
            <div style={{ color: '#888', marginBottom: 12 }}>You do not have permission to create or edit this report.</div>
            {report ? (
              <>
                {report.title && <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{report.title}</div>}
                {report.commander_name && <div>Commander: {report.commander_name}</div>}
                {report.outcome && <div>Outcome: {report.outcome}</div>}
                {report.commendations && <div>Commendations: {report.commendations}</div>}
                {report.casualties && <div>Casualties: {report.casualties}</div>}
                {report.content && <div style={{ marginTop: 12, whiteSpace: 'pre-line' }}>{report.content}</div>}
              </>
            ) : (
              <div>No report available.</div>
            )}
            <div className={styles.actions}>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
