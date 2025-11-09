import { createSwaggerSpec } from "next-swagger-doc";

export const swaggerSpec = createSwaggerSpec({
  title: "PlanApproval 2 API",
  version: "0.1.0",
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PlanApproval 2",
      version: "0.1.0",
      description: "Workflow, RBAC, and document integrity services"
    }
  }
});
