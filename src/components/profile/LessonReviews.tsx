import { Card, CardContent } from '@/components/ui/card';

const generateRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const reviews = [
  {
    id: 1,
    tutor: 'Dr. Sarah Mitchell',
    date: generateRandomDate(2),
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Excellent progress on differential equations this week!',
  },
  {
    id: 2,
    tutor: 'James Chen',
    date: generateRandomDate(5),
    content:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec velit neque, auctor sit amet aliquam vel. Great improvement in algorithm design thinking. Keep practicing recursive solutions!',
  },
  {
    id: 3,
    tutor: 'Emily Rodriguez',
    date: generateRandomDate(9),
    content:
      'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Pellentesque in ipsum id orci porta dapibus. Strong essay structure today. Focus on improving citation formatting for next session.',
  },
  {
    id: 4,
    tutor: 'Dr. Michael Thompson',
    date: generateRandomDate(14),
    content:
      'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vivamus magna justo, lacinia eget consectetur sed. Anatomy fundamentals are solid. Next week we will dive into cardiovascular systems.',
  },
];

export function LessonReviews() {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground">Lesson Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-l-4 border-l-primary shadow-soft">
            <CardContent className="py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-foreground">
                  {review.tutor}
                </span>
                <span className="font-body text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {review.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
