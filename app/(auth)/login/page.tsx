'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
    else alert(error.message);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Sign in to TaskFlow</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
        <p className="text-xs mt-3 text-gray-500">
          Don’t have an account? <a href="/signup" className="text-blue-600 underline">Sign up</a>
        </p>
      </Card>
    </div>
  );
}
