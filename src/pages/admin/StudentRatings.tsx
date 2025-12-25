import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Star, User, Loader2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_color: string;
  avatar_letter: string;
}

interface RatingForm {
  focus: number;
  skill: number;
  revision: number;
  attitude: number;
  potential: number;
  notes: string;
}

const defaultRating: RatingForm = {
  focus: 3,
  skill: 3,
  revision: 3,
  attitude: 3,
  potential: 3,
  notes: '',
};

// RatingSlider component defined outside to prevent re-creation on every render
function RatingSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-body">{label}</Label>
        <span className="flex items-center gap-1 font-display text-lg font-bold text-primary">
          {value}
          <Star className="h-4 w-4 fill-primary" />
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={5}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between font-body text-xs text-muted-foreground">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}

export default function StudentRatingsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [ratingForm, setRatingForm] = useState<RatingForm>(defaultRating);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && !isAdmin) {
      toast.error('Admin access required');
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStudents();
    }
  }, [isAdmin]);

  const fetchStudents = async () => {
    setLoading(true);
    
    // First get all user IDs with 'student' role
    const { data: studentRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'student');
    
    if (rolesError) {
      toast.error('Failed to load students');
      setLoading(false);
      return;
    }
    
    const studentIds = studentRoles?.map(r => r.user_id) || [];
    
    if (studentIds.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }
    
    // Then fetch profiles for those students only
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', studentIds)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load students');
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const filteredStudents = students.filter((student) => {
    const name = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const handleSubmitRating = async () => {
    if (!selectedStudent || !user) return;

    setSubmitting(true);
    const { error } = await supabase.from('lesson_ratings').insert({
      student_id: selectedStudent.id,
      admin_id: user.id,
      focus: ratingForm.focus,
      skill: ratingForm.skill,
      revision: ratingForm.revision,
      attitude: ratingForm.attitude,
      potential: ratingForm.potential,
      notes: ratingForm.notes || null,
    });

    setSubmitting(false);

    if (error) {
      toast.error('Failed to submit rating');
    } else {
      toast.success(`Rating submitted for ${selectedStudent.first_name || 'Student'}`);
      setSelectedStudent(null);
      setRatingForm(defaultRating);
    }
  };


  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">Student Ratings</h1>
            <p className="mt-2 font-body text-muted-foreground">
              Search for a student and submit a lesson rating.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-body"
              />
            </div>
          </motion.div>

          {/* Student List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <CardContent className="flex items-center gap-4 py-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-primary-foreground"
                        style={{ backgroundColor: student.avatar_color }}
                      >
                        {student.avatar_letter}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-foreground">
                          {student.first_name || 'Unknown'} {student.last_name || ''}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">Student</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <User className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="font-body text-muted-foreground">
                {searchQuery ? 'No students found matching your search.' : 'No students registered yet.'}
              </p>
            </motion.div>
          )}

          {/* Rating Dialog */}
          <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 font-display text-xl">
                  {selectedStudent && (
                    <>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full font-display font-bold text-primary-foreground"
                        style={{ backgroundColor: selectedStudent.avatar_color }}
                      >
                        {selectedStudent.avatar_letter}
                      </div>
                      Rate {selectedStudent.first_name || 'Student'}
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                <RatingSlider
                  label="Focus"
                  value={ratingForm.focus}
                  onChange={(v) => setRatingForm({ ...ratingForm, focus: v })}
                />
                <RatingSlider
                  label="Skill"
                  value={ratingForm.skill}
                  onChange={(v) => setRatingForm({ ...ratingForm, skill: v })}
                />
                <RatingSlider
                  label="Revision"
                  value={ratingForm.revision}
                  onChange={(v) => setRatingForm({ ...ratingForm, revision: v })}
                />
                <RatingSlider
                  label="Attitude"
                  value={ratingForm.attitude}
                  onChange={(v) => setRatingForm({ ...ratingForm, attitude: v })}
                />
                <RatingSlider
                  label="Potential"
                  value={ratingForm.potential}
                  onChange={(v) => setRatingForm({ ...ratingForm, potential: v })}
                />

                <div className="space-y-2">
                  <Label className="font-body">Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add feedback or notes about this lesson..."
                    value={ratingForm.notes}
                    onChange={(e) => setRatingForm({ ...ratingForm, notes: e.target.value })}
                    className="font-body"
                    rows={4}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSubmitRating}
                    className="w-full font-body"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="mr-2 h-4 w-4" />
                    )}
                    Submit Rating
                  </Button>
                </motion.div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
}
