import {
  Boxes,
  Database,
  Github,
  Layers3,
  Network,
  TableProperties,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { PostgresLogo, RedisLogo } from "@/components/icons/service-logos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolIcon = ComponentType<SVGProps<SVGSVGElement>>;

const toolItems = [
  {
    label: "GitHub",
    icon: Github,
    active: true,
    className: "text-primary-foreground",
  },
  {
    label: "Postgres",
    icon: PostgresLogo,
    active: false,
    className: "text-sky-300",
  },
  {
    label: "Redis",
    icon: RedisLogo,
    active: false,
    className: "text-red-300",
  },
  {
    label: "MongoDB",
    icon: Database,
    active: false,
    className: "text-emerald-300",
  },
  {
    label: "Package",
    icon: Boxes,
    active: false,
    className: "text-slate-300",
  },
  {
    label: "Tables",
    icon: TableProperties,
    active: false,
    className: "text-amber-300",
  },
  {
    label: "Network",
    icon: Network,
    active: false,
    className: "text-teal-300",
  },
  {
    label: "Layers",
    icon: Layers3,
    active: false,
    className: "text-violet-300",
  },
] satisfies Array<{
  label: string;
  icon: ToolIcon;
  active: boolean;
  className: string;
}>;

export function LeftRail() {
  return (
    <aside className="pointer-events-none absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 sm:block lg:left-4">
      <nav
        className="pointer-events-auto flex w-16 flex-col items-center gap-1 rounded-lg border border-border bg-popover/95 p-1.5 shadow-panel backdrop-blur"
        aria-label="Tools"
      >
        {toolItems.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={item.label}
            title={item.label}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "size-12 rounded-md hover:bg-muted/70",
              item.className,
              item.active &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            )}
          >
            <item.icon className="size-7" aria-hidden="true" />
          </Button>
        ))}
      </nav>
    </aside>
  );
}
