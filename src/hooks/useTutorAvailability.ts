import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  tutor_name: string;
  tutor_color: string;
  tutor_bio?: string;
  tutor_subject?: string;
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

      // Fetch tutor profiles and tutor_profiles in parallel
      const [profilesResult, tutorProfilesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_color')
          .in('id', tutorIds),
        supabase
          .from('tutor_profiles')
          .select('user_id, bio, subject')
          .in('user_id', tutorIds)
      ]);

      if (profilesResult.error) throw profilesResult.error;

      const profiles = profilesResult.data || [];
      const tutorProfiles = tutorProfilesResult.data || [];

      const tutorProfileMap = tutorProfiles.reduce((acc, tp) => {
        acc[tp.user_id] = { bio: tp.bio, subject: tp.subject };
        return acc;
      }, {} as Record<string, { bio: string | null; subject: string | null }>);

      const profileMap = profiles.reduce((acc, p) => {
        const tutorProfile = tutorProfileMap[p.id];
        acc[p.id] = {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
          color: p.avatar_color || '#0A4D4A',
          bio: tutorProfile?.bio || undefined,
          subject: tutorProfile?.subject || undefined,
        };
        return acc;
      }, {} as Record<string, { name: string; color: string; bio?: string; subject?: string }>);

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
          tutor_bio: profile.bio,
          tutor_subject: profile.subject,
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
