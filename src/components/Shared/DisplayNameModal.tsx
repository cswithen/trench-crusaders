import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import styles from './Modal.module.scss';

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (displayName: string) => Promise<void>;
  initialValue?: string;
}

export default function DisplayNameModal({ isOpen, onClose, onSave, initialValue = '' }: DisplayNameModalProps) {
  const [displayName, setDisplayName] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure modal closes only after successful save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(displayName);
      // Only close if no error was thrown
      setTimeout(() => onClose(), 0);
    } catch {
      setError('Failed to update display name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.header}>Set Your Display Name</div>
        <Input
          label="Display Name"
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          disabled={saving}
          autoFocus
        />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div className={styles.actions}>
          <Button type="submit" disabled={saving || !displayName.trim()}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
