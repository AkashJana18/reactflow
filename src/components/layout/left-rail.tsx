import {
  Activity,
  Database,
  GitBranch,
  LayoutDashboard,
  Server,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Graph", icon: GitBranch, active: true },
  { label: "Services", icon: Server, active: false },
  { label: "Data stores", icon: Database, active: false },
  { label: "Activity", icon: Activity, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function LeftRail() {
  return (
    <aside className="z-20 flex w-16 shrink-0 flex-col items-center border-r border-border bg-card/90 py-3">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-border bg-background">
        <GitBranch className="size-5 text-primary" aria-hidden="true" />
      </div>
      <nav className="flex flex-1 flex-col items-center gap-2" aria-label="Main">
        {navItems.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={item.label}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              item.active &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            )}
          >
            <item.icon className="size-5" aria-hidden="true" />
          </Button>
        ))}
      </nav>
    </aside>
  );
}
