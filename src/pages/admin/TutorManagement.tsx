import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useTutors, Tutor } from '@/contexts/TutorContext';
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

const defaultFormData: TutorFormData = {
  name: '',
  bio: '',
  position: 'Tutor',
  subject: 'General',
  standardQualifications: [],
  customQualifications: [],
};

export default function TutorManagementPage() {
  const { tutors, addTutor, updateTutor, deleteTutor } = useTutors();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState<TutorFormData>(defaultFormData);

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.bio) {
      toast.error('Please fill in name and bio');
      return;
    }
    if (formData.standardQualifications.length === 0 && formData.customQualifications.length === 0) {
      toast.error('Please add at least one qualification');
      return;
    }
    addTutor(formData);
    toast.success('Tutor added successfully');
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!editingTutor) return;
    if (!formData.name || !formData.bio) {
      toast.error('Please fill in name and bio');
      return;
    }
    updateTutor(editingTutor.id, formData);
    toast.success('Tutor updated successfully');
    resetForm();
    setEditingTutor(null);
  };

  const handleDelete = (id: string) => {
    deleteTutor(id);
    toast.success('Tutor deleted successfully');
  };

  const openEditDialog = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setFormData({
      name: tutor.name,
      bio: tutor.bio,
      position: tutor.position,
      subject: tutor.subject as Subject,
      standardQualifications: tutor.standardQualifications,
      customQualifications: tutor.customQualifications,
    });
  };

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
                Add, edit, or remove tutors from the directory.
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={resetForm} className="font-body">
                    <Plus className="mr-2 h-4 w-4" /> Add New Tutor
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Add New Tutor</DialogTitle>
                  <DialogDescription>Fill in the details to add a new tutor to the team.</DialogDescription>
                </DialogHeader>
                <TutorForm
                  formData={formData}
                  onFormDataChange={setFormData}
                  onSubmit={handleAdd}
                  submitLabel="Add Tutor"
                />
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Tutor List */}
          <div className="space-y-4">
            <AnimatePresence>
              {tutors.map((tutor, index) => (
                <motion.div
                  key={tutor.id}
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
                            style={{ backgroundColor: tutor.imageColor }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {tutor.name.charAt(0)}
                          </motion.div>
                          <div>
                            <CardTitle className="font-display text-lg">{tutor.name}</CardTitle>
                            <p className="font-body text-sm text-muted-foreground">
                              {tutor.position} • {tutor.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog
                            open={editingTutor?.id === tutor.id}
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
                                <DialogTitle className="font-display text-xl">Edit Tutor</DialogTitle>
                                <DialogDescription>Update the tutor's information.</DialogDescription>
                              </DialogHeader>
                              <TutorForm
                                formData={formData}
                                onFormDataChange={setFormData}
                                onSubmit={handleEdit}
                                submitLabel="Save Changes"
                              />
                            </DialogContent>
                          </Dialog>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(tutor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 font-body text-sm text-muted-foreground line-clamp-2">
                        {tutor.bio}
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
}