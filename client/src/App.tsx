import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Befolkning from "./pages/Befolkning";
import Kommuner from "./pages/Kommuner";
import Arbetsmarknad from "./pages/Arbetsmarknad";
import OmProjektet from "./pages/OmProjektet";
import Sidebar from "./components/Sidebar";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/befolkning"} component={Befolkning} />
          <Route path={"/kommuner"} component={Kommuner} />
          <Route path={"/arbetsmarknad"} component={Arbetsmarknad} />
          <Route path={"/om"} component={OmProjektet} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
