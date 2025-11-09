'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

interface Task {
  id: string;
  name: string;
  description: string | null;
  project_id: string;
  owner_id: string;
  created_at: string;
}

export default function TaskPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  // Fetch task
  useEffect(() => {
    if (!user || !taskId) return;

    const fetchTask = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) console.error('Fetch task error:', error.message);
      else {
        setTask(data);
        setName(data.name);
        setDescription(data.description || '');
      }
    };

    fetchTask();
  }, [user, taskId]);

  const handleUpdate = async () => {
    if (!task) return;
    setSaving(true);

    const { error } = await supabase
      .from('tasks')
      .update({ name, description })
      .eq('id', task.id);

    setSaving(false);

    if (error) alert(error.message);
    else {
      alert('Task updated!');
      setTask({ ...task, name, description });
    }
  };

  const handleRefine = async () => {
  if (!description.trim()) return;

  const res = await fetch('/api/refine-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: description, type: 'task' }),
  });

  const data = await res.json();
  if (data.refinedText) setDescription(data.refinedText);
};


  if (loading || !user || !task) return null;

  return (
    <AppLayout>
      <h1 className="text-xl font-bold mb-4">Task {task.id}</h1>
      <Card className="p-4 space-y-2 max-w-md">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? 'Saving...' : 'Update Task'}
        </Button>
        <Button onClick={handleRefine}>Refine Description</Button>
      </Card>
    </AppLayout>
  );
}
