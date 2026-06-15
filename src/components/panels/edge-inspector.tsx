import { GitBranch, Trash2, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ServiceEdge, ServiceNode } from "@/types";

type EdgeInspectorProps = {
  edge: ServiceEdge;
  nodes: ServiceNode[];
  onUpdateEdge: (patch: Partial<ServiceEdge>) => void;
  onDeleteEdge: () => void;
};

const edgeTypeOptions = [
  { label: "Smooth", value: "smoothstep" },
  { label: "Straight", value: "straight" },
  { label: "Step", value: "step" },
  { label: "Bezier", value: "default" },
];

export function EdgeInspector({
  edge,
  nodes,
  onUpdateEdge,
  onDeleteEdge,
}: EdgeInspectorProps) {
  const sourceName = getNodeName(nodes, edge.source);
  const targetName = getNodeName(nodes, edge.target);
  const edgeLabel =
    typeof edge.label === "string" ? edge.label : edge.data?.label ?? "";

  return (
    <section className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Wire Connection
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
            {sourceName} to {targetName}
          </h2>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
          <Workflow className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="wire-source"
            label="Source"
            value={edge.source}
            nodes={nodes}
            disabledNodeId={edge.target}
            onChange={(source) =>
              onUpdateEdge({ source, sourceHandle: null })
            }
          />
          <SelectField
            id="wire-target"
            label="Target"
            value={edge.target}
            nodes={nodes}
            disabledNodeId={edge.source}
            onChange={(target) =>
              onUpdateEdge({ target, targetHandle: null })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wire-label">Label</Label>
          <Input
            id="wire-label"
            value={edgeLabel}
            autoComplete="off"
            placeholder="Optional wire label"
            onChange={(event) => {
              const label = event.target.value;
              onUpdateEdge({
                label,
                data: { ...edge.data, label },
              });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wire-style">Wire style</Label>
          <select
            id="wire-style"
            value={edge.type ?? "smoothstep"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onChange={(event) => onUpdateEdge({ type: event.target.value })}
          >
            {edgeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-12 items-center justify-between gap-4 rounded-md border border-border bg-muted/20 px-3 py-2">
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            <Zap className="size-4 text-muted-foreground" aria-hidden="true" />
            Animated wire
          </span>
          <input
            type="checkbox"
            checked={Boolean(edge.animated)}
            className="size-4 accent-primary"
            onChange={(event) => onUpdateEdge({ animated: event.target.checked })}
          />
        </label>

        <div className="rounded-md border border-border bg-muted/20 p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <GitBranch className="size-4 text-muted-foreground" />
            Connection
          </div>
          <dl className="grid gap-2 text-sm">
            <Row label="ID" value={edge.id} />
            <Row label="Source" value={sourceName} />
            <Row label="Target" value={targetName} />
          </dl>
        </div>

        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={onDeleteEdge}
        >
          <Trash2 aria-hidden="true" />
          Delete wire
        </Button>
      </div>
    </section>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  nodes: ServiceNode[];
  disabledNodeId: string;
  onChange: (nodeId: string) => void;
};

function SelectField({
  id,
  label,
  value,
  nodes,
  disabledNodeId,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onChange={(event) => onChange(event.target.value)}
      >
        {nodes.map((node) => (
          <option
            key={node.id}
            value={node.id}
            disabled={node.id === disabledNodeId}
          >
            {node.data.name}
          </option>
        ))}
      </select>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("truncate text-right text-foreground", label === "ID" && "max-w-40")}>
        {value}
      </dd>
    </div>
  );
}

function getNodeName(nodes: ServiceNode[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId)?.data.name ?? nodeId;
}
