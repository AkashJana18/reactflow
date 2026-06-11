# App Graph Builder

A responsive take-home implementation of an application graph builder using React, Vite, TypeScript, ReactFlow, shadcn/ui-style components, TanStack Query, and Zustand.

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## What is implemented

- Full app shell with top bar, left icon rail, desktop right panel, and dotted ReactFlow canvas.
- Responsive right panel that becomes a Zustand-controlled slide-over drawer below the desktop breakpoint.
- ReactFlow graph with service nodes, edges, drag, select, pan, zoom, connect, fit view, and Delete/Backspace deletion.
- Service node inspector with status badge, Config/Runtime tabs, editable name, editable description, and synced CPU slider/numeric input persisted into node data.
- TanStack Query hooks for mock `GET /apps` and `GET /apps/:appId/graph` calls with simulated latency, loading states, error states, retry actions, and cache keys per app.
- Zustand state for selected app, selected node, mobile drawer open state, active inspector tab, and the mock error toggle.

## Key decisions

- Mock APIs are typed in-memory promise functions instead of a real backend. This keeps the app deterministic while still exercising TanStack Query loading, error, retry, and cache behavior.
- ReactFlow nodes/edges stay in ReactFlow state because they are editable graph state. Zustand only stores cross-layout UI state and IDs.
- shadcn/ui components are included locally as source files using Radix primitives where needed, so the repository remains self-contained after install.
- Inspector edits patch the selected node's `data` object directly through `setNodes`, keeping canvas cards and inspector fields synchronized.

## Known limitations

- Mock data resets when switching apps or refreshing the page; there is no persistent storage.
- Search input is present for layout parity but disabled because app filtering was outside the required behavior.
- Error simulation is a global toggle that forces mock endpoints to fail until toggled off.
