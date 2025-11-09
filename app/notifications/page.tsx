'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) return null;

  const notifications = [
    'You were mentioned in Task 1',
    'Project A deadline approaching',
  ];

  return (
    <AppLayout>
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <Card key={i} className="p-4">{n}</Card>
        ))}
      </div>
    </AppLayout>
  );
}
