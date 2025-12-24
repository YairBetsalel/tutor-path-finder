import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TutorCard } from '@/components/tutors/TutorCard';
import { useTutors } from '@/contexts/TutorContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function OurTeamPage() {
  const { tutors } = useTutors();
  const [positionFilter, setPositionFilter] = useState<'All' | 'Tutor' | 'Management'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesPosition =
        positionFilter === 'All' || tutor.position === positionFilter;
      const matchesSearch =
        searchQuery === '' ||
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.qualifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [tutors, positionFilter, searchQuery]);

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Our Team
            </h1>
            <p className="mt-6 font-body text-lg text-muted-foreground">
              Meet our exceptional team of educators, specialists, and mentors dedicated to helping you succeed.
            </p>
          </div>

          {/* Filters */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Position Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={positionFilter === 'All' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPositionFilter('All')}
                  className="font-body"
                >
                  All
                </Button>
                <Button
                  variant={positionFilter === 'Management' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPositionFilter('Management')}
                  className="font-body"
                >
                  Management
                </Button>
                <Button
                  variant={positionFilter === 'Tutor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPositionFilter('Tutor')}
                  className="font-body"
                >
                  Tutors
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or qualification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-body"
                />
              </div>
            </div>
          </div>

          {/* Tutor Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>

          {filteredTutors.length === 0 && (
            <div className="mt-12 text-center">
              <p className="font-body text-muted-foreground">
                No tutors found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
