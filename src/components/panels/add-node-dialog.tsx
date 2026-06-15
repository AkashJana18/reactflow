import { useEffect, useId, useMemo, useState } from "react";
import type { FormEvent, HTMLAttributes } from "react";
import { ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  CloudProvider,
  ServiceKind,
  ServiceNodeData,
  ServiceStatus,
} from "@/types";

type AddNodeDialogProps = {
  open: boolean;
  defaultName: string;
  onOpenChange: (open: boolean) => void;
  onCreateNode: (data: ServiceNodeData) => void;
};

type FormState = {
  name: string;
  description: string;
  status: ServiceStatus;
  kind: ServiceKind;
  provider: CloudProvider;
  runtimeVersion: string;
  region: string;
  cpu: string;
  memoryGb: string;
  diskGb: string;
  replicas: string;
  costPerHour: string;
};

const serviceKinds: ServiceKind[] = [
  "api",
  "database",
  "cache",
  "worker",
  "gateway",
];
const statuses: ServiceStatus[] = ["Healthy", "Degraded", "Down"];
const providers: CloudProvider[] = ["AWS", "GCP", "Azure"];

function createDefaultFormState(defaultName: string): FormState {
  return {
    name: defaultName,
    description: "New service node added from the graph builder.",
    status: "Healthy",
    kind: "api",
    provider: "AWS",
    runtimeVersion: "Node 22",
    region: "us-east-1",
    cpu: "25",
    memoryGb: "0.5",
    diskGb: "10",
    replicas: "1",
    costPerHour: "0.03",
  };
}

export function AddNodeDialog({
  open,
  defaultName,
  onOpenChange,
  onCreateNode,
}: AddNodeDialogProps) {
  const nameErrorId = useId();
  const [form, setForm] = useState<FormState>(() =>
    createDefaultFormState(defaultName),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nameError = useMemo(() => {
    if (!hasSubmitted || form.name.trim()) {
      return null;
    }

    return "Node name is required.";
  }, [form.name, hasSubmitted]);

  useEffect(() => {
    if (open) {
      setForm(createDefaultFormState(defaultName));
      setHasSubmitted(false);
    }
  }, [defaultName, open]);

  function updateField<Key extends keyof FormState>(
    field: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (!form.name.trim()) {
      return;
    }

    onCreateNode({
      name: form.name.trim(),
      description: form.description.trim() || "No description provided.",
      status: form.status,
      kind: form.kind,
      provider: form.provider,
      runtimeVersion: form.runtimeVersion.trim() || "Node 22",
      region: form.region.trim() || "us-east-1",
      cpu: clampInteger(form.cpu, 0, 100, 25),
      memoryGb: clampDecimal(form.memoryGb, 0.1, 8, 0.5),
      diskGb: clampInteger(form.diskGb, 1, 200, 10),
      replicas: clampInteger(form.replicas, 1, 10, 1),
      costPerHour: clampDecimal(form.costPerHour, 0.01, 20, 0.03),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
            <ServerCog className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle>Add service node</DialogTitle>
          <DialogDescription>
            Fill in the node details before adding it to the graph.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <Label htmlFor="new-node-name">Node name *</Label>
              <Input
                id="new-node-name"
                value={form.name}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={nameError ? "true" : undefined}
                aria-describedby={nameError ? nameErrorId : undefined}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {nameError ? (
                <p id={nameErrorId} className="text-xs text-destructive">
                  {nameError}
                </p>
              ) : null}
            </Field>

            <Field className="sm:col-span-2">
              <Label htmlFor="new-node-description">Description</Label>
              <Textarea
                id="new-node-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
              />
            </Field>

            <SelectField
              id="new-node-kind"
              label="Kind"
              value={form.kind}
              options={serviceKinds}
              onChange={(value) => updateField("kind", value as ServiceKind)}
            />
            <SelectField
              id="new-node-status"
              label="Status"
              value={form.status}
              options={statuses}
              onChange={(value) =>
                updateField("status", value as ServiceStatus)
              }
            />
            <SelectField
              id="new-node-provider"
              label="Provider"
              value={form.provider}
              options={providers}
              onChange={(value) =>
                updateField("provider", value as CloudProvider)
              }
            />
            <Field>
              <Label htmlFor="new-node-region">Region</Label>
              <Input
                id="new-node-region"
                value={form.region}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => updateField("region", event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="new-node-runtime">Runtime</Label>
              <Input
                id="new-node-runtime"
                value={form.runtimeVersion}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) =>
                  updateField("runtimeVersion", event.target.value)
                }
              />
            </Field>
            <Field>
              <Label htmlFor="new-node-cost">Cost / hr</Label>
              <Input
                id="new-node-cost"
                value={form.costPerHour}
                type="text"
                inputMode="decimal"
                onChange={(event) =>
                  updateField("costPerHour", event.target.value)
                }
              />
            </Field>
          </div>

          <fieldset className="rounded-md border border-border bg-muted/20 p-4">
            <legend className="px-1 text-sm font-medium text-foreground">
              Resources
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-4">
              <Field>
                <Label htmlFor="new-node-cpu">CPU</Label>
                <Input
                  id="new-node-cpu"
                  value={form.cpu}
                  type="text"
                  inputMode="numeric"
                  onChange={(event) => updateField("cpu", event.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="new-node-memory">Mem GB</Label>
                <Input
                  id="new-node-memory"
                  value={form.memoryGb}
                  type="text"
                  inputMode="decimal"
                  onChange={(event) =>
                    updateField("memoryGb", event.target.value)
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="new-node-disk">Disk GB</Label>
                <Input
                  id="new-node-disk"
                  value={form.diskGb}
                  type="text"
                  inputMode="numeric"
                  onChange={(event) => updateField("diskGb", event.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="new-node-replicas">Rep</Label>
                <Input
                  id="new-node-replicas"
                  value={form.replicas}
                  type="text"
                  inputMode="numeric"
                  onChange={(event) =>
                    updateField("replicas", event.target.value)
                  }
                />
              </Field>
            </div>
          </fieldset>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add node</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = HTMLAttributes<HTMLDivElement>;

function Field({ className, ...props }: FieldProps) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function clampInteger(
  value: string,
  min: number,
  max: number,
  fallback: number,
) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function clampDecimal(
  value: string,
  min: number,
  max: number,
  fallback: number,
) {
  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}
