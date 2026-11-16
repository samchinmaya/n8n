import { Cron } from "croner";
import { nodeRegistry } from "../nodes";
import { WorkflowNode, WorkflowEdge } from "../types/workflow";

function validateWorkflow(nodes:WorkflowNode[],edges:WorkflowEdge[]): string | null {
  for (const node of nodes) {
    if (!nodeRegistry[node.type]) {
      return `Unknown node type:${node.type}`;
    }
  }
  const triggers = nodes.filter((n) => nodeRegistry[n.type]?.isTrigger);
  if (triggers.length > 1) {
    return "A workflow can only have one trigger";

  }
  for (const node of nodes) {
    if (node.type !== "scheduleTrigger") continue;
    const expr = node.params.cron;
    if (typeof expr !== "string") {
      return `Node "${node.name}" needs a cron expression`;

    }
    try {
      new Cron(expr, { paused: true }).stop();

    } catch {
      return `Invalid cron expression:${expr}`;

    }
  }
  const ids = new Set(nodes.map((n) => n.id));
  for (const edge of edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) {
      return `Edge ${edge.id} points to a node that doesn't exist`;
    }
  }
  return null

}
