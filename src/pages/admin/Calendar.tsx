import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Calendar Management</h1>
            <p className="mt-2 font-body text-muted-foreground">
              Manage tutor schedules and lesson bookings.
            </p>
          </div>

          <Card className="mx-auto max-w-2xl shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">
                Calendar Integration Under Development
              </h2>
              <p className="mt-4 max-w-md font-body text-muted-foreground">
                Future features will include lesson scheduling, tutor availability syncing, 
                and automated booking confirmations. Stay tuned for updates!
              </p>
              <div className="mt-8 flex gap-4">
                <div className="rounded-lg bg-muted px-4 py-2">
                  <p className="font-body text-xs text-muted-foreground">Coming Soon</p>
                  <p className="font-display text-sm font-semibold text-foreground">Lesson Scheduling</p>
                </div>
                <div className="rounded-lg bg-muted px-4 py-2">
                  <p className="font-body text-xs text-muted-foreground">Coming Soon</p>
                  <p className="font-display text-sm font-semibold text-foreground">Availability Sync</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
