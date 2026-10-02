import { type } from "arktype";
export const WorkflowNode = type({
  id: "string", // node id

  type: "string", // node type

  name: "string>0", //atleast 1 char

  position: { // position in the workflow editor
    x: "number", // x coordinate
    y: "number", // y coordinate
  },

  params: "Record<string,unknown>", // node params
  "credentialId?":"string", // credential id
})
export type WorkflowNode = typeof WorkflowNode.infer;
export const WorkflowEdge = type({
  id: "string", // edge id
  source: "string", // source node id
  target: "string", // target node id
})
export type WorkflowEdge = typeof WorkflowEdge.infer;
