import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail";
import Messages from "./pages/Messages";
import ArticleEdit from "./pages/ArticleEdit";
import ArticleCreate from "./pages/ArticleCreate";
import ArticleManagement from "./pages/ArticleManagement";
import Login from "./pages/Login";
import ProjectEdit from "./pages/ProjectEdit";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/projects/:id/edit" component={ProjectEdit} />
      <Route path="/blog" component={Blog} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      <Route path="/articles/:id/edit" component={ArticleEdit} />
      <Route path="/admin/articles/create" component={ArticleCreate} />
      <Route path="/admin/articles/:id/edit" component={ArticleEdit} />
      <Route path="/admin/articles" component={ArticleManagement} />
      <Route path="/login" component={Login} />
      <Route path="/messages" component={Messages} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider defaultLanguage="zh">
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
