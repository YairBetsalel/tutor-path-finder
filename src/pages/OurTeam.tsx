import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { TutorCard } from '@/components/tutors/TutorCard';
import { useTutors } from '@/contexts/TutorContext';
import { Input } from '@/components/ui/input';
import { AnimatedToggle } from '@/components/ui/animated-toggle';
import { StaggeredContainer, StaggeredItem } from '@/components/ui/staggered-container';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import { SUBJECTS, getQualificationsForSubject, Subject } from '@/lib/qualifications';

export default function OurTeamPage() {
  const { tutors } = useTutors();
  const [showManagement, setShowManagement] = useState(true);
  const [showTutors, setShowTutors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);

  const subjectQualifications = useMemo(() => 
    getQualificationsForSubject(selectedSubject),
    [selectedSubject]
  );

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // Position filter (AND logic)
      const matchesPosition =
        (showManagement && tutor.position === 'Management') ||
        (showTutors && tutor.position === 'Tutor');
      
      if (!matchesPosition) return false;

      // Subject filter (AND logic)
      if (selectedSubject && tutor.subject !== selectedSubject) {
        return false;
      }

      // Qualification filter (OR logic within selected qualifications)
      if (selectedQualifications.length > 0) {
        const allTutorQuals = [...tutor.standardQualifications, ...tutor.customQualifications];
        const hasMatchingQual = selectedQualifications.some(qual =>
          allTutorQuals.some(tq => tq.toLowerCase().includes(qual.toLowerCase()))
        );
        if (!hasMatchingQual) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const allQuals = [...tutor.standardQualifications, ...tutor.customQualifications].join(' ').toLowerCase();
        return (
          tutor.name.toLowerCase().includes(query) ||
          allQuals.includes(query) ||
          tutor.bio.toLowerCase().includes(query) ||
          tutor.subject.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tutors, showManagement, showTutors, searchQuery, selectedSubject, selectedQualifications]);

  const toggleQualification = (qual: string) => {
    setSelectedQualifications(prev =>
      prev.includes(qual)
        ? prev.filter(q => q !== qual)
        : [...prev, qual]
    );
  };

  const handleSubjectChange = (subject: Subject | null) => {
    setSelectedSubject(subject);
    // Don't reset qualifications - allow multi-category selection
  };

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Our Team
            </h1>
            <p className="mt-6 font-body text-lg text-muted-foreground">
              Meet our exceptional team of educators, specialists, and mentors dedicated to helping you succeed.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mx-auto mt-12 max-w-4xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Position & Search Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Position Toggles */}
              <div className="flex gap-6">
                <AnimatedToggle
                  checked={showManagement}
                  onCheckedChange={setShowManagement}
                  label="Management"
                />
                <AnimatedToggle
                  checked={showTutors}
                  onCheckedChange={setShowTutors}
                  label="Tutors"
                />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, subject, or qualification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 font-body sm:w-80"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div className="space-y-3">
              <h3 className="font-body text-sm font-medium text-foreground">Filter by Subject</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => handleSubjectChange(null)}
                  className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                    selectedSubject === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  All Subjects
                </motion.button>
                {SUBJECTS.filter(s => s !== 'General').map((subject) => (
                  <motion.button
                    key={subject}
                    onClick={() => handleSubjectChange(subject)}
                    className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                      selectedSubject === subject
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {subject}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dynamic Qualification Toggles */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSubject || 'general'}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <h3 className="font-body text-sm font-medium text-foreground">
                  {selectedSubject ? `${selectedSubject} Qualifications` : 'General Qualifications'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subjectQualifications.map((qual, index) => (
                    <motion.div
                      key={qual}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <AnimatedToggle
                        checked={selectedQualifications.includes(qual)}
                        onCheckedChange={() => toggleQualification(qual)}
                        label={qual}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Tutor Grid */}
          <AnimatePresence mode="wait">
            {filteredTutors.length > 0 ? (
              <StaggeredContainer
                key={`grid-${selectedSubject}-${selectedQualifications.join('-')}`}
                className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                animationKey={`${selectedSubject}-${searchQuery}`}
              >
                {filteredTutors.map((tutor) => (
                  <StaggeredItem key={tutor.id}>
                    <TutorCard tutor={tutor} />
                  </StaggeredItem>
                ))}
              </StaggeredContainer>
            ) : (
              <EmptyState
                title="No tutors found"
                description="Try adjusting your filters or search terms to find the right tutor for you."
                type="search"
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
