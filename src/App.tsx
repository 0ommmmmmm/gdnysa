import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import Mentor from "./pages/Mentor";
import Resources from "./pages/Resources";
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import Store from "./pages/Store";
import Tours from "./pages/Tours";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminKnowledge from "./pages/admin/AdminKnowledge";
import NotFound from "./pages/NotFound";
import { ProgramModalProvider } from "./components/programs/ProgramModalProvider";
import { ChatWidget } from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProgramModalProvider>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Index />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/store" element={<Store />} />
          <Route path="/tours" element={<Tours />} />

          {/* Admin */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <AdminProtectedRoute>
                <AdminApplications />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/knowledge"
            element={
              <AdminProtectedRoute>
                <AdminKnowledge />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminProtectedRoute>
                <AdminMessages />
              </AdminProtectedRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
        </ProgramModalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
