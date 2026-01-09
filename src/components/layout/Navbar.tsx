import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, isTutor, signOut, userRole, bondedChildren } = useAuth();
  const navigate = useNavigate();

  const handleEnquire = () => {
    toast.info('Coming Soon', {
      description: 'The enquiry system is currently under development. Check back soon!',
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Goodbye!', {
      description: 'You have been logged out.',
    });
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-display text-xl font-medium tracking-tight text-foreground">Tutorly</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Highschool Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 font-body text-sm font-light text-muted-foreground hover:text-foreground">
                Highschool <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 border-border bg-card">
              <DropdownMenuItem asChild>
                <Link to="/highschool/ncea" className="w-full cursor-pointer font-body text-sm font-light">NCEA</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/highschool/cambridge" className="w-full cursor-pointer font-body text-sm font-light">Cambridge</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/highschool/ib" className="w-full cursor-pointer font-body text-sm font-light">IB</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* University Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 font-body text-sm font-light text-muted-foreground hover:text-foreground">
                University <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 border-border bg-card">
              <DropdownMenuItem asChild>
                <Link to="/university/medical" className="w-full cursor-pointer font-body text-sm font-light">Medical</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/university/computer-science" className="w-full cursor-pointer font-body text-sm font-light">Computer Science</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/university/law" className="w-full cursor-pointer font-body text-sm font-light">Law</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" asChild className="font-body text-sm font-light text-muted-foreground hover:text-foreground">
            <Link to="/our-team">Our Team</Link>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleEnquire}
            className="ml-4 border-primary/50 font-body text-sm font-light text-primary hover:border-primary hover:bg-primary/10 hover:text-accent"
          >
            Enquire Now
          </Button>

          {/* Admin Dropdown - only show if admin */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 font-body text-sm font-light text-muted-foreground hover:text-foreground">
                  Admin <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 border-border bg-card">
                <DropdownMenuItem asChild>
                  <Link to="/admin/tutors" className="w-full cursor-pointer font-body text-sm font-light">Tutors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/students" className="w-full cursor-pointer font-body text-sm font-light">Student Ratings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/calendar" className="w-full cursor-pointer font-body text-sm font-light">Calendar</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/roles" className="w-full cursor-pointer font-body text-sm font-light">Roles</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Tutor Dropdown - only show if tutor */}
          {isTutor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 font-body text-sm font-light text-muted-foreground hover:text-foreground">
                  Tutor <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 border-border bg-card">
                <DropdownMenuItem asChild>
                  <Link to="/tutor/bookings" className="w-full cursor-pointer font-body text-sm font-light">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tutor/availability" className="w-full cursor-pointer font-body text-sm font-light">My Availability</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tutor/students" className="w-full cursor-pointer font-body text-sm font-light">Student Ratings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Auth */}
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="ml-4 flex h-9 w-9 items-center justify-center rounded-full border border-border font-display text-sm font-medium text-foreground transition-all hover:border-primary hover:shadow-glow"
                  style={{ backgroundColor: profile.avatar_color }}
                >
                  {profile.avatar_letter}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border bg-card">
                {userRole === 'parent' ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/add-child-account" className="w-full cursor-pointer font-body text-sm font-light">Add Child Account</Link>
                    </DropdownMenuItem>
                    {bondedChildren.map((child) => (
                      <DropdownMenuItem key={child.id} asChild>
                        <Link to="/profile" className="w-full cursor-pointer font-body text-sm font-light">
                          {child.first_name || 'Child'}'s Profile
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer font-body text-sm font-light">My Profile</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-body text-sm font-light">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="ml-4 bg-primary font-body text-sm font-normal text-primary-foreground hover:bg-accent">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-slide-down border-b border-border bg-background md:hidden">
          <div className="container mx-auto space-y-4 px-4 py-6">
            <div className="space-y-1">
              <p className="text-caps px-3 text-muted-foreground">Highschool</p>
              <Link to="/highschool/ncea" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>NCEA</Link>
              <Link to="/highschool/cambridge" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Cambridge</Link>
              <Link to="/highschool/ib" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>IB</Link>
            </div>
            <div className="space-y-1">
              <p className="text-caps px-3 text-muted-foreground">University</p>
              <Link to="/university/medical" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Medical</Link>
              <Link to="/university/computer-science" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Computer Science</Link>
              <Link to="/university/law" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Law</Link>
            </div>
            <div className="border-t border-border pt-4">
              <Link to="/our-team" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Our Team</Link>
              <button onClick={() => { handleEnquire(); setMobileMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm font-light text-primary hover:bg-muted">Enquire Now</button>
            </div>
            {isAdmin && (
              <div className="space-y-1">
                <p className="text-caps px-3 text-muted-foreground">Admin</p>
                <Link to="/admin/tutors" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Tutors</Link>
                <Link to="/admin/students" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Student Ratings</Link>
                <Link to="/admin/calendar" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
                <Link to="/admin/roles" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Roles</Link>
              </div>
            )}
            {isTutor && (
              <div className="space-y-1">
                <p className="text-caps px-3 text-muted-foreground">Tutor</p>
                <Link to="/tutor/bookings" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
                <Link to="/tutor/availability" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>My Availability</Link>
                <Link to="/tutor/students" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Student Ratings</Link>
              </div>
            )}
            <div className="border-t border-border pt-4">
              {user && profile ? (
                <>
                  {userRole === 'parent' ? (
                    <>
                      <Link to="/add-child-account" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Add Child Account</Link>
                      {bondedChildren.map((child) => (
                        <Link key={child.id} to="/profile" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                          {child.first_name || 'Child'}'s Profile
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link to="/profile" className="block rounded-lg px-3 py-2 font-body text-sm font-light text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm font-light text-foreground hover:bg-muted">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="block w-full rounded-lg bg-primary px-3 py-2 text-center font-body text-sm font-normal text-primary-foreground" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
