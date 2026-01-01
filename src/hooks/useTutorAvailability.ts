import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  tutor_name: string;
  tutor_color: string;
}

export function useTutorAvailability(currentMonth: Date) {
  const [availability, setAvailability] = useState<Record<string, AvailabilitySlot[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('tutor_availability')
        .select('id, tutor_id, date, start_time, end_time')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (error) throw error;

      if (!data || data.length === 0) {
        setAvailability({});
        return;
      }

      // Get unique tutor IDs
      const tutorIds = [...new Set(data.map(d => d.tutor_id))];

      // Fetch tutor profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_color')
        .in('id', tutorIds);

      if (profilesError) throw profilesError;

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
          color: p.avatar_color || '#0A4D4A',
        };
        return acc;
      }, {} as Record<string, { name: string; color: string }>);

      // Group by date
      const grouped = data.reduce((acc, slot) => {
        const dateKey = slot.date;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        const profile = profileMap[slot.tutor_id] || { name: 'Unknown', color: '#0A4D4A' };
        acc[dateKey].push({
          id: slot.id,
          tutor_id: slot.tutor_id,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          tutor_name: profile.name,
          tutor_color: profile.color,
        });
        return acc;
      }, {} as Record<string, AvailabilitySlot[]>);

      setAvailability(grouped);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { availability, isLoading, refetch: fetchAvailability };
}
