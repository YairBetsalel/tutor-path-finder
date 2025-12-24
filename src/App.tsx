import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TutorProvider } from "@/contexts/TutorContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NCEAPage from "./pages/highschool/NCEA";
import CambridgePage from "./pages/highschool/Cambridge";
import IBPage from "./pages/highschool/IB";
import MedicalPage from "./pages/university/Medical";
import ComputerSciencePage from "./pages/university/ComputerScience";
import LawPage from "./pages/university/Law";
import OurTeamPage from "./pages/OurTeam";
import TutorManagementPage from "./pages/admin/TutorManagement";
import CalendarPage from "./pages/admin/Calendar";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TutorProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/highschool/ncea" element={<NCEAPage />} />
              <Route path="/highschool/cambridge" element={<CambridgePage />} />
              <Route path="/highschool/ib" element={<IBPage />} />
              <Route path="/university/medical" element={<MedicalPage />} />
              <Route path="/university/computer-science" element={<ComputerSciencePage />} />
              <Route path="/university/law" element={<LawPage />} />
              <Route path="/our-team" element={<OurTeamPage />} />
              <Route path="/admin/tutors" element={<TutorManagementPage />} />
              <Route path="/admin/calendar" element={<CalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TutorProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
