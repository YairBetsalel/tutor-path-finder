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

interface BondedChild {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_color: string;
  avatar_letter: string;
}

type AppRole = 'admin' | 'student' | 'parent' | 'tutor';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  metrics: Metrics;
  isAdmin: boolean;
  isTutor: boolean;
  userRole: AppRole;
  bondedChildren: BondedChild[];
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: 'student' | 'parent') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshBondedChildren: () => Promise<void>;
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
  const [isTutor, setIsTutor] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('student');
  const [bondedChildren, setBondedChildren] = useState<BondedChild[]>([]);
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

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    const role = (data?.role as AppRole) || 'student';
    setUserRole(role);
    setIsAdmin(role === 'admin');
    setIsTutor(role === 'tutor');
  };
  const fetchBondedChildren = async (userId: string) => {
    const { data: bonds } = await supabase
      .from('parent_child_bonds')
      .select('child_id')
      .eq('parent_id', userId);

    if (bonds && bonds.length > 0) {
      const childIds = bonds.map((b) => b.child_id);
      const { data: children } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_color, avatar_letter')
        .in('id', childIds);

      if (children) {
        setBondedChildren(children);
      }
    } else {
      setBondedChildren([]);
    }
  };

  const refreshBondedChildren = async () => {
    if (user) {
      await fetchBondedChildren(user.id);
    }
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
      // Calculate average of last 10 ratings (rounded to 1 decimal)
      const round = (n: number) => Math.round(n * 10) / 10;
      const avgMetrics = {
        focus: round(data.reduce((sum, r) => sum + r.focus, 0) / data.length),
        skill: round(data.reduce((sum, r) => sum + r.skill, 0) / data.length),
        revision: round(data.reduce((sum, r) => sum + r.revision, 0) / data.length),
        attitude: round(data.reduce((sum, r) => sum + r.attitude, 0) / data.length),
        potential: round(data.reduce((sum, r) => sum + r.potential, 0) / data.length),
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
            fetchUserRole(session.user.id);
            fetchMetrics(session.user.id);
            fetchBondedChildren(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsTutor(false);
          setUserRole('student');
          setBondedChildren([]);
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
        fetchUserRole(session.user.id);
        fetchMetrics(session.user.id);
        fetchBondedChildren(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role: 'student' | 'parent' = 'student') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
          role: role,
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
    // Clear local state immediately
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsTutor(false);
    setUserRole('student');
    setBondedChildren([]);
    setMetrics(DEFAULT_METRICS);
    
    // Then sign out from Supabase (use local scope to avoid server errors)
    await supabase.auth.signOut({ scope: 'local' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        metrics,
        isAdmin,
        isTutor,
        userRole,
        bondedChildren,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshMetrics,
        refreshBondedChildren,
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
