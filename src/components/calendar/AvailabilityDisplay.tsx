import { format } from 'date-fns';
import { Clock, User, BookOpen } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { AvailabilitySlot } from '@/hooks/useTutorAvailability';

interface AvailabilityDisplayProps {
  slots: AvailabilitySlot[];
  compact?: boolean;
}

export function AvailabilityDisplay({ slots, compact = false }: AvailabilityDisplayProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  if (slots.length === 0) {
    return null;
  }

  return (
    <div className={`mt-1 space-y-1 ${compact ? 'text-[10px] max-h-[70px]' : 'text-xs max-h-[90px]'} overflow-y-auto`}>
      {slots.map((slot) => (
        <Popover key={slot.id}>
          <PopoverTrigger asChild>
            <button
              className="w-full rounded px-1.5 py-1 text-left transition-all hover:scale-[1.02] hover:shadow-sm cursor-pointer"
              style={{ 
                backgroundColor: `${slot.tutor_color}20`, 
                borderLeft: `3px solid ${slot.tutor_color}` 
              }}
            >
              <div className="font-medium truncate" style={{ color: slot.tutor_color }}>
                {slot.tutor_name}
              </div>
              <div className="text-muted-foreground truncate">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <div className="p-4">
              {/* Header with tutor name */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold"
                  style={{ backgroundColor: slot.tutor_color }}
                >
                  {slot.tutor_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">
                    {slot.tutor_name}
                  </h4>
                  {slot.tutor_subject && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {slot.tutor_subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Time slot */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Available for tutoring
                  </p>
                </div>
              </div>

              {/* Bio */}
              {slot.tutor_bio && (
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-3 w-3" />
                    About
                  </p>
                  <p className="text-sm text-foreground line-clamp-3">
                    {slot.tutor_bio}
                  </p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
