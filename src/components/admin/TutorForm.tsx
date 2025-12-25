import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QualificationChip } from '@/components/ui/qualification-chip';
import { TagInput } from '@/components/ui/tag-input';
import { SUBJECTS, SUBJECT_QUALIFICATIONS, Subject } from '@/lib/qualifications';

export interface TutorFormData {
  name: string;
  bio: string;
  position: 'Tutor' | 'Management';
  subject: Subject;
  standardQualifications: string[];
  customQualifications: string[];
}

interface TutorFormProps {
  formData: TutorFormData;
  onFormDataChange: (data: TutorFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
}

// Get qualifications grouped by subject for display
const qualificationsBySubject = SUBJECTS.reduce((acc, subject) => {
  acc[subject] = SUBJECT_QUALIFICATIONS[subject] || [];
  return acc;
}, {} as Record<string, readonly string[]>);

export function TutorForm({ formData, onFormDataChange, onSubmit, submitLabel }: TutorFormProps) {
  const toggleStandardQualification = (qual: string) => {
    const newQuals = formData.standardQualifications.includes(qual)
      ? formData.standardQualifications.filter(q => q !== qual)
      : [...formData.standardQualifications, qual];
    onFormDataChange({ ...formData, standardQualifications: newQuals });
  };

  return (
    <div className="grid gap-6 py-4">
      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="tutor-name" className="font-body">Name</Label>
          <Input
            id="tutor-name"
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            className="font-body"
            placeholder="Dr. Jane Smith"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tutor-position" className="font-body">Position</Label>
          <Select
            value={formData.position}
            onValueChange={(value: 'Tutor' | 'Management') =>
              onFormDataChange({ ...formData, position: value })
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
      </div>

      {/* Subject Selection */}
      <div className="grid gap-2">
        <Label htmlFor="tutor-subject" className="font-body">Primary Subject Area</Label>
        <Select
          value={formData.subject}
          onValueChange={(value: Subject) =>
            onFormDataChange({ ...formData, subject: value })
          }
        >
          <SelectTrigger className="font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Part A: Standard Qualifications - Grouped by Subject */}
      <div className="space-y-4">
        <div>
          <Label className="font-body">Standard Qualifications</Label>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Select qualifications from any subject area
          </p>
        </div>
        <div className="space-y-4 max-h-64 overflow-y-auto rounded-lg border border-border p-4">
          {SUBJECTS.map((subject) => (
            <div key={subject} className="space-y-2">
              <p className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {subject}
              </p>
              <div className="flex flex-wrap gap-2">
                {qualificationsBySubject[subject]?.map((qual) => (
                  <QualificationChip
                    key={`${subject}-${qual}`}
                    label={qual}
                    selected={formData.standardQualifications.includes(qual)}
                    onToggle={() => toggleStandardQualification(qual)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part B: Custom Qualifications */}
      <div className="space-y-3">
        <div>
          <Label className="font-body">Custom Credentials</Label>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Add unique skills or certifications (type and press Enter)
          </p>
        </div>
        <TagInput
          tags={formData.customQualifications}
          onTagsChange={(tags) => onFormDataChange({ ...formData, customQualifications: tags })}
          placeholder="e.g., Specialist in Patent Law for Startups"
          maxTags={5}
        />
      </div>

      {/* Bio */}
      <div className="grid gap-2">
        <Label htmlFor="tutor-bio" className="font-body">Bio</Label>
        <Textarea
          id="tutor-bio"
          rows={4}
          value={formData.bio}
          onChange={(e) => onFormDataChange({ ...formData, bio: e.target.value })}
          className="font-body"
          placeholder="A brief description of the tutor's background and teaching approach..."
        />
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button onClick={onSubmit} className="w-full font-body">
          {submitLabel}
        </Button>
      </motion.div>
    </div>
  );
}