import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/profile/ProgressBar';
import { RadarChart } from '@/components/profile/RadarChart';
import { LessonReviews } from '@/components/profile/LessonReviews';
import { CalendarDays, BookOpen, Loader2 } from 'lucide-react';

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

export default function ProfilePage() {
  const { user, profile, metrics, isLoading, refreshMetrics } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<LessonRating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRatings();
    }
  }, [user]);

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

            {/* Right Column - Sessions */}
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
                      You have no upcoming sessions.
                    </p>
                    <p className="mt-2 font-body text-sm text-muted-foreground">
                      Contact your manager to book your next slot.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
