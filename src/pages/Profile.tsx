import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/profile/ProgressBar';
import { RadarChart } from '@/components/profile/RadarChart';
import { LessonReviews } from '@/components/profile/LessonReviews';
import { CalendarDays, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 flex items-center gap-6">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground shadow-medium"
              style={{ backgroundColor: user.color }}
            >
              {user.letter}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
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
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Progress Bars */}
                    <div className="space-y-6">
                      <ProgressBar label="Focus" value={user.metrics.focus} />
                      <ProgressBar label="Skill" value={user.metrics.skill} />
                      <ProgressBar label="Revision" value={user.metrics.revision} />
                      <ProgressBar label="Attitude" value={user.metrics.attitude} />
                      <ProgressBar label="Potential" value={user.metrics.potential} />
                    </div>

                    {/* Radar Chart */}
                    <div className="flex items-center justify-center">
                      <RadarChart metrics={user.metrics} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Reviews */}
              <Card className="shadow-medium">
                <CardContent className="pt-6">
                  <LessonReviews />
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
