import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();
const NewInvitationPage = lazy(() => import("./pages/NewInvitationPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const ImInPage = lazy(() => import("./pages/ImInPage.tsx"));
const ImOutPage = lazy(() => import("./pages/ImOutPage.tsx"));

const RouteFallback = () => (
  <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,hsl(var(--navy-deep))_0%,hsl(var(--slate-luxe))_100%)] px-6 text-cream">
    <div className="text-center">
      <p className="text-label-premium text-gold/72">Carregando</p>
      <p className="mt-4 font-headline text-4xl">Preparando a experiência.</p>
    </div>
  </main>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new" element={<NewInvitationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/im-in" element={<ImInPage />} />
            <Route path="/im-out" element={<ImOutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
