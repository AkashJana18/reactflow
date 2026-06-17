import { memo, useState } from "react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import {
  Braces,
  Cloud,
  Database,
  GitBranch,
  HardDrive,
  MemoryStick,
  Server,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { PostgresLogo, RedisLogo } from "@/components/icons/service-logos";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getResourceDefinition,
  getResourcePercent,
  resourceDefinitions,
  type ResourceMetric,
} from "@/lib/service-resources";
import { useGraphBuilderStore } from "@/store/use-graph-builder-store";
import type {
  ServiceKind,
  ServiceNodeData,
  ServiceEdge,
  ServiceNode,
  ServiceStatus,
} from "@/types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const kindIcon: Record<ServiceKind, IconComponent> = {
  api: Braces,
  database: Database,
  cache: Cloud,
  worker: GitBranch,
  gateway: ShieldCheck,
};

const resourceIcons: Record<ResourceMetric, IconComponent> = {
  cpu: Settings,
  memoryGb: MemoryStick,
  diskGb: HardDrive,
  replicas: Server,
};

const statusBadge: Record<ServiceStatus, "healthy" | "degraded" | "down"> = {
  Healthy: "healthy",
  Degraded: "degraded",
  Down: "down",
};

const statusLabel: Record<ServiceStatus, string> = {
  Healthy: "Success",
  Degraded: "Warning",
  Down: "Error",
};

function ServiceNodeComponent({ id, data, selected }: NodeProps<ServiceNode>) {
  const [activeMetric, setActiveMetric] = useState<ResourceMetric>("cpu");
  const { deleteElements } = useReactFlow<ServiceNode, ServiceEdge>();
  const setSelectedNodeId = useGraphBuilderStore(
    (state) => state.setSelectedNodeId,
  );
  const setMobilePanelOpen = useGraphBuilderStore(
    (state) => state.setMobilePanelOpen,
  );
  const setActiveInspectorTab = useGraphBuilderStore(
    (state) => state.setActiveInspectorTab,
  );
  const KindIcon = getKindIcon(data);
  const hasBrandLogo = hasDatabaseLogo(data);
  const activeDefinition = getResourceDefinition(activeMetric);
  const activeValue = activeDefinition.getValue(data);
  const activePercent = getResourcePercent(data, activeMetric);

  function handleOpenSettings(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setSelectedNodeId(id);
    setActiveInspectorTab("config");

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobilePanelOpen(true);
    }
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void deleteElements({ nodes: [{ id }] });
  }

  return (
    <article
      className={cn(
        "w-[20rem] rounded-lg border border-border bg-card/95 p-4 text-card-foreground shadow-panel transition-shadow",
        selected && "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !border-2 !border-background !bg-primary"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !border-2 !border-background !bg-primary"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
            <KindIcon
              className={cn(hasBrandLogo ? "size-7" : "size-5")}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{data.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {data.runtimeVersion} / {data.region}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-1">
          <button
            type="button"
            aria-label={`Open settings for ${data.name}`}
            title="Settings"
            className="nodrag nopan inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleOpenSettings}
          >
            <Settings className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${data.name}`}
            title="Delete"
            className="nodrag nopan inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleDelete}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-4 gap-2 text-center text-xs"
        role="tablist"
        aria-label={`${data.name} resources`}
      >
        {resourceDefinitions.map((definition) => {
          const Icon = resourceIcons[definition.key];
          const isActive = activeMetric === definition.key;

          return (
            <button
              key={definition.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                "nodrag nopan min-w-0 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "bg-muted text-foreground" : "bg-muted/60 hover:bg-muted/70",
              )}
              onClick={(event) => {
                event.stopPropagation();
                setActiveMetric(definition.key);
              }}
            >
              <span className="block truncate px-1 pt-1 text-muted-foreground">
                {definition.formatValue(definition.getValue(data))}
              </span>
              <span className="mt-2 flex h-9 items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] text-foreground">
                <Icon
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate">{definition.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-destructive transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${activePercent}%` }}
          />
        </div>
        <div className="min-w-12 rounded-md border border-border bg-background px-2 py-1 text-right text-xs">
          {activeDefinition.formatValue(activeValue)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge variant={statusBadge[data.status]}>{statusLabel[data.status]}</Badge>
        <Badge variant={statusBadge[data.status]} className="shrink-0">
          ${data.costPerHour.toFixed(2)}/HR
        </Badge>
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          {data.provider}
        </span>
      </div>
    </article>
  );
}

function getKindIcon(data: ServiceNodeData): IconComponent {
  if (isPostgresNode(data)) {
    return PostgresLogo;
  }

  if (isRedisNode(data)) {
    return RedisLogo;
  }

  return kindIcon[data.kind];
}

function hasDatabaseLogo(data: ServiceNodeData) {
  return isPostgresNode(data) || isRedisNode(data);
}

function isPostgresNode(data: ServiceNodeData) {
  return getSearchableNodeText(data).includes("postgres");
}

function isRedisNode(data: ServiceNodeData) {
  return getSearchableNodeText(data).includes("redis");
}

function getSearchableNodeText(data: ServiceNodeData) {
  return `${data.name} ${data.runtimeVersion} ${data.description}`.toLowerCase();
}

export const ServiceNodeCard = memo(ServiceNodeComponent);
