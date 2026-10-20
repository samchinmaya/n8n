import type { NodeDefinition } from "./types";
import { manualTrigger } from "./manualTrigger";
import { setNode } from "./set";
import { httpRequest } from "./httpRequest";
import { scheduleTrigger } from "./scheduleTrigger";
export const nodeRegistry: Record<string, NodeDefinition> = {
  [manualTrigger.type]: manualTrigger,
  [scheduleTrigger.type]:scheduleTrigger,
  [setNode.type]: setNode,
  [httpRequest.type]: httpRequest,
}
