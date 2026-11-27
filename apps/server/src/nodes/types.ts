export type NodeContext = {
  params: Record<string, unknown>; // the node's parameters
  input:unknown; // previous node's output
} // the node's context

export type NodeDefinition = {
  type: string, // the node's type
  name: string, // the node's name
  isTrigger: boolean, // whether the node is a trigger
  execute: (ctx: NodeContext) => Promise<unknown> // the node's execution function
} // the node's definition
