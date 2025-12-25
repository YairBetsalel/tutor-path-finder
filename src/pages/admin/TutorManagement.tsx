import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TutorForm, TutorFormData } from '@/components/admin/TutorForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Subject } from '@/lib/qualifications';
import { supabase } from '@/integrations/supabase/client';

interface TutorData {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  subject: string;
  standardQualifications: string[];
  customQualifications: string[];
  avatarColor: string;
  avatarLetter: string;
  role: 'tutor' | 'admin';
}

const defaultFormData: TutorFormData = {
  name: '',
  bio: '',
  position: 'Tutor',
  subject: 'General',
  standardQualifications: [],
  customQualifications: [],
};

export default function TutorManagementPage() {
  const [tutors, setTutors] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<TutorData | null>(null);
  const [formData, setFormData] = useState<TutorFormData>(defaultFormData);

  const fetchTutors = async () => {
    try {
      // First get all users with tutor or admin roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['tutor', 'admin']);

      if (roleError) throw roleError;

      if (!roleData || roleData.length === 0) {
        setTutors([]);
        setLoading(false);
        return;
      }

      const userIds = roleData.map(r => r.user_id);
      const roleMap = new Map(roleData.map(r => [r.user_id, r.role]));

      // Get profiles for these users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_color, avatar_letter')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Get tutor_profiles for these users
      const { data: tutorProfiles, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select('*')
        .in('user_id', userIds);

      if (tutorError) throw tutorError;

      // Merge the data
      const tutorProfileMap = new Map(tutorProfiles?.map(tp => [tp.user_id, tp]) || []);

      const mergedTutors: TutorData[] = (profiles || []).map(profile => {
        const tutorProfile = tutorProfileMap.get(profile.id);
        const role = roleMap.get(profile.id) as 'tutor' | 'admin';
        return {
          id: tutorProfile?.id || profile.id,
          user_id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
          bio: tutorProfile?.bio || '',
          subject: tutorProfile?.subject || 'General',
          standardQualifications: tutorProfile?.standard_qualifications || [],
          customQualifications: tutorProfile?.custom_qualifications || [],
          avatarColor: profile.avatar_color || '#0A4D4A',
          avatarLetter: profile.avatar_letter || 'U',
          role,
        };
      });

      setTutors(mergedTutors);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast.error('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleEdit = async () => {
    if (!editingTutor) return;
    if (!formData.bio) {
      toast.error('Please fill in the bio');
      return;
    }

    try {
      // Check if tutor_profile exists
      const { data: existing } = await supabase
        .from('tutor_profiles')
        .select('id')
        .eq('user_id', editingTutor.user_id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('tutor_profiles')
          .update({
            bio: formData.bio,
            subject: formData.subject,
            standard_qualifications: formData.standardQualifications,
            custom_qualifications: formData.customQualifications,
          })
          .eq('user_id', editingTutor.user_id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('tutor_profiles')
          .insert({
            user_id: editingTutor.user_id,
            bio: formData.bio,
            subject: formData.subject,
            standard_qualifications: formData.standardQualifications,
            custom_qualifications: formData.customQualifications,
          });

        if (error) throw error;
      }

      toast.success('Tutor updated successfully');
      resetForm();
      setEditingTutor(null);
      fetchTutors();
    } catch (error) {
      console.error('Error updating tutor:', error);
      toast.error('Failed to update tutor');
    }
  };

  const openEditDialog = (tutor: TutorData) => {
    setEditingTutor(tutor);
    setFormData({
      name: tutor.name,
      bio: tutor.bio,
      position: tutor.role === 'admin' ? 'Management' : 'Tutor',
      subject: tutor.subject as Subject,
      standardQualifications: tutor.standardQualifications,
      customQualifications: tutor.customQualifications,
    });
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Loading tutors...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Tutor Management</h1>
              <p className="mt-2 font-body text-muted-foreground">
                View and edit tutor profiles. Tutors can also edit their own profiles.
              </p>
            </div>
          </motion.div>

          {tutors.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tutors or admins found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Assign the tutor or admin role to users in the Roles Management page.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {tutors.map((tutor, index) => (
                  <motion.div
                    key={tutor.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="shadow-soft transition-shadow hover:shadow-medium">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-primary-foreground"
                              style={{ backgroundColor: tutor.avatarColor }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {tutor.avatarLetter}
                            </motion.div>
                            <div>
                              <CardTitle className="font-display text-lg">{tutor.name}</CardTitle>
                              <p className="font-body text-sm text-muted-foreground">
                                {tutor.role === 'admin' ? 'Management' : 'Tutor'} • {tutor.subject || 'No subject'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog
                              open={editingTutor?.user_id === tutor.user_id}
                              onOpenChange={(open) => !open && setEditingTutor(null)}
                            >
                              <DialogTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEditDialog(tutor)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </DialogTrigger>
                              <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle className="font-display text-xl">Edit {tutor.name}</DialogTitle>
                                  <DialogDescription>Update the tutor's profile information.</DialogDescription>
                                </DialogHeader>
                                <TutorForm
                                  formData={formData}
                                  onFormDataChange={setFormData}
                                  onSubmit={handleEdit}
                                  submitLabel="Save Changes"
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 font-body text-sm text-muted-foreground line-clamp-2">
                          {tutor.bio || 'No bio yet'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tutor.standardQualifications.map((qual, i) => (
                            <span
                              key={`std-${i}`}
                              className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-xs text-primary"
                            >
                              {qual}
                            </span>
                          ))}
                          {tutor.customQualifications.map((qual, i) => (
                            <span
                              key={`custom-${i}`}
                              className="rounded-full bg-secondary/20 px-2 py-0.5 font-body text-xs text-secondary"
                            >
                              ✦ {qual}
                            </span>
                          ))}
                          {tutor.standardQualifications.length === 0 && tutor.customQualifications.length === 0 && (
                            <span className="font-body text-xs text-muted-foreground">No qualifications set</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
