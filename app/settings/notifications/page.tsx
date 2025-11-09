'use client';
import { useAuth } from '@/context/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CheckedState } from '@radix-ui/react-checkbox';
import SettingsLayout from '@/components/layout/SeetingsLayout';
import AppLayout from '@/components/layout/AppLayout';

export default function NotificationsSettingsPage() {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState<CheckedState>(true);
  const [pushNotifs, setPushNotifs] = useState<CheckedState>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata) {
      setEmailNotifs(user.user_metadata.email_notifications ?? true);
      setPushNotifs(user.user_metadata.push_notifications ?? false);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        email_notifications: emailNotifs === true,
        push_notifications: pushNotifs === true,
      },
    });
    setLoading(false);
    if (error) alert('Error: ' + error.message);
    else alert('Notifications updated!');
  };

  return (
      <AppLayout>
    <SettingsLayout>
      <h1 className="text-xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4 max-w-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={emailNotifs}
            onCheckedChange={(checked) => setEmailNotifs(checked === true)}
          />
          <span>Email notifications</span>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={pushNotifs}
            onCheckedChange={(checked) => setPushNotifs(checked === true)}
          />
          <span>Push notifications</span>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </SettingsLayout>
  
      </AppLayout>);
}
