'use client';
import { useState, useEffect } from 'react';
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
  created_at: string;
}

export default function ProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !projectId) return;

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) console.error(error);
      else setTasks(data as Task[]);
    };

    fetchTasks();
  }, [user, projectId]);

  const handleCreateTask = async () => {
    if (!user || !projectId || !newName.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: projectId,
        name: newName,
        description: newDesc || null,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) alert('Error creating task: ' + error.message);
    else {
      setTasks([data, ...tasks]);
      setNewName('');
      setNewDesc('');
    }
    setSaving(false);
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <h1 className="text-xl font-bold mb-4">Project {projectId}</h1>

      {/* Create Task */}
      <div className="space-y-2 mb-6 max-w-md">
        <Input
          placeholder="Task title"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Textarea
          placeholder="Task description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <Button onClick={handleCreateTask} disabled={saving}>
          {saving ? 'Creating...' : 'Create Task'}
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="p-4 cursor-pointer"
            onClick={() => router.push(`/tasks/${task.id}`)}
          >
            <h3 className="font-semibold">{task.name}</h3>
            {task.description && <p className="text-gray-600">{task.description}</p>}
            <p className="text-sm text-gray-400">
              Created at: {new Date(task.created_at).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
