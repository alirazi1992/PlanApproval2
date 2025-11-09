import { NextResponse } from "next/server";
import { swaggerSpec } from "@/src/lib/swagger";

export function GET() {
  return NextResponse.json(swaggerSpec);
}
