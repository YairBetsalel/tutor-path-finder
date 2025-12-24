import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_color: string;
  avatar_letter: string;
}

interface Metrics {
  focus: number;
  skill: number;
  revision: number;
  attitude: number;
  potential: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  metrics: Metrics;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_METRICS: Metrics = {
  focus: 1,
  skill: 1,
  revision: 1,
  attitude: 1,
  potential: 1,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data && !error) {
      setProfile(data);
    }
  };

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data);
  };

  const fetchMetrics = async (userId: string) => {
    // Get last 10 lesson ratings for this student
    const { data } = await supabase
      .from('lesson_ratings')
      .select('focus, skill, revision, attitude, potential')
      .eq('student_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      // Calculate average of last 10 ratings
      const avgMetrics = {
        focus: Math.round(data.reduce((sum, r) => sum + r.focus, 0) / data.length),
        skill: Math.round(data.reduce((sum, r) => sum + r.skill, 0) / data.length),
        revision: Math.round(data.reduce((sum, r) => sum + r.revision, 0) / data.length),
        attitude: Math.round(data.reduce((sum, r) => sum + r.attitude, 0) / data.length),
        potential: Math.round(data.reduce((sum, r) => sum + r.potential, 0) / data.length),
      };
      setMetrics(avgMetrics);
    } else {
      setMetrics(DEFAULT_METRICS);
    }
  };

  const refreshMetrics = async () => {
    if (user) {
      await fetchMetrics(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdminRole(session.user.id);
            fetchMetrics(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setMetrics(DEFAULT_METRICS);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdminRole(session.user.id);
        fetchMetrics(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        metrics,
        isAdmin,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshMetrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
