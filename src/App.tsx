import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TutorProvider } from "@/contexts/TutorContext";
import { lazy, Suspense, memo } from "react";
import { Loader2 } from "lucide-react";

// Lazy load all pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/Auth"));
const NCEAPage = lazy(() => import("./pages/highschool/NCEA"));
const CambridgePage = lazy(() => import("./pages/highschool/Cambridge"));
const IBPage = lazy(() => import("./pages/highschool/IB"));
const MedicalPage = lazy(() => import("./pages/university/Medical"));
const ComputerSciencePage = lazy(() => import("./pages/university/ComputerScience"));
const LawPage = lazy(() => import("./pages/university/Law"));
const OurTeamPage = lazy(() => import("./pages/OurTeam"));
const TutorManagementPage = lazy(() => import("./pages/admin/TutorManagement"));
const StudentRatingsPage = lazy(() => import("./pages/admin/StudentRatings"));
const CalendarPage = lazy(() => import("./pages/admin/Calendar"));
const RolesManagementPage = lazy(() => import("./pages/admin/RolesManagement"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const AddChildAccountPage = lazy(() => import("./pages/AddChildAccount"));
const EnquirePage = lazy(() => import("./pages/Enquire"));
const MyBookingsPage = lazy(() => import("./pages/tutor/MyBookings"));
const MyAvailabilityPage = lazy(() => import("./pages/tutor/MyAvailability"));
const TutorStudentRatingsPage = lazy(() => import("./pages/tutor/TutorStudentRatings"));

// Loading fallback component
const PageLoader = memo(() => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
));
PageLoader.displayName = "PageLoader";

// Configure QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component with providers
const App = memo(() => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TutorProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/highschool/ncea" element={<NCEAPage />} />
                <Route path="/highschool/cambridge" element={<CambridgePage />} />
                <Route path="/highschool/ib" element={<IBPage />} />
                <Route path="/university/medical" element={<MedicalPage />} />
                <Route path="/university/computer-science" element={<ComputerSciencePage />} />
                <Route path="/university/law" element={<LawPage />} />
                <Route path="/our-team" element={<OurTeamPage />} />
                <Route path="/admin/tutors" element={<TutorManagementPage />} />
                <Route path="/admin/students" element={<StudentRatingsPage />} />
                <Route path="/admin/calendar" element={<CalendarPage />} />
                <Route path="/admin/roles" element={<RolesManagementPage />} />
                <Route path="/tutor/bookings" element={<MyBookingsPage />} />
                <Route path="/tutor/availability" element={<MyAvailabilityPage />} />
                <Route path="/tutor/students" element={<TutorStudentRatingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/add-child-account" element={<AddChildAccountPage />} />
                <Route path="/enquire" element={<EnquirePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </TutorProvider>
    </AuthProvider>
  </QueryClientProvider>
));
App.displayName = "App";

export default App;
