import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Circle, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

type NavItem = {
  to: "/" | "/chapters" | "/tasbih" | "/favorites" | "/settings";
  label: string;
  icon: typeof Home;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/chapters", label: "Chapters", icon: LayoutGrid },
  { to: "/tasbih", label: "Tasbih", icon: Circle },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background flex justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col min-h-dvh relative">
        <main className="flex-1 pb-24 pt-2">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md px-3 pb-3">
            <div className="card-azkar grid grid-cols-5 px-2 py-2 shadow-soft backdrop-blur-md bg-card/95">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors text-[10px] font-medium",
                      active ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active && "stroke-[2.2]")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
