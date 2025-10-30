import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { HttpApi, CorsHttpMethod, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { costApiFn } from "./functions/cost-api/resource";

const backend = defineBackend({
  costApiFn,
});

// Create a dedicated stack for API resources
const stack = backend.createStack("api-stack");

// HTTP API with permissive CORS for demo (tighten for production)
const httpApi = new HttpApi(stack, "ec2-cost-api", {
  corsPreflight: {
    allowHeaders: ["*"],
    allowMethods: [CorsHttpMethod.ANY],
    allowOrigins: ["*"],
  },
});

// Lambda integration
const integration = new HttpLambdaIntegration(
  "costApiIntegration",
  backend.costApiFn.resources.lambda
);

// Route: GET /ec2cost
httpApi.addRoutes({
  path: "/ec2cost",
  methods: [HttpMethod.GET],
  integration,
});

// Expose API endpoint to the frontend via amplify_outputs.json
backend.addOutput({
  custom: {
    ec2CostApiName: "ec2-cost-api",
    ec2CostApiUrl: httpApi.apiEndpoint,
  },
});
