import { format } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  start_time: string;
  end_time: string;
  tutor_name: string;
  tutor_color: string;
}

interface AvailabilityDisplayProps {
  slots: AvailabilitySlot[];
  compact?: boolean;
}

export function AvailabilityDisplay({ slots, compact = false }: AvailabilityDisplayProps) {
  // Group slots by tutor
  const groupedByTutor = slots.reduce((acc, slot) => {
    if (!acc[slot.tutor_id]) {
      acc[slot.tutor_id] = {
        name: slot.tutor_name,
        color: slot.tutor_color,
        times: [],
      };
    }
    acc[slot.tutor_id].times.push({
      start: slot.start_time,
      end: slot.end_time,
    });
    return acc;
  }, {} as Record<string, { name: string; color: string; times: { start: string; end: string }[] }>);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  if (Object.keys(groupedByTutor).length === 0) {
    return null;
  }

  return (
    <div className={`mt-1 space-y-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      {Object.entries(groupedByTutor).map(([tutorId, tutor]) => (
        <div
          key={tutorId}
          className="rounded px-1 py-0.5"
          style={{ backgroundColor: `${tutor.color}20`, borderLeft: `2px solid ${tutor.color}` }}
        >
          <div className="font-medium truncate" style={{ color: tutor.color }}>
            {tutor.name}
          </div>
          {!compact && tutor.times.map((time, idx) => (
            <div key={idx} className="text-muted-foreground truncate">
              {formatTime(time.start)} - {formatTime(time.end)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
