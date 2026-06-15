import type { AppGraph, AppSummary } from "@/types";

type MockOptions = {
  fail?: boolean;
};

const apps: AppSummary[] = [
  {
    id: "supertokens-golang",
    name: "supertokens-golang",
    description: "Auth services and backing data stores for the Go runtime.",
    runtime: "Go 1.22",
    region: "us-east-1",
    accent: "bg-indigo-500",
  },
  {
    id: "supertokens-java",
    name: "supertokens-java",
    description: "Java API services with cache and PostgreSQL dependencies.",
    runtime: "Java 21",
    region: "eu-west-1",
    accent: "bg-violet-500",
  },
  {
    id: "supertokens-python",
    name: "supertokens-python",
    description: "Python workers and API layer for tenant orchestration.",
    runtime: "Python 3.12",
    region: "ap-south-1",
    accent: "bg-rose-500",
  },
  {
    id: "supertokens-ruby",
    name: "supertokens-ruby",
    description: "Legacy Ruby services with MongoDB persistence.",
    runtime: "Ruby 3.3",
    region: "us-west-2",
    accent: "bg-fuchsia-500",
  },
  {
    id: "supertokens-go",
    name: "supertokens-go",
    description: "Go services with cache and async processing workers.",
    runtime: "Go 1.22",
    region: "us-central-1",
    accent: "bg-purple-500",
  },
];

const graphByAppId: Record<string, AppGraph> = {
  "supertokens-golang": {
    nodes: [
      {
        id: "gateway",
        type: "service",
        position: { x: 56, y: 48 },
        data: {
          name: "API Gateway",
          description: "Routes tenant traffic, validates tokens, and applies edge limits.",
          status: "Healthy",
          cpu: 42,
          memoryGb: 0.5,
          diskGb: 10,
          replicas: 2,
          runtimeVersion: "Go 1.22",
          region: "us-east-1",
          provider: "AWS",
          kind: "gateway",
          costPerHour: 0.03,
        },
      },
      {
        id: "postgres",
        type: "service",
        position: { x: 440, y: 92 },
        data: {
          name: "Postgres",
          description: "Primary relational store for app metadata and sessions.",
          status: "Healthy",
          cpu: 68,
          memoryGb: 2,
          diskGb: 80,
          replicas: 1,
          runtimeVersion: "15.5",
          region: "us-east-1",
          provider: "AWS",
          kind: "database",
          costPerHour: 0.08,
        },
      },
      {
        id: "redis",
        type: "service",
        position: { x: 64, y: 360 },
        data: {
          name: "Redis",
          description: "Hot-path cache for access token lookups and rate limits.",
          status: "Degraded",
          cpu: 73,
          memoryGb: 1,
          diskGb: 16,
          replicas: 1,
          runtimeVersion: "7.2",
          region: "us-east-1",
          provider: "AWS",
          kind: "cache",
          costPerHour: 0.04,
        },
      },
      {
        id: "worker",
        type: "service",
        position: { x: 440, y: 360 },
        data: {
          name: "Token Worker",
          description: "Processes async tenant sync jobs and audit log delivery.",
          status: "Healthy",
          cpu: 36,
          memoryGb: 0.75,
          diskGb: 12,
          replicas: 3,
          runtimeVersion: "Go 1.22",
          region: "us-east-1",
          provider: "AWS",
          kind: "worker",
          costPerHour: 0.05,
        },
      },
    ],
    edges: [
      {
        id: "gateway-postgres",
        source: "gateway",
        target: "postgres",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "gateway-redis",
        source: "gateway",
        target: "redis",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "worker-postgres",
        source: "worker",
        target: "postgres",
        type: "smoothstep",
      },
    ],
  },
  "supertokens-java": {
    nodes: [
      {
        id: "java-api",
        type: "service",
        position: { x: 112, y: 112 },
        data: {
          name: "Java API",
          description: "Public auth API backed by JVM services.",
          status: "Healthy",
          cpu: 55,
          memoryGb: 3,
          diskGb: 30,
          replicas: 2,
          runtimeVersion: "Java 21",
          region: "eu-west-1",
          provider: "GCP",
          kind: "api",
          costPerHour: 0.07,
        },
      },
      {
        id: "java-postgres",
        type: "service",
        position: { x: 440, y: 92 },
        data: {
          name: "Postgres EU",
          description: "Regional database for Java tenants.",
          status: "Healthy",
          cpu: 62,
          memoryGb: 4,
          diskGb: 120,
          replicas: 1,
          runtimeVersion: "16.1",
          region: "eu-west-1",
          provider: "GCP",
          kind: "database",
          costPerHour: 0.11,
        },
      },
      {
        id: "java-cache",
        type: "service",
        position: { x: 248, y: 360 },
        data: {
          name: "Session Cache",
          description: "Cache for token refresh metadata.",
          status: "Down",
          cpu: 88,
          memoryGb: 2,
          diskGb: 20,
          replicas: 1,
          runtimeVersion: "Redis 7.2",
          region: "eu-west-1",
          provider: "GCP",
          kind: "cache",
          costPerHour: 0.06,
        },
      },
    ],
    edges: [
      {
        id: "java-api-db",
        source: "java-api",
        target: "java-postgres",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "java-api-cache",
        source: "java-api",
        target: "java-cache",
        type: "smoothstep",
      },
    ],
  },
  "supertokens-python": {
    nodes: [
      {
        id: "python-api",
        type: "service",
        position: { x: 124, y: 112 },
        data: {
          name: "Python API",
          description: "Tenant orchestration HTTP API.",
          status: "Degraded",
          cpu: 64,
          memoryGb: 1.5,
          diskGb: 18,
          replicas: 2,
          runtimeVersion: "Python 3.12",
          region: "ap-south-1",
          provider: "Azure",
          kind: "api",
          costPerHour: 0.05,
        },
      },
      {
        id: "python-worker",
        type: "service",
        position: { x: 440, y: 96 },
        data: {
          name: "Sync Worker",
          description: "Runs tenant reconciliation jobs.",
          status: "Healthy",
          cpu: 48,
          memoryGb: 1,
          diskGb: 12,
          replicas: 3,
          runtimeVersion: "Python 3.12",
          region: "ap-south-1",
          provider: "Azure",
          kind: "worker",
          costPerHour: 0.04,
        },
      },
      {
        id: "python-mongo",
        type: "service",
        position: { x: 248, y: 360 },
        data: {
          name: "MongoDB",
          description: "Document store for tenant configuration snapshots.",
          status: "Healthy",
          cpu: 58,
          memoryGb: 2,
          diskGb: 64,
          replicas: 1,
          runtimeVersion: "6.0",
          region: "ap-south-1",
          provider: "Azure",
          kind: "database",
          costPerHour: 0.09,
        },
      },
    ],
    edges: [
      {
        id: "python-api-worker",
        source: "python-api",
        target: "python-worker",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "python-api-mongo",
        source: "python-api",
        target: "python-mongo",
        type: "smoothstep",
      },
    ],
  },
  "supertokens-ruby": {
    nodes: [
      {
        id: "ruby-api",
        type: "service",
        position: { x: 120, y: 120 },
        data: {
          name: "Ruby API",
          description: "Legacy auth routes and migration compatibility layer.",
          status: "Degraded",
          cpu: 71,
          memoryGb: 1,
          diskGb: 24,
          replicas: 1,
          runtimeVersion: "Ruby 3.3",
          region: "us-west-2",
          provider: "AWS",
          kind: "api",
          costPerHour: 0.06,
        },
      },
      {
        id: "ruby-mongo",
        type: "service",
        position: { x: 440, y: 108 },
        data: {
          name: "MongoDB",
          description: "Document persistence for legacy tenant metadata.",
          status: "Healthy",
          cpu: 47,
          memoryGb: 2,
          diskGb: 72,
          replicas: 1,
          runtimeVersion: "7.0",
          region: "us-west-2",
          provider: "AWS",
          kind: "database",
          costPerHour: 0.1,
        },
      },
      {
        id: "ruby-jobs",
        type: "service",
        position: { x: 248, y: 360 },
        data: {
          name: "Sidekiq Jobs",
          description: "Background job executor for billing and sync tasks.",
          status: "Down",
          cpu: 82,
          memoryGb: 1.25,
          diskGb: 16,
          replicas: 1,
          runtimeVersion: "Sidekiq 7",
          region: "us-west-2",
          provider: "AWS",
          kind: "worker",
          costPerHour: 0.05,
        },
      },
    ],
    edges: [
      {
        id: "ruby-api-mongo",
        source: "ruby-api",
        target: "ruby-mongo",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "ruby-api-jobs",
        source: "ruby-api",
        target: "ruby-jobs",
        type: "smoothstep",
      },
    ],
  },
  "supertokens-go": {
    nodes: [
      {
        id: "go-edge",
        type: "service",
        position: { x: 96, y: 104 },
        data: {
          name: "Go Edge API",
          description: "Lightweight Go API for tenant edge requests.",
          status: "Healthy",
          cpu: 39,
          memoryGb: 0.75,
          diskGb: 14,
          replicas: 2,
          runtimeVersion: "Go 1.22",
          region: "us-central-1",
          provider: "AWS",
          kind: "api",
          costPerHour: 0.04,
        },
      },
      {
        id: "go-cache",
        type: "service",
        position: { x: 440, y: 104 },
        data: {
          name: "Redis Cache",
          description: "Shared cache for session and token metadata.",
          status: "Healthy",
          cpu: 57,
          memoryGb: 1,
          diskGb: 20,
          replicas: 1,
          runtimeVersion: "Redis 7.2",
          region: "us-central-1",
          provider: "AWS",
          kind: "cache",
          costPerHour: 0.05,
        },
      },
      {
        id: "go-worker",
        type: "service",
        position: { x: 264, y: 360 },
        data: {
          name: "Go Worker",
          description: "Processes background sync and cleanup jobs.",
          status: "Degraded",
          cpu: 66,
          memoryGb: 0.5,
          diskGb: 12,
          replicas: 3,
          runtimeVersion: "Go 1.22",
          region: "us-central-1",
          provider: "AWS",
          kind: "worker",
          costPerHour: 0.03,
        },
      },
    ],
    edges: [
      {
        id: "go-edge-cache",
        source: "go-edge",
        target: "go-cache",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "go-edge-worker",
        source: "go-edge",
        target: "go-worker",
        type: "smoothstep",
      },
    ],
  },
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneGraph(graph: AppGraph): AppGraph {
  return {
    nodes: graph.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      data: { ...node.data },
    })),
    edges: graph.edges.map((edge) => ({
      ...edge,
      data: edge.data ? { ...edge.data } : undefined,
    })),
  };
}

function assertHealthyEndpoint(endpoint: string, options?: MockOptions) {
  if (options?.fail) {
    throw new Error(`${endpoint} failed because mock error mode is enabled.`);
  }
}

export async function getApps(options?: MockOptions): Promise<AppSummary[]> {
  await delay(550);
  assertHealthyEndpoint("GET /apps", options);
  return apps.map((app) => ({ ...app }));
}

export async function getAppGraph(
  appId: string,
  options?: MockOptions,
): Promise<AppGraph> {
  await delay(700);
  assertHealthyEndpoint(`GET /apps/${appId}/graph`, options);

  const graph = graphByAppId[appId];

  if (!graph) {
    throw new Error(`GET /apps/${appId}/graph returned 404.`);
  }

  return cloneGraph(graph);
}
