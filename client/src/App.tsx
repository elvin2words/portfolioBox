import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Builder from "@/pages/builder";
import Dashboard from "@/pages/dashboard";
import Templates from "@/pages/templates";
import Settings from "@/pages/settings";
import Preview from "@/pages/preview";
import Help from "@/pages/help";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/builder" component={Builder} />
      <Route path="/templates" component={Templates} />
      <Route path="/settings" component={Settings} />
      <Route path="/preview" component={Preview} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
