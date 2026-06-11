import type { Edge, Node } from "@xyflow/react";

export type ServiceStatus = "Healthy" | "Degraded" | "Down";

export type ServiceKind = "api" | "database" | "cache" | "worker" | "gateway";

export type CloudProvider = "AWS" | "GCP" | "Azure";

export type AppSummary = {
  id: string;
  name: string;
  description: string;
  runtime: string;
  region: string;
  accent: string;
};

export type ServiceNodeData = {
  name: string;
  description: string;
  status: ServiceStatus;
  cpu: number;
  memoryGb: number;
  diskGb: number;
  replicas: number;
  runtimeVersion: string;
  region: string;
  provider: CloudProvider;
  kind: ServiceKind;
  costPerHour: number;
};

export type ServiceNode = Node<ServiceNodeData, "service">;
export type ServiceEdge = Edge<{ label?: string }>;

export type AppGraph = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
};

export type InspectorTab = "config" | "runtime";
