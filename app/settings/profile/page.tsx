'use client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SettingsLayout from '@/components/layout/SeetingsLayout';
import AppLayout from '@/components/layout/AppLayout';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    setLoading(false);
    if (error) alert('Error: ' + error.message);
    else alert('Profile updated successfully!');
  };

  return (
      <AppLayout>
     <SettingsLayout>
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Email</label>
          <Input value={user?.email ?? ''} disabled />
        </div>
        <div>
          <label className="block mb-1">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </SettingsLayout>
    </AppLayout>);
}
