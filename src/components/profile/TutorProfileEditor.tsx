import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/ui/tag-input';
import { QualificationChip } from '@/components/ui/qualification-chip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Briefcase, BookOpen, Award, Loader2 } from 'lucide-react';
import { SUBJECTS, SUBJECT_QUALIFICATIONS, Subject } from '@/lib/qualifications';

interface TutorProfile {
  id: string;
  user_id: string;
  bio: string | null;
  subject: string | null;
  standard_qualifications: string[];
  custom_qualifications: string[];
}

export function TutorProfileEditor() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  
  const [bio, setBio] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [standardQualifications, setStandardQualifications] = useState<string[]>([]);
  const [customQualifications, setCustomQualifications] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchTutorProfile();
    }
  }, [user]);

  const fetchTutorProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setTutorProfile(data);
      setBio(data.bio || '');
      setSubject(data.subject || '');
      setStandardQualifications(data.standard_qualifications || []);
      setCustomQualifications(data.custom_qualifications || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const profileData = {
      user_id: user.id,
      bio,
      subject,
      standard_qualifications: standardQualifications,
      custom_qualifications: customQualifications,
    };

    let error;
    if (tutorProfile) {
      const result = await supabase
        .from('tutor_profiles')
        .update(profileData)
        .eq('user_id', user.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('tutor_profiles')
        .insert(profileData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save profile');
      console.error(error);
    } else {
      toast.success('Profile saved successfully');
      fetchTutorProfile();
    }
    setSaving(false);
  };

  const toggleStandardQualification = (qual: string) => {
    setStandardQualifications(prev =>
      prev.includes(qual)
        ? prev.filter(q => q !== qual)
        : [...prev, qual]
    );
  };

  const qualificationsBySubject = useMemo(() => {
    const result: Record<string, readonly string[]> = {};
    for (const [subj, quals] of Object.entries(SUBJECT_QUALIFICATIONS)) {
      result[subj] = quals;
    }
    return result;
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground shadow-medium"
          style={{ backgroundColor: profile?.avatar_color }}
        >
          {profile?.avatar_letter}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {profile?.first_name || 'User'} {profile?.last_name || ''}
          </h1>
          <p className="mt-1 font-body text-muted-foreground">
            Manage your professional profile and qualifications.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subject Selection */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <BookOpen className="h-5 w-5 text-primary" />
                Primary Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.filter(s => s !== 'General').map((subj) => (
                  <motion.button
                    key={subj}
                    type="button"
                    onClick={() => setSubject(subj)}
                    className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                      subject === subj
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {subj}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Award className="h-5 w-5 text-primary" />
                Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Standard Qualifications by Subject */}
              {Object.entries(qualificationsBySubject).map(([subj, quals]) => (
                <div key={subj} className="space-y-2">
                  <Label className="font-body text-sm text-muted-foreground">{subj}</Label>
                  <div className="flex flex-wrap gap-2">
                    {quals.map((qual) => (
                      <QualificationChip
                        key={qual}
                        label={qual}
                        selected={standardQualifications.includes(qual)}
                        onToggle={() => toggleStandardQualification(qual)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom Qualifications */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="font-body">Custom Qualifications</Label>
                <TagInput
                  tags={customQualifications}
                  onTagsChange={setCustomQualifications}
                  placeholder="Add custom qualification..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Briefcase className="h-5 w-5 text-primary" />
                Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about yourself, your experience, and teaching style..."
                className="min-h-[150px] font-body"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Save */}
        <div className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="font-display">Profile Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-4xl font-bold text-primary-foreground shadow-medium"
                  style={{ backgroundColor: profile?.avatar_color }}
                >
                  {profile?.avatar_letter}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                {subject && (
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    {subject} Specialist
                  </p>
                )}
                {bio && (
                  <p className="mt-4 font-body text-sm text-muted-foreground line-clamp-3">
                    {bio}
                  </p>
                )}
                {(standardQualifications.length > 0 || customQualifications.length > 0) && (
                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {[...standardQualifications, ...customQualifications].slice(0, 5).map((qual) => (
                      <span
                        key={qual}
                        className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-xs text-primary"
                      >
                        {qual}
                      </span>
                    ))}
                    {[...standardQualifications, ...customQualifications].length > 5 && (
                      <span className="font-body text-xs text-muted-foreground">
                        +{[...standardQualifications, ...customQualifications].length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full font-body"
            size="lg"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
