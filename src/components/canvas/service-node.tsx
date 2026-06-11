import { memo } from "react";
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
} from "lucide-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ServiceKind,
  ServiceNode,
  ServiceStatus,
} from "@/types";

const kindIcon: Record<ServiceKind, typeof Server> = {
  api: Braces,
  database: Database,
  cache: Cloud,
  worker: GitBranch,
  gateway: ShieldCheck,
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

function ServiceNodeComponent({ data, selected }: NodeProps<ServiceNode>) {
  const KindIcon = kindIcon[data.kind];

  return (
    <article
      className={cn(
        "w-[19rem] rounded-lg border border-border bg-card/95 p-4 text-card-foreground shadow-panel transition-shadow",
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
            <KindIcon className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{data.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {data.runtimeVersion} / {data.region}
            </p>
          </div>
        </div>
        <Badge variant={statusBadge[data.status]} className="shrink-0">
          ${data.costPerHour.toFixed(2)}/HR
        </Badge>
      </div>

      <dl className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
        <Metric label="CPU" value={String(data.cpu)} icon={Settings} />
        <Metric label="Mem" value={`${data.memoryGb} GB`} icon={MemoryStick} />
        <Metric label="Disk" value={`${data.diskGb} GB`} icon={HardDrive} />
        <Metric label="Rep" value={String(data.replicas)} icon={Server} />
      </dl>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-2 flex-1 rounded-full bg-gradient-to-r from-primary via-accent to-destructive"
          aria-hidden="true"
        >
          <div
            className="h-2 rounded-full bg-background/20"
            style={{ marginLeft: `${data.cpu}%` }}
          />
        </div>
        <div className="min-w-12 rounded-md border border-border bg-background px-2 py-1 text-right text-xs">
          {data.cpu}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge variant={statusBadge[data.status]}>{statusLabel[data.status]}</Badge>
        <span className="text-sm font-semibold text-amber-400">
          {data.provider}
        </span>
      </div>
    </article>
  );
}

type MetricProps = {
  label: string;
  value: string;
  icon: typeof Server;
};

function Metric({ label, value, icon: Icon }: MetricProps) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-muted-foreground">{value}</dt>
      <dd className="mt-2 flex h-9 items-center justify-center gap-1 rounded-md bg-muted px-1 text-[0.68rem] text-foreground">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </dd>
    </div>
  );
}

export const ServiceNodeCard = memo(ServiceNodeComponent);
