import { describe, expect, test } from "bun:test";
import type { WorkflowNode, WorkflowEdge } from "@n8n/types";
import { validateWorkflow } from "./validateWorkflow";

const node = (id: string, type: string, params: Record<string, unknown> = {}): WorkflowNode => ({
  id,type,name:`node${id}`,position:{x:0,y:0},params,
})
const edge = (id: string, source: string, target: string): WorkflowEdge => ({ id, source, target })

describe("validateWorkflow", () => {
  test("rejects an unknown node type", () => {
    expect(validateWorkflow([node("1", "banana")], [])).toBe("Unknown node type:banana");
  });
  test("rejects a schedule trigger without cron", () => {
    expect(validateWorkflow([node("1", "scheduleTrigger")], [])).toBe('Node "node1" needs a cron expression');
  });
  test("rejects an invalid cron expression", () => {
    expect(validateWorkflow([node("1", "scheduleTrigger",{cron:"not a cron"})],[])).toBe('Invalid cron expression:not a cron')
  });
  test("rejects an edge to a missing node", () => {
    expect(validateWorkflow([node("1","manualTrigger")],[edge("e1","1","99")])).toBe("Edge e1 points to a node that doesn't exist")
  })


  test("accepts a valid workflow", () => {
    const nodes = [node("1", "manualTrigger"), node("2", "set")];
    const edges = [edge("e1", "1", "2")];
    expect(validateWorkflow(nodes, edges)).toBeNull();
  });

  test("rejects two triggers", () => {
    const nodes = [node("1", "manualTrigger"), node("2", "scheduleTrigger", { cron: "* * * * *" })];
    expect(validateWorkflow(nodes, [])).toBe("A workflow can only have one trigger");
  });
});
