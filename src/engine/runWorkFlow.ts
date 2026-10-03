import type { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";
import { nodeRegistry } from "../nodes/index.ts";
export async function runWorkFlow(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const outputs: Record<string, unknown> = {}; // will hold the output of each node
  let input: unknown = undefined; // what we pasws to the next node
  let current = nodes.find((n) => nodeRegistry[n.type]?.isTrigger); // find the trigger mode and hold that node
  if (!current) throw new Error("No Trigger Node found");
  while (current) {
    const definition = nodeRegistry[current.type];
    if (!definition) {
      throw new Error(`Node type "${current.type}" is not registered`)
    }
    const output = await definition.execute({ params: current.params, input })
    if(!output) {
      throw new Error(`Node type "${current.type}" did not return an output`)
    }
    outputs[current.id] = output;
    input = output;
    const edge = edges.find((e) => e.source === current!.id)
    current = edge ? nodes.find((n) => n.id === edge.target) : undefined
  }
  return outputs
}
