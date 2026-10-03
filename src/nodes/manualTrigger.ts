import type { NodeDefinition } from "./types";
export const manualTrigger: NodeDefinition = {
  type: "manualTrigger",
  name: "Manual Trigger",
  isTrigger: true,
  execute: async () => {
    return { startedAt: new Date().toISOString() };
  },
};
