import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSession } from "@/services/adminAuth";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let active = true;

    const check = () => {
      getAdminSession()
        .then((session) => active && setStatus(session ? "in" : "out"))
        .catch(() => active && setStatus("out"));
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;
      if (event === "SIGNED_OUT") setStatus("out");
      else check();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "out") return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
