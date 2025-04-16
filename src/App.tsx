import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import StockExplorer from "./pages/StockExplorer";
import StockDetail from "./pages/StockDetail";
import Watchlist from "./pages/Watchlist";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Insights from "./pages/Insights";
import AIChat from "./pages/AIChat";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/explorer" element={
                <ProtectedRoute>
                  <StockExplorer />
                </ProtectedRoute>
              } />
              <Route path="/insights" element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              } />
              <Route path="/stock/:symbol" element={
                <ProtectedRoute>
                  <StockDetail />
                </ProtectedRoute>
              } />
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/ai-chat" element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotButton />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
