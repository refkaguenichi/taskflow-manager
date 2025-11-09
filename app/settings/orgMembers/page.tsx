'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import SettingsLayout from '@/components/layout/SeetingsLayout';

interface Member {
  id: string;
  user_id: string;
  role: string;
  email: string;
}

export default function OrgMembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch org and members
  useEffect(() => {
    if (!user) return;

    const fetchMembers = async () => {
      const { data: orgData } = await supabase
        .from('organization_users')
        .select('role, org_id, users(email)')
        .eq('user_id', user.id)
        .single();

      if (!orgData) return;

      setOrgId(orgData.org_id);
      setUserRole(orgData.role);

      const { data: membersData } = await supabase
        .from('organization_users')
        .select('id, user_id, role, users(email)')
        .eq('org_id', orgData.org_id);

      if (membersData) {
        setMembers(
          membersData.map((m: any) => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            email: m.users.email,
          }))
        );
      }
    };

    fetchMembers();
  }, [user]);

  // Add new member
  const handleAddMember = async () => {
    if (!orgId || !newEmail.trim() || userRole !== 'owner') return;

    setLoading(true);

    // Find user by email
    const { data: userData } = await supabase
      .from('users') // your auth.users table mapping
      .select('id')
      .eq('email', newEmail)
      .single();

    if (!userData) {
      alert('User not found.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('organization_users').insert({
      org_id: orgId,
      user_id: userData.id,
      role: 'member',
    });

    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setMembers([...members, { id: userData.id, user_id: userData.id, role: 'member', email: newEmail }]);
      setNewEmail('');
    }
  };

  // Update member role
  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (userRole !== 'owner') return;
    const { error } = await supabase
      .from('organization_users')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) alert('Error: ' + error.message);
    else
      setMembers(
        members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
  };

  // Remove member
  const handleRemove = async (memberId: string) => {
    if (userRole !== 'owner') return;
    const { error } = await supabase
      .from('organization_users')
      .delete()
      .eq('id', memberId);

    if (error) alert('Error: ' + error.message);
    else setMembers(members.filter((m) => m.id !== memberId));
  };

  return (
    <AppLayout>
      <SettingsLayout>
        <h1 className="text-xl font-bold mb-4">Organization Members</h1>

        {userRole === 'owner' && (
          <div className="flex gap-2 mb-6">
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Invite by email"
            />
            <Button onClick={handleAddMember} disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        )}

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Role</th>
              {userRole === 'owner' && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="border p-2">{m.email}</td>
                <td className="border p-2">
                  {userRole === 'owner' ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  ) : (
                    m.role
                  )}
                </td>
                {userRole === 'owner' && (
                  <td className="border p-2">
                    {m.role !== 'owner' && (
                      <Button
                        variant="destructive"
                        onClick={() => handleRemove(m.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsLayout>
    </AppLayout>
  );
}
