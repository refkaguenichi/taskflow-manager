'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UserWithMetadata } from '@/types/supabase';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserWithMetadata | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user as UserWithMetadata ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as UserWithMetadata ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  
  useEffect(() => {
    if (loading) return;

    // If on home page ('/'), redirect based on auth status
    if (pathname === '/') {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
      return;
    }

    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is logged in AND on a public route, redirect to dashboard
    if (user && isPublicRoute) {
      router.replace('/dashboard');
      return;
    }

    // If user is NOT logged in AND on a private route, redirect to login
    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);