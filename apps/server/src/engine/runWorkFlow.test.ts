import { runWorkFlow } from "./runWorkFlow";
import { describe, expect, test } from "bun:test";
import type { WorkflowNode, WorkflowEdge } from "@n8n/types";
import { validateWorkflow } from "./validateWorkflow";

const node = (id: string, type: string, params: Record<string, unknown> = {}): WorkflowNode => ({
  id,type,name:`node${id}`,position:{x:0,y:0},params,
})
const edge = (id: string, source: string, target: string): WorkflowEdge => ({ id, source, target })

describe("runWorkFlow", () => {
  test("runs trigger -> set and saves each node's output", async () => {
    const nodes = [node("1", "manualTrigger"), node("2", "set", { field: "status", value: "done" })]
    const outputs = await runWorkFlow(nodes, [edge("e1", "1", "2")]);
    expect(Object.keys(outputs)).toEqual(["1", "2"]);
    expect(outputs["2"]).toMatchObject({ status: "done" })

  });
  test("passes the webhook body to the next node", async () => {
    const nodes = [node("1", "manualTrigger"), node("2", "set", { field: "seen", value: true })]
    const outputs = await runWorkFlow(nodes, [edge("e1", "1", "2")], { orderId: 42 });
    expect(outputs["1"]).toMatchObject({ orderId: 42 });
    expect(outputs["2"]).toMatchObject({ orderId: 42, seen: true });

  });
  test("stops at a node with no outgoing edge", async () => {
    const nodes = [node("1", "manualTrigger"), node("2", "set", { field: "a", value: "1" })]
    const outputs = await runWorkFlow(nodes, []);
    expect(Object.keys(outputs)).toEqual(["1"]);
  });
  test("throw when there is no trigger", async () => {
    expect(runWorkFlow([node("1","set")],[])).rejects.toThrow("No Trigger Node found")
  })
  test("throws on a loop instead of runnign forever", async () => {
    const nodes = [node("1", "manualTrigger"), node("2", "set", { field: "a", value: 1 })]
    const edges = [edge("e1", "2", "1"), edge("e2", "2", "1")];
    expect(runWorkFlow(nodes,edges)).rejects.toThrow('Workflow has a loop:node"node1')
  })
});
