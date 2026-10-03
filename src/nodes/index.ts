import type { NodeDefinition } from "./types";
import { manualTrigger } from "./manualTrigger";
import { setNode } from "./set";
import { httpRequest } from "./httpRequest";
export const nodeRegistry: Record<string, NodeDefinition> = {
  [manualTrigger.type]: manualTrigger,
  [setNode.type]: setNode,
  [httpRequest.type]: httpRequest,
}
