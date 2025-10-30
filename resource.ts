import { defineFunction } from "@aws-amplify/backend";

export const costApiFn = defineFunction({
  name: "cost-api-fn",
  entry: "./handler.ts",
  runtime: "nodejs18.x",
  timeoutSeconds: 10,
});
