'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // <-- correct import for App Router

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter(); // now works
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`owner_id.eq.${user.id},project_members.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setProjects(data as Project[]);
    };

    fetchProjects();
  }, [user]);

  const handleCreateProject = async () => {
    if (!user || !newProjectName.trim()) return;
    setLoading(true);

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        name: newProjectName,
        description: newProjectDesc,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      // Add owner as member
      await supabase.from('project_members').insert({
        project_id: newProject.id,
        user_id: user.id,
        role: 'owner',
      });

      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setNewProjectDesc('');
    }
    setLoading(false);
  };

  if (!user) {
    return <div className="p-6">Please login to see your projects.</div>;
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-md space-y-4">
        <h1 className="text-xl font-bold">Projects</h1>
        <Input
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <Input
          placeholder="Project Description"
          value={newProjectDesc}
          onChange={(e) => setNewProjectDesc(e.target.value)}
        />
        <Button onClick={handleCreateProject} disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </Button>

        <div className="space-y-2 mt-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3 border rounded cursor-pointer"
              onClick={() => router.push(`/projects/${proj.id}`)} // navigate to project page
            >
              <h2 className="font-semibold">{proj.name}</h2>
              <p>{proj.description}</p>
              <p className="text-sm text-gray-500">
                Owner: {proj.owner_id === user.id ? 'You' : proj.owner_id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
