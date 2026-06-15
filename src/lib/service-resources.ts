import { clamp } from "@/lib/utils";
import type { ServiceNodeData } from "@/types";

export type ResourceMetric = "cpu" | "memoryGb" | "diskGb" | "replicas";

export type ResourceDefinition = {
  key: ResourceMetric;
  label: string;
  inputLabel: string;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  toPatch: (value: number) => Partial<ServiceNodeData>;
  getValue: (data: ServiceNodeData) => number;
};

export const resourceDefinitions: ResourceDefinition[] = [
  {
    key: "cpu",
    label: "CPU",
    inputLabel: "CPU allocation",
    min: 0,
    max: 100,
    step: 1,
    formatValue: (value) => String(Math.round(value)),
    toPatch: (value) => ({ cpu: clamp(Math.round(value), 0, 100) }),
    getValue: (data) => data.cpu,
  },
  {
    key: "memoryGb",
    label: "Mem",
    inputLabel: "Memory",
    min: 0.1,
    max: 8,
    step: 0.1,
    formatValue: (value) => `${trimDecimal(value)} GB`,
    toPatch: (value) => ({ memoryGb: clamp(roundTo(value, 1), 0.1, 8) }),
    getValue: (data) => data.memoryGb,
  },
  {
    key: "diskGb",
    label: "Disk",
    inputLabel: "Disk",
    min: 1,
    max: 200,
    step: 1,
    formatValue: (value) => `${Math.round(value)} GB`,
    toPatch: (value) => ({ diskGb: clamp(Math.round(value), 1, 200) }),
    getValue: (data) => data.diskGb,
  },
  {
    key: "replicas",
    label: "Rep",
    inputLabel: "Replicas",
    min: 1,
    max: 10,
    step: 1,
    formatValue: (value) => String(Math.round(value)),
    toPatch: (value) => ({ replicas: clamp(Math.round(value), 1, 10) }),
    getValue: (data) => data.replicas,
  },
];

export function getResourceDefinition(key: ResourceMetric) {
  return resourceDefinitions.find((definition) => definition.key === key)
    ?? resourceDefinitions[0];
}

export function getResourcePercent(data: ServiceNodeData, key: ResourceMetric) {
  const definition = getResourceDefinition(key);
  const value = definition.getValue(data);
  const range = definition.max - definition.min;

  if (range <= 0) {
    return 0;
  }

  return clamp(((value - definition.min) / range) * 100, 0, 100);
}

export function parseResourceInput(
  value: string,
  definition: ResourceDefinition,
) {
  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    return definition.min;
  }

  return clamp(parsed, definition.min, definition.max);
}

function roundTo(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function trimDecimal(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
