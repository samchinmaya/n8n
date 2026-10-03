import { runWorkFlow } from "./engine/runWorkFlow";
import type { WorkflowNode, WorkflowEdge } from "./types/workflow";
const nodes: WorkflowNode[] = [
  { id: '1', type: 'manualTrigger', name: 'start', position: { x: 0, y: 0 }, params: {} },
  { id: '2', type: 'httpRequest', name: 'Get todos', position: { x: 0, y: 0 }, params: {url:"https://jsonplaceholder.typicode.com/todos"} },
]
const edges: WorkflowEdge[] = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
]
const result = await runWorkFlow(nodes, edges);
console.log(result);
