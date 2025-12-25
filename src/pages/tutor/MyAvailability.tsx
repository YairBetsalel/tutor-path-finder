import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function MyAvailabilityPage() {
  const { user, isTutor, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && !isTutor) {
      toast.error('Tutor access required');
      navigate('/');
    }
  }, [user, isTutor, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isTutor) {
    return null;
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">My Availability</h1>
            <p className="mt-2 font-body text-muted-foreground">
              Set your available times for tutoring sessions.
            </p>
          </motion.div>

          <Card className="mx-auto max-w-md">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <div className="mb-6 rounded-full bg-muted p-6">
                <Clock className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Coming Soon</h3>
              <p className="mt-2 font-body text-muted-foreground">
                The availability management feature is currently under development. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}