import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useTutors, Tutor } from '@/contexts/TutorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TutorManagementPage() {
  const { tutors, addTutor, updateTutor, deleteTutor } = useTutors();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    position: 'Tutor' as 'Tutor' | 'Management',
    qualifications: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      position: 'Tutor',
      qualifications: '',
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.bio || !formData.qualifications) {
      toast.error('Please fill in all fields');
      return;
    }
    addTutor(formData);
    toast.success('Tutor added successfully');
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!editingTutor) return;
    if (!formData.name || !formData.bio || !formData.qualifications) {
      toast.error('Please fill in all fields');
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
      qualifications: tutor.qualifications,
    });
  };

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Tutor Management</h1>
              <p className="mt-2 font-body text-muted-foreground">
                Add, edit, or remove tutors from the directory.
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="font-body">
                  <Plus className="mr-2 h-4 w-4" /> Add New Tutor
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-display">Add New Tutor</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="font-body">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="font-body"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position" className="font-body">Position</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value: 'Tutor' | 'Management') =>
                        setFormData({ ...formData, position: value })
                      }
                    >
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Tutor">Tutor</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="qualifications" className="font-body">Qualifications</Label>
                    <Input
                      id="qualifications"
                      placeholder="e.g., PhD Mathematics, MSc Physics"
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      className="font-body"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="font-body">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="font-body"
                    />
                  </div>
                </div>
                <Button onClick={handleAdd} className="font-body">Add Tutor</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tutor List */}
          <div className="space-y-4">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="shadow-soft">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-primary-foreground"
                        style={{ backgroundColor: tutor.imageColor }}
                      >
                        {tutor.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg">{tutor.name}</CardTitle>
                        <p className="font-body text-sm text-muted-foreground">
                          {tutor.position} • {tutor.qualifications}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingTutor?.id === tutor.id}
                        onOpenChange={(open) => !open && setEditingTutor(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(tutor)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="font-display">Edit Tutor</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name" className="font-body">Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="font-body"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-position" className="font-body">Position</Label>
                              <Select
                                value={formData.position}
                                onValueChange={(value: 'Tutor' | 'Management') =>
                                  setFormData({ ...formData, position: value })
                                }
                              >
                                <SelectTrigger className="font-body">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                  <SelectItem value="Tutor">Tutor</SelectItem>
                                  <SelectItem value="Management">Management</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-qualifications" className="font-body">Qualifications</Label>
                              <Input
                                id="edit-qualifications"
                                value={formData.qualifications}
                                onChange={(e) =>
                                  setFormData({ ...formData, qualifications: e.target.value })
                                }
                                className="font-body"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-bio" className="font-body">Bio</Label>
                              <Textarea
                                id="edit-bio"
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="font-body"
                              />
                            </div>
                          </div>
                          <Button onClick={handleEdit} className="font-body">Save Changes</Button>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(tutor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
