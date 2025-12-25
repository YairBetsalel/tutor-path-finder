import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, UserCheck, UserX } from 'lucide-react';

interface BondRequest {
  id: string;
  parent_id: string;
  parent_name: string;
}

export function BondRequestDialog() {
  const { user, userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<BondRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user && userRole === 'student') {
      fetchPendingRequests();
    }
  }, [user, userRole]);

  const fetchPendingRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bond_requests')
      .select('id, parent_id')
      .eq('child_id', user.id)
      .eq('status', 'pending');

    if (error || !data || data.length === 0) return;

    // Fetch parent profiles
    const parentIds = data.map(r => r.parent_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', parentIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    const requestsWithNames: BondRequest[] = data.map(r => ({
      id: r.id,
      parent_id: r.parent_id,
      parent_name: profileMap.get(r.parent_id)
        ? `${profileMap.get(r.parent_id)?.first_name || ''} ${profileMap.get(r.parent_id)?.last_name || ''}`.trim() || 'Parent'
        : 'Parent',
    }));

    if (requestsWithNames.length > 0) {
      setRequests(requestsWithNames);
      setOpen(true);
    }
  };

  const handleResponse = async (requestId: string, parentId: string, approve: boolean) => {
    setProcessing(requestId);

    try {
      // Update the request status
      const { error: updateError } = await supabase
        .from('bond_requests')
        .update({ status: approve ? 'approved' : 'denied' })
        .eq('id', requestId);

      if (updateError) {
        toast.error('Failed to process request');
        setProcessing(null);
        return;
      }

      // If approved, create the actual bond
      if (approve) {
        const { error: bondError } = await supabase
          .from('parent_child_bonds')
          .insert({
            parent_id: parentId,
            child_id: user?.id,
          });

        if (bondError) {
          toast.error('Failed to create bond');
          setProcessing(null);
          return;
        }

        toast.success('Parent account linked successfully!');
      } else {
        toast.info('Bond request denied');
      }

      // Remove this request from the list
      setRequests(prev => prev.filter(r => r.id !== requestId));
      
      // Close dialog if no more requests
      if (requests.length <= 1) {
        setOpen(false);
      }
    } catch (err) {
      toast.error('Failed to process request');
    }

    setProcessing(null);
  };

  if (!open || requests.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Parent Bond Request</DialogTitle>
          <DialogDescription className="font-body">
            A parent wants to link to your account to view your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
            >
              <div>
                <p className="font-display font-semibold text-foreground">
                  {request.parent_name}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Wants to view your progress
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResponse(request.id, request.parent_id, false)}
                  disabled={processing === request.id}
                  className="font-body"
                >
                  {processing === request.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserX className="mr-1 h-4 w-4" />
                      Deny
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResponse(request.id, request.parent_id, true)}
                  disabled={processing === request.id}
                  className="font-body"
                >
                  {processing === request.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="mr-1 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <p className="font-body text-xs text-muted-foreground">
            Approving will allow the parent to see your lesson progress and metrics.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}