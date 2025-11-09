'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import SettingsLayout from '@/components/layout/SeetingsLayout';

interface Org {
  id: string;
  name: string;
}

export default function OrgSettingsPage() {
  const { user } = useAuth();
  const [org, setOrg] = useState<Org | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrCreateOrg = async () => {
      // Fetch the user's org + role
      const { data, error } = await supabase
        .from('organization_users')
        .select('role, organizations(id, name)')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Fetch org error:', error.message);
        return;
      }

      if (data) {
        // organizations comes as an array from Supabase
        const orgData = Array.isArray(data.organizations)
          ? data.organizations[0]
          : data.organizations;

        if (orgData) {
          setOrg({ id: orgData.id, name: orgData.name });
          setOrgName(orgData.name);
          setRole(data.role);
        }
      } else {
        // No org → create a default org and make current user owner
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert({ name: 'My Organization' })
          .select()
          .single();

        if (createOrgError) {
          console.error('Create org error:', createOrgError.message);
          return;
        }

        // Add current user as owner
        await supabase.from('organization_users').insert({
          org_id: newOrg.id,
          user_id: user.id,
          role: 'owner',
        });

        setOrg({ id: newOrg.id, name: newOrg.name });
        setOrgName(newOrg.name);
        setRole('owner');
      }
    };

    fetchOrCreateOrg();
  }, [user]);

  const handleSave = async () => {
    if (!user || !org || role !== 'owner') return;

    if (!orgName.trim()) {
      alert('Organization name cannot be empty.');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('organizations')
      .update({ name: orgName })
      .eq('id', org.id);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } else {
      alert('Organization updated!');
      setOrg({ ...org, name: orgName });
    }
  };

  return (
    <AppLayout>
      <SettingsLayout>
        <h1 className="text-xl font-bold mb-6">Organization</h1>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">Organization Name</label>
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organization name"
              disabled={role !== 'owner'}
            />
          </div>
          {role === 'owner' ? (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          ) : (
            <p className="text-gray-500">Only the owner can update the organization.</p>
          )}
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
