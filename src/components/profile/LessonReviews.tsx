import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';

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

interface LessonReviewsProps {
  ratings: LessonRating[];
  loading: boolean;
}

export function LessonReviews({ ratings, loading }: LessonReviewsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getAverageScore = (rating: LessonRating) => {
    return ((rating.focus + rating.skill + rating.revision + rating.attitude + rating.potential) / 5).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-display text-xl font-semibold text-foreground">Lesson Reviews</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 font-body text-sm text-muted-foreground">
            No lesson reviews yet.
          </p>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Your tutors will add feedback after each session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground">Lesson Reviews</h3>
      <div className="space-y-4">
        {ratings.map((rating) => (
          <Card key={rating.id} className="border-l-4 border-l-primary shadow-soft">
            <CardContent className="py-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-sm font-semibold text-primary">
                    Score: {getAverageScore(rating)}/5
                  </span>
                </div>
                <span className="font-body text-xs text-muted-foreground">
                  {formatDate(rating.created_at)}
                </span>
              </div>
              
              {/* Scores breakdown */}
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded bg-muted px-2 py-0.5 font-body text-xs">Focus: {rating.focus}</span>
                <span className="rounded bg-muted px-2 py-0.5 font-body text-xs">Skill: {rating.skill}</span>
                <span className="rounded bg-muted px-2 py-0.5 font-body text-xs">Revision: {rating.revision}</span>
                <span className="rounded bg-muted px-2 py-0.5 font-body text-xs">Attitude: {rating.attitude}</span>
                <span className="rounded bg-muted px-2 py-0.5 font-body text-xs">Potential: {rating.potential}</span>
              </div>

              {rating.notes && (
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {rating.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
