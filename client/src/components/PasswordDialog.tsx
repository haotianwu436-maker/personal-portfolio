import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, X } from "lucide-react";

interface PasswordDialogProps {
  isOpen: boolean;
  onVerify: (password: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function PasswordDialog({
  isOpen,
  onVerify,
  onClose,
  title = "Enter Password",
  description = "This action requires a password to proceed.",
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      onVerify(password);
      setPassword("");
    } catch (err) {
      setError("Incorrect password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{title}</h2>
              <p className="text-sm text-foreground/60">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e as any);
                }
              }}
              disabled={isLoading}
              autoFocus
              className="w-full"
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="flex-1"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-foreground/60">
            Your password is stored locally in your browser and never sent to the server.
          </p>
        </div>
      </Card>
    </div>
  );
}
