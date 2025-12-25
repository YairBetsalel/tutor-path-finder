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
  const { user, profile, isAdmin, signOut, userRole, bondedChildren } = useAuth();
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="font-display text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">SparkedEducation</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Highschool Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 font-body">
                Highschool <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-popover">
              <DropdownMenuItem asChild>
                <Link to="/highschool/ncea" className="w-full cursor-pointer">NCEA</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/highschool/cambridge" className="w-full cursor-pointer">Cambridge</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/highschool/ib" className="w-full cursor-pointer">IB</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* University Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 font-body">
                University <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-popover">
              <DropdownMenuItem asChild>
                <Link to="/university/medical" className="w-full cursor-pointer">Medical</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/university/computer-science" className="w-full cursor-pointer">Computer Science</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/university/law" className="w-full cursor-pointer">Law</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" asChild className="font-body">
            <Link to="/our-team">Our Team</Link>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleEnquire}
            className="ml-2 border-secondary font-body text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            Enquire Now
          </Button>

          {/* Admin Dropdown - only show if admin */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 font-body">
                  Admin <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/admin/tutors" className="w-full cursor-pointer">Tutors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/students" className="w-full cursor-pointer">Student Ratings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/calendar" className="w-full cursor-pointer">Calendar</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/roles" className="w-full cursor-pointer">Roles</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Auth */}
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="ml-3 flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
                  style={{ backgroundColor: profile.avatar_color }}
                >
                  {profile.avatar_letter}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                {userRole === 'parent' ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/add-child-account" className="w-full cursor-pointer">Add Child Account</Link>
                    </DropdownMenuItem>
                    {bondedChildren.map((child) => (
                      <DropdownMenuItem key={child.id} asChild>
                        <Link to="/profile" className="w-full cursor-pointer">
                          {child.first_name || 'Child'}'s Profile
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="ml-3 font-body">
              <Link to="/auth">Login / Signup</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 hover:bg-muted md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-slide-down border-b border-border bg-background md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Highschool</p>
              <Link to="/highschool/ncea" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>NCEA</Link>
              <Link to="/highschool/cambridge" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Cambridge</Link>
              <Link to="/highschool/ib" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>IB</Link>
            </div>
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">University</p>
              <Link to="/university/medical" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Medical</Link>
              <Link to="/university/computer-science" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Computer Science</Link>
              <Link to="/university/law" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Law</Link>
            </div>
            <div className="border-t border-border pt-2">
              <Link to="/our-team" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Our Team</Link>
              <button onClick={() => { handleEnquire(); setMobileMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-secondary hover:bg-muted">Enquire Now</button>
            </div>
            {isAdmin && (
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
                <Link to="/admin/tutors" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Tutors</Link>
                <Link to="/admin/students" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Student Ratings</Link>
                <Link to="/admin/calendar" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
                <Link to="/admin/roles" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Roles</Link>
              </div>
            )}
            <div className="border-t border-border pt-2">
              {user && profile ? (
                <>
                  {userRole === 'parent' ? (
                    <>
                      <Link to="/add-child-account" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Add Child Account</Link>
                      {bondedChildren.map((child) => (
                        <Link key={child.id} to="/profile" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                          {child.first_name || 'Child'}'s Profile
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link to="/profile" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="block w-full rounded-lg bg-primary px-3 py-2 text-center text-primary-foreground" onClick={() => setMobileMenuOpen(false)}>Login / Signup</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
