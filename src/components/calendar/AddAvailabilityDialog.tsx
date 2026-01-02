import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
}

interface AddAvailabilityDialogProps {
  date: Date;
  onSuccess: () => void;
}

export function AddAvailabilityDialog({ date, onSuccess }: AddAvailabilityDialogProps) {
  const [open, setOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ start: '09:00', end: '10:00' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '10:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Validate time slots
      for (const slot of timeSlots) {
        if (slot.start >= slot.end) {
          toast.error('End time must be after start time');
          return;
        }
      }

      // Insert all time slots
      const inserts = timeSlots.map(slot => ({
        tutor_id: user.id,
        date: formattedDate,
        start_time: slot.start,
        end_time: slot.end,
      }));

      const { error } = await supabase
        .from('tutor_availability')
        .insert(inserts);

      if (error) throw error;

      toast.success('Availability added successfully');
      setOpen(false);
      setTimeSlots([{ start: '09:00', end: '10:00' }]);
      onSuccess();
    } catch (error: any) {
      console.error('Error adding availability:', error);
      toast.error(error.message || 'Failed to add availability');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute left-1 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-110 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            Add Availability for {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-1 items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor={`start-${index}`} className="sr-only">Start time</Label>
                  <Input
                    id={`start-${index}`}
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex-1">
                  <Label htmlFor={`end-${index}`} className="sr-only">End time</Label>
                  <Input
                    id={`end-${index}`}
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                  />
                </div>
              </div>
              {timeSlots.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeTimeSlot(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={addTimeSlot}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add another time slot
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
