import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/profile/ProgressBar';
import { RadarChart } from '@/components/profile/RadarChart';
import { LessonReviews } from '@/components/profile/LessonReviews';
import { CalendarDays, BookOpen, Loader2, UserPlus, X, Users } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonRating {
  id: string;
  focus: number;
  skill: number;
  revision: number;
  attitude: number;
  potential: number;
  notes: string | null;
  created_at: string;
  admin_id: string | null;
}

interface ChildProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_color: string;
  avatar_letter: string;
}

interface ChildMetrics {
  focus: number;
  skill: number;
  revision: number;
  attitude: number;
  potential: number;
}

export default function ProfilePage() {
  const { user, profile, metrics, isLoading, refreshMetrics, userRole, bondedChildren, refreshBondedChildren } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<LessonRating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [parentEmail, setParentEmail] = useState('');
  const [bondingLoading, setBondingLoading] = useState(false);

  // For parent view - selected child and their data
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childProfiles, setChildProfiles] = useState<Map<string, { profile: ChildProfile; metrics: ChildMetrics; ratings: LessonRating[] }>>(new Map());
  const [loadingChildren, setLoadingChildren] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && userRole !== 'parent') {
      fetchRatings();
    }
  }, [user, userRole]);

  // Fetch children's data for parents
  useEffect(() => {
    if (userRole === 'parent' && bondedChildren.length > 0) {
      fetchChildrenData();
    }
  }, [userRole, bondedChildren]);

  const fetchRatings = async () => {
    if (!user) return;
    
    setLoadingRatings(true);
    const { data } = await supabase
      .from('lesson_ratings')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setRatings(data);
      refreshMetrics();
    }
    setLoadingRatings(false);
  };

  const fetchChildrenData = async () => {
    setLoadingChildren(true);
    const newChildProfiles = new Map<string, { profile: ChildProfile; metrics: ChildMetrics; ratings: LessonRating[] }>();

    for (const child of bondedChildren) {
      // Fetch ratings for this child
      const { data: ratingsData } = await supabase
        .from('lesson_ratings')
        .select('*')
        .eq('student_id', child.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const ratings = ratingsData || [];

      // Calculate metrics
      const round = (n: number) => Math.round(n * 10) / 10;
      const childMetrics: ChildMetrics = ratings.length > 0
        ? {
            focus: round(ratings.reduce((sum, r) => sum + r.focus, 0) / ratings.length),
            skill: round(ratings.reduce((sum, r) => sum + r.skill, 0) / ratings.length),
            revision: round(ratings.reduce((sum, r) => sum + r.revision, 0) / ratings.length),
            attitude: round(ratings.reduce((sum, r) => sum + r.attitude, 0) / ratings.length),
            potential: round(ratings.reduce((sum, r) => sum + r.potential, 0) / ratings.length),
          }
        : { focus: 1, skill: 1, revision: 1, attitude: 1, potential: 1 };

      newChildProfiles.set(child.id, {
        profile: child,
        metrics: childMetrics,
        ratings,
      });
    }

    setChildProfiles(newChildProfiles);
    if (bondedChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(bondedChildren[0].id);
    }
    setLoadingChildren(false);
  };

  const handleBondParent = async () => {
    if (!parentEmail.trim()) {
      toast.error('Please enter a parent email');
      return;
    }

    setBondingLoading(true);

    // Find the parent user by email - we need to look up in auth.users via a function or by checking profiles
    // Since we can't directly query auth.users, we'll use a workaround via checking if the parent has the parent role
    // For now, we'll search by trying to find a profile and then check their role

    // First, let's try to find the user by creating the bond directly
    // The parent must exist and have signed up already
    
    // We'll need to get the parent's user_id by their email
    // Since we can't query auth.users directly, we need an edge function or RPC
    // For simplicity, let's create a simple approach: the admin assigns roles, and we look up by profile email
    
    // Actually, profiles don't store email. We need to use the auth.users table.
    // Let's create an RPC function for this.
    
    // For now, let's use a simpler approach - we'll notify the user that this requires the parent to be registered
    // and then use a workaround
    
    try {
      // Find parent by email using the database function
      const { data: parentData, error } = await supabase
        .rpc('find_parent_by_email', { parent_email: parentEmail.toLowerCase().trim() } as any);

      if (error || !parentData || (Array.isArray(parentData) && parentData.length === 0)) {
        toast.error('No parent account found with this email. Make sure the parent has registered and has the Parent role.');
        setBondingLoading(false);
        return;
      }

      const parentResult = parentData as Array<{ id: string }> | { id: string } | null;
      const parentId = Array.isArray(parentResult) ? parentResult[0]?.id : (parentResult as any)?.id;

      // Create the bond
      const { error: bondError } = await supabase
        .from('parent_child_bonds')
        .insert({
          parent_id: parentId,
          child_id: user?.id,
        } as any);

      if (bondError) {
        if (bondError.code === '23505') {
          toast.error('This parent is already linked to your account');
        } else {
          toast.error('Failed to link parent account');
        }
      } else {
        toast.success('Parent account linked successfully!');
        setParentEmail('');
      }
    } catch (err) {
      toast.error('Failed to link parent account');
    }

    setBondingLoading(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) return null;

  // Parent view - show children's profiles
  if (userRole === 'parent') {
    const selectedChild = selectedChildId ? childProfiles.get(selectedChildId) : null;

    return (
      <Layout>
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Children tabs */}
            {bondedChildren.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap gap-3">
                  {bondedChildren.map((child) => (
                    <Button
                      key={child.id}
                      variant={selectedChildId === child.id ? 'default' : 'outline'}
                      onClick={() => setSelectedChildId(child.id)}
                      className="font-body"
                    >
                      <div
                        className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                        style={{ backgroundColor: child.avatar_color }}
                      >
                        {child.avatar_letter}
                      </div>
                      {child.first_name || 'Child'}'s Profile
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {loadingChildren ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedChild ? (
              <>
                {/* Header */}
                <motion.div 
                  className="mb-12 flex items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedChildId}
                >
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground shadow-medium"
                    style={{ backgroundColor: selectedChild.profile.avatar_color }}
                  >
                    {selectedChild.profile.avatar_letter}
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">
                      {selectedChild.profile.first_name || 'Student'}'s Profile
                    </h1>
                    <p className="mt-1 font-body text-muted-foreground">
                      Viewing your child's learning progress.
                    </p>
                  </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Left Column - Progress & Metrics */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Progress Section */}
                    <Card className="shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-display">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Progress & Metrics
                        </CardTitle>
                        <p className="font-body text-sm text-muted-foreground">
                          Average of last {selectedChild.ratings.length || 0} lesson ratings
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="space-y-6">
                            <ProgressBar label="Focus" value={selectedChild.metrics.focus} />
                            <ProgressBar label="Skill" value={selectedChild.metrics.skill} />
                            <ProgressBar label="Revision" value={selectedChild.metrics.revision} />
                            <ProgressBar label="Attitude" value={selectedChild.metrics.attitude} />
                            <ProgressBar label="Potential" value={selectedChild.metrics.potential} />
                          </div>
                          <div className="flex items-center justify-center">
                            <RadarChart metrics={selectedChild.metrics} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lesson Reviews */}
                    <Card className="shadow-medium">
                      <CardContent className="pt-6">
                        <LessonReviews ratings={selectedChild.ratings} loading={false} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div>
                    <Card className="shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-display">
                          <CalendarDays className="h-5 w-5 text-primary" />
                          Upcoming Sessions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <CalendarDays className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mt-4 font-body text-sm text-muted-foreground">
                            No upcoming sessions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 font-display text-xl font-bold">No Linked Children</h2>
                <p className="mt-2 font-body text-muted-foreground">
                  Your children need to add your email to their profile to link accounts.
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  // Student/Admin view - show own profile
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 flex items-center gap-6">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground shadow-medium"
              style={{ backgroundColor: profile.avatar_color }}
            >
              {profile.avatar_letter}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {profile.first_name || 'Student'} {profile.last_name || ''}
              </h1>
              <p className="mt-1 font-body text-muted-foreground">
                Track your progress and view your learning journey.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Progress & Metrics */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Section */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Progress & Metrics
                  </CardTitle>
                  <p className="font-body text-sm text-muted-foreground">
                    Average of your last {ratings.length || 0} lesson ratings
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Progress Bars */}
                    <div className="space-y-6">
                      <ProgressBar label="Focus" value={metrics.focus} />
                      <ProgressBar label="Skill" value={metrics.skill} />
                      <ProgressBar label="Revision" value={metrics.revision} />
                      <ProgressBar label="Attitude" value={metrics.attitude} />
                      <ProgressBar label="Potential" value={metrics.potential} />
                    </div>

                    {/* Radar Chart */}
                    <div className="flex items-center justify-center">
                      <RadarChart metrics={metrics} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Reviews */}
              <Card className="shadow-medium">
                <CardContent className="pt-6">
                  <LessonReviews ratings={ratings} loading={loadingRatings} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sessions & Parent Bonding */}
            <div className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <CalendarDays className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="mt-4 font-body text-sm text-muted-foreground">
                      You have no upcoming sessions.
                    </p>
                    <p className="mt-2 font-body text-sm text-muted-foreground">
                      Contact your manager to book your next slot.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Parent Bonding - only for students */}
              {userRole === 'student' && (
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Link Parent Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 font-body text-sm text-muted-foreground">
                      Enter your parent's email to allow them to view your progress.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="parentEmail" className="font-body">
                          Parent's Email
                        </Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          placeholder="parent@example.com"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          className="mt-1 font-body"
                        />
                      </div>
                      <Button
                        onClick={handleBondParent}
                        disabled={bondingLoading}
                        className="w-full font-body"
                      >
                        {bondingLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="mr-2 h-4 w-4" />
                        )}
                        Link Parent
                      </Button>
                    </div>
                    <p className="mt-3 font-body text-xs text-muted-foreground">
                      Note: Your parent must have a registered account with the "Parent" role.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
