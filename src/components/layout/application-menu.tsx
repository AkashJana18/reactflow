import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AppSummary } from "@/types";

type ApplicationMenuProps = {
  apps?: AppSummary[];
  selectedApp?: AppSummary;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onSelectApp: (appId: string) => void;
  className?: string;
};

type AppVisual = {
  icon: LucideIcon;
  className: string;
};

const appVisuals: Record<string, AppVisual> = {
  "supertokens-golang": {
    icon: Lightbulb,
    className: "bg-indigo-500 text-white",
  },
  "supertokens-java": {
    icon: Settings,
    className: "bg-violet-500 text-white",
  },
  "supertokens-python": {
    icon: Rocket,
    className: "bg-rose-500 text-white",
  },
  "supertokens-ruby": {
    icon: Clipboard,
    className: "bg-fuchsia-500 text-white",
  },
  "supertokens-go": {
    icon: Puzzle,
    className: "bg-purple-500 text-white",
  },
};

const fallbackVisual: AppVisual = {
  icon: Lightbulb,
  className: "bg-primary text-primary-foreground",
};

export function ApplicationMenu({
  apps,
  selectedApp,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onSelectApp,
  className,
}: ApplicationMenuProps) {
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedVisual = getAppVisual(selectedApp);
  const SelectedIcon = selectedVisual.icon;

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!apps?.length) {
      return [];
    }

    if (!normalizedQuery) {
      return apps;
    }

    return apps.filter((app) =>
      [app.name, app.description, app.runtime, app.region]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [apps, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(appId: string) {
    onSelectApp(appId);
    setIsOpen(false);
    setQuery("");
    setNotice(null);
  }

  function handleAddUnavailable() {
    setNotice("Adding applications is not available in this mock.");
  }

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      <button
        type="button"
        className="flex h-14 w-full min-w-0 items-center gap-3 rounded-md border border-border bg-card/90 px-2 text-left shadow-panel transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        <LogoMark />
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md",
            selectedVisual.className,
          )}
          aria-hidden="true"
        >
          <SelectedIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold text-foreground">
            {selectedApp?.name ?? "Loading application"}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp className="size-5 shrink-0 text-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <MoreHorizontal
          className="hidden size-5 shrink-0 text-muted-foreground sm:block"
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-label="Application"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[calc(100vw-1.5rem)] max-w-[38.5rem] overflow-hidden rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-panel sm:p-6"
        >
          <h2 className="text-xl font-semibold text-foreground">Application</h2>

          <div className="mt-5 flex items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Input
                className="h-12 rounded-md bg-muted pr-11 text-base placeholder:text-muted-foreground"
                placeholder="Search..."
                type="search"
                aria-label="Search applications"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setNotice(null);
                }}
              />
              <Search
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <Button
              type="button"
              size="icon"
              className="size-12 shrink-0 rounded-md"
              aria-label="Add application"
              onClick={handleAddUnavailable}
            >
              <Plus className="size-5" aria-hidden="true" />
            </Button>
          </div>

          {notice ? (
            <p className="mt-3 text-sm text-muted-foreground" role="status">
              {notice}
            </p>
          ) : null}

          <div className="mt-5 max-h-[min(26rem,calc(100vh-15rem))] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full" />
                ))}
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  Applications failed to load
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {errorMessage ?? "The mock apps endpoint returned an error."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={onRetry}
                >
                  <RefreshCw aria-hidden="true" />
                  Retry
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && apps?.length === 0 ? (
              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                No applications are available.
              </div>
            ) : null}

            {!isLoading && !isError && apps?.length && filteredApps.length === 0 ? (
              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                No applications match "{query}".
              </div>
            ) : null}

            {!isLoading && !isError && filteredApps.length > 0 ? (
              <div className="space-y-2">
                {filteredApps.map((app) => {
                  const isSelected = app.id === selectedApp?.id;
                  const visual = getAppVisual(app);
                  const AppIcon = visual.icon;

                  return (
                    <button
                      key={app.id}
                      type="button"
                      className={cn(
                        "flex min-h-14 w-full items-center gap-4 rounded-md px-0 py-1 text-left transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover",
                        isSelected && "text-foreground",
                      )}
                      aria-current={isSelected ? "page" : undefined}
                      onClick={() => handleSelect(app.id)}
                    >
                      <span
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-md",
                          visual.className,
                        )}
                        aria-hidden="true"
                      >
                        <AppIcon className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-base font-semibold text-foreground">
                          {app.name}
                        </span>
                      </span>
                      <ChevronRight
                        className="mr-1 size-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getAppVisual(app?: AppSummary): AppVisual {
  if (!app) {
    return fallbackVisual;
  }

  return appVisuals[app.id] ?? {
    icon: fallbackVisual.icon,
    className: `${app.accent} text-white`,
  };
}

function LogoMark() {
  return (
    <span
      className="relative hidden size-11 shrink-0 overflow-hidden rounded-sm border border-border bg-background sm:block"
      aria-hidden="true"
    >
      <span className="absolute -right-5 -top-5 size-14 rounded-full bg-foreground" />
      <span className="absolute -right-2 top-2 size-10 rounded-tl-[2rem] bg-background" />
    </span>
  );
}
