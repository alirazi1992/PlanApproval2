"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <section className="section-card">
      <h1 className="page-title">API Explorer</h1>
      <SwaggerUI url="/api/swagger" docExpansion="list" />
    </section>
  );
}
