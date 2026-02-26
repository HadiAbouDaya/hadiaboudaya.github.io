import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
