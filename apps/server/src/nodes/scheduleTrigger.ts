import type { NodeDefinition } from "./types";
export const scheduleTrigger: NodeDefinition = {
  type: "scheduleTrigger",
  name: "Schedule Trigger",
  isTrigger: true,
  execute: async () => {
    return { startedAt: new Date().toISOString() };
  },
};
