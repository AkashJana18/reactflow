import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  Cpu,
  Database,
  HardDrive,
  Layers3,
  MapPin,
  ServerCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { clamp, cn } from "@/lib/utils";
import { useGraphBuilderStore } from "@/store/use-graph-builder-store";
import type {
  InspectorTab,
  ServiceNode,
  ServiceNodeData,
  ServiceStatus,
} from "@/types";

type NodeInspectorProps = {
  selectedNode: ServiceNode | null;
  onUpdateNode: (patch: Partial<ServiceNodeData>) => void;
};

const statusMeta: Record<
  ServiceStatus,
  {
    icon: typeof CheckCircle2;
    badge: "healthy" | "degraded" | "down";
    className: string;
  }
> = {
  Healthy: {
    icon: CheckCircle2,
    badge: "healthy",
    className: "text-emerald-300",
  },
  Degraded: {
    icon: AlertTriangle,
    badge: "degraded",
    className: "text-amber-200",
  },
  Down: {
    icon: CircleOff,
    badge: "down",
    className: "text-red-300",
  },
};

export function NodeInspector({
  selectedNode,
  onUpdateNode,
}: NodeInspectorProps) {
  const activeInspectorTab = useGraphBuilderStore(
    (state) => state.activeInspectorTab,
  );
  const setActiveInspectorTab = useGraphBuilderStore(
    (state) => state.setActiveInspectorTab,
  );

  if (!selectedNode) {
    return (
      <section className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="text-base font-semibold text-foreground">
          Node Inspector
        </h2>
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-6 text-center">
          <ServerCog className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Select a service node
          </p>
          <p className="mt-1 max-w-56 text-xs text-muted-foreground">
            Click a node on the canvas to inspect and edit its configuration.
          </p>
        </div>
      </section>
    );
  }

  const { data } = selectedNode;
  const meta = statusMeta[data.status];
  const StatusIcon = meta.icon;
  const cpuValue = clamp(Math.round(data.cpu), 0, 100);

  function updateCpu(value: number) {
    onUpdateNode({ cpu: clamp(Math.round(value), 0, 100) });
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Service Node
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
            {data.name}
          </h2>
        </div>
        <Badge variant={meta.badge} className="shrink-0 gap-1.5">
          <StatusIcon className={cn("size-3.5", meta.className)} />
          {data.status}
        </Badge>
      </div>

      <Tabs
        value={activeInspectorTab}
        onValueChange={(value) =>
          setActiveInspectorTab(value as InspectorTab)
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-name">Node name</Label>
            <Input
              id="node-name"
              value={data.name}
              autoComplete="off"
              onChange={(event) => onUpdateNode({ name: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-description">Description</Label>
            <Textarea
              id="node-description"
              value={data.description}
              onChange={(event) =>
                onUpdateNode({ description: event.target.value })
              }
            />
          </div>

          <div className="rounded-md border border-border bg-muted/20 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Label htmlFor="cpu-input" className="flex items-center gap-2">
                <Cpu className="size-4 text-muted-foreground" />
                CPU allocation
              </Label>
              <span className="text-xs text-muted-foreground">0-100</span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[cpuValue]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) => updateCpu(value)}
                aria-label="CPU allocation"
              />
              <Input
                id="cpu-input"
                className="w-20 shrink-0 text-right"
                type="number"
                inputMode="numeric"
                min={0}
                max={100}
                value={cpuValue}
                onChange={(event) => updateCpu(Number(event.target.value))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Metric
              icon={Activity}
              label="Replicas"
              value={String(data.replicas)}
            />
            <Metric
              icon={Database}
              label="Memory"
              value={`${data.memoryGb} GB`}
            />
            <Metric icon={HardDrive} label="Disk" value={`${data.diskGb} GB`} />
            <Metric icon={MapPin} label="Region" value={data.region} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Healthy", "Degraded", "Down"] as const).map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={data.status === status ? "default" : "outline"}
                  size="sm"
                  className="px-2"
                  onClick={() => onUpdateNode({ status })}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Layers3 className="size-4 text-muted-foreground" />
              Runtime
            </div>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="truncate text-right text-foreground">
                  {data.runtimeVersion}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Provider</dt>
                <dd className="text-foreground">{data.provider}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Cost</dt>
                <dd className="text-foreground">
                  ${data.costPerHour.toFixed(2)}/hr
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

type MetricProps = {
  icon: typeof Activity;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2 truncate text-sm font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}
