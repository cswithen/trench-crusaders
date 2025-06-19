import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUsers';
import DisplayNameModal from './DisplayNameModal';

export default function RequireProfileModal() {
  const { user, updateDisplayName } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUser(user?.id);
  const [show, setShow] = useState(false);
  const [initialValue, setInitialValue] = useState('');

  useEffect(() => {
    if (!profileLoading && !profile && user?.id) {
      setShow(true);
      setInitialValue(user.user_metadata?.display_name || '');
    }
  }, [profileLoading, profile, user]);

  const handleSave = async (name: string) => {
    try {
      await updateDisplayName(name);
      // Wait for the profile to appear in the DB before closing
      // Poll for up to 2 seconds
      let waited = 0;
      while (waited < 2000) {
        const newProfile = await import('../../services/userService').then(m => m.userService.getById(user!.id));
        if (newProfile) {
          setShow(false);
          break;
        }
        await new Promise(res => setTimeout(res, 200));
        waited += 200;
      }
    } catch (e) {
      // Do not close modal on error
      console.error('Failed to update display name:', e);
    }
  };

  // Also close modal if profile is created (reacts to DB update)
  useEffect(() => {
    if (!profileLoading && profile && show) {
      setShow(false);
    }
  }, [profileLoading, profile, show]);

  return (
    <DisplayNameModal
      isOpen={show}
      onClose={() => setShow(false)}
      onSave={handleSave}
      initialValue={initialValue}
    />
  );
}
