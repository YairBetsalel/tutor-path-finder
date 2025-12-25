import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Search, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface StudentResult {
  id: string;
  first_name: string;
  last_name: string;
}

export default function AddChildAccount() {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [studentResult, setStudentResult] = useState<StudentResult | null>(null);
  const [bondingLoading, setBondingLoading] = useState(false);
  const [existingRequests, setExistingRequests] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || userRole !== 'parent')) {
      navigate('/profile');
    }
  }, [user, userRole, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchExistingRequests();
    }
  }, [user]);

  const fetchExistingRequests = async () => {
    const { data } = await supabase
      .from('bond_requests')
      .select('child_id')
      .eq('parent_id', user?.id);
    
    if (data) {
      setExistingRequests(data.map(r => r.child_id));
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a name or email');
      return;
    }

    setSearching(true);
    setStudentResult(null);

    try {
      const { data, error } = await supabase
        .rpc('find_student_by_name_or_email', { search_term: searchTerm.trim() });

      if (error) {
        toast.error('Search failed');
        setSearching(false);
        return;
      }

      const results = data as StudentResult[] | null;
      if (results && results.length > 0) {
        setStudentResult(results[0]);
      } else {
        toast.info('No student found with that exact name or email');
      }
    } catch (err) {
      toast.error('Search failed');
    }

    setSearching(false);
  };

  const handleBondRequest = async () => {
    if (!studentResult || !user) return;

    setBondingLoading(true);

    try {
      // Check if already bonded
      const { data: existingBond } = await supabase
        .from('parent_child_bonds')
        .select('id')
        .eq('parent_id', user.id)
        .eq('child_id', studentResult.id)
        .maybeSingle();

      if (existingBond) {
        toast.error('You are already bonded with this student');
        setBondingLoading(false);
        return;
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('bond_requests')
        .select('id, status')
        .eq('parent_id', user.id)
        .eq('child_id', studentResult.id)
        .maybeSingle();

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.info('A request is already pending for this student');
        } else if (existingRequest.status === 'denied') {
          toast.error('Your previous request was denied');
        }
        setBondingLoading(false);
        return;
      }

      // Create bond request
      const { error } = await supabase
        .from('bond_requests')
        .insert({
          parent_id: user.id,
          child_id: studentResult.id,
        });

      if (error) {
        toast.error('Failed to send bond request');
      } else {
        toast.success('Bond request sent! The student will need to approve it.');
        setStudentResult(null);
        setSearchTerm('');
        fetchExistingRequests();
      }
    } catch (err) {
      toast.error('Failed to send bond request');
    }

    setBondingLoading(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Add Child Account
            </h1>
            <p className="mt-2 font-body text-muted-foreground">
              Search for your child's account by their exact name or email address.
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Search className="h-5 w-5 text-primary" />
                Search for Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 font-body text-sm text-muted-foreground">
                For privacy, you must enter the student's exact full name or email address.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="searchTerm" className="font-body">
                    Student's Full Name or Email
                  </Label>
                  <Input
                    id="searchTerm"
                    type="text"
                    placeholder="John Smith or john@example.com"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="mt-1 font-body"
                  />
                </div>
                
                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full font-body"
                >
                  {searching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              {studentResult && (
                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        {studentResult.first_name} {studentResult.last_name}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        Student Account
                      </p>
                    </div>
                    <Button
                      onClick={handleBondRequest}
                      disabled={bondingLoading || existingRequests.includes(studentResult.id)}
                      className="font-body"
                    >
                      {bondingLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      {existingRequests.includes(studentResult.id) ? 'Request Sent' : 'Bond'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-4 text-center font-body text-sm text-muted-foreground">
            Once you send a bond request, the student will need to approve it on their next login.
          </p>
        </div>
      </section>
    </Layout>
  );
}