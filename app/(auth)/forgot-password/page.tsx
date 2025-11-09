'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return setMessage(error.message);
    setMessage('Check your email for reset instructions.');
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
