import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LogIn, ArrowLeft } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 border-b border-border/40">
        <div className="container">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card className="p-12 space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <LogIn size={32} className="text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-foreground/60">
                Sign in to access the article management system and manage your content.
              </p>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full gap-2 text-base"
            >
              <LogIn size={18} />
              Sign in with OAuth
            </Button>

            {/* Info Box */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-2">
              <h3 className="font-medium text-sm">What you can do after signing in:</h3>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>✓ Create and publish articles</li>
                <li>✓ Edit existing articles</li>
                <li>✓ Manage article drafts</li>
                <li>✓ Delete articles</li>
                <li>✓ Access the admin dashboard</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-foreground/50 space-y-2">
              <p>Only the website owner can access the article management system.</p>
              <p>Your login information is secure and handled by OAuth.</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
