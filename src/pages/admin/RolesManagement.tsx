import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Shield, User, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type AppRole = 'admin' | 'student' | 'parent';

interface UserWithRole {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_color: string;
  avatar_letter: string;
  role: AppRole;
  email?: string;
}

const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/20 text-destructive',
  student: 'bg-primary/20 text-primary',
  parent: 'bg-secondary/20 text-secondary-foreground',
};

const roleIcons: Record<AppRole, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  student: <User className="h-4 w-4" />,
  parent: <Users className="h-4 w-4" />,
};

export default function RolesManagementPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Get all profiles with their roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      toast.error('Failed to load users');
      setLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      toast.error('Failed to load roles');
      setLoading(false);
      return;
    }

    // Create a map of user_id to role
    const roleMap = new Map<string, AppRole>();
    roles?.forEach((r) => {
      roleMap.set(r.user_id, r.role as AppRole);
    });

    // Combine profiles with roles
    const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_color: profile.avatar_color || '#0A4D4A',
      avatar_letter: profile.avatar_letter || 'U',
      role: roleMap.get(profile.id) || 'student',
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: AppRole) => {
    if (userId === user?.id) {
      toast.error("You can't change your own role");
      return;
    }

    setUpdatingUser(userId);

    // First, delete existing role
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Insert new role
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: newRole });

    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }

    setUpdatingUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (authLoading || loading) {
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
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground">
              Role Management
            </h1>
            <p className="mt-2 font-body text-muted-foreground">
              Manage user roles across the platform.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-body"
              />
            </div>
          </motion.div>

          {/* Role Stats */}
          <motion.div
            className="mb-8 grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {(['admin', 'student', 'parent'] as AppRole[]).map((role) => (
              <Card key={role} className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`rounded-full p-2 ${roleColors[role]}`}>
                    {roleIcons[role]}
                  </div>
                  <div>
                    <p className="font-body text-sm text-muted-foreground capitalize">
                      {role}s
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {users.filter((u) => u.role === role).length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* User List */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="font-display">All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredUsers.map((userItem, index) => (
                    <motion.div
                      key={userItem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-primary-foreground"
                          style={{ backgroundColor: userItem.avatar_color }}
                        >
                          {userItem.avatar_letter}
                        </div>
                        <div>
                          <p className="font-display font-medium">
                            {userItem.first_name || 'Unknown'}{' '}
                            {userItem.last_name || ''}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`mt-1 ${roleColors[userItem.role]}`}
                          >
                            {roleIcons[userItem.role]}
                            <span className="ml-1 capitalize">{userItem.role}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {userItem.id === user?.id ? (
                          <span className="font-body text-sm text-muted-foreground">
                            (You)
                          </span>
                        ) : (
                          <Select
                            value={userItem.role}
                            onValueChange={(value: AppRole) =>
                              updateRole(userItem.id, value)
                            }
                            disabled={updatingUser === userItem.id}
                          >
                            <SelectTrigger className="w-[130px] font-body">
                              {updatingUser === userItem.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="font-body text-muted-foreground">
                      No users found matching "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
