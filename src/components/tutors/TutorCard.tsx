import { Tutor } from '@/contexts/TutorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="group overflow-hidden shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
      <CardHeader className="relative pb-0">
        <div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: tutor.imageColor }}
        >
          {tutor.name.charAt(0)}
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-center">
        <h3 className="font-display text-lg font-semibold text-foreground">{tutor.name}</h3>
        <Badge
          variant={tutor.position === 'Management' ? 'default' : 'secondary'}
          className="mt-2"
        >
          {tutor.position}
        </Badge>
        <p className="mt-3 font-body text-sm text-muted-foreground line-clamp-3">{tutor.bio}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-1">
          {tutor.qualifications.split(', ').map((qual, index) => (
            <span
              key={index}
              className="rounded-full bg-muted px-2 py-1 font-body text-xs text-muted-foreground"
            >
              {qual}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
