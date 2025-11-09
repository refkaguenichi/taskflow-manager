'use client';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Please <a href="/login">login</a>.</div>;

  return (
    <AppLayout>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">Create Project +</Card>
        <Card className="p-4 text-center">Project A</Card>
        <Card className="p-4 text-center">Project B</Card>
      </div>
    </AppLayout>
  );
}
