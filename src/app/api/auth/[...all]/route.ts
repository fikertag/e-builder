import { auth as adminAuth } from "@/lib/auth";
import { auth as customerAuth } from "@/lib/customer-auth";
import { toNextJsHandler } from "better-auth/next-js";

const adminHandler = toNextJsHandler(adminAuth);
const customerHandler = toNextJsHandler(customerAuth);

function isSubdomain(host: string) {
  if (!host) return false;
  // Handle localhost with subdomain (e.g., ps4store.localhost:3000)
  if (host.includes("localhost")) {
    // Remove port if present
    const cleanHost = host.split(":")[0];
    const parts = cleanHost.split(".");
    // ps4store.localhost => ["ps4store", "localhost"]
    return parts.length > 1 && parts[0] !== "localhost";
  }
  // Production: e.g., store1.e-comzy.com
  const parts = host.split(".");
  return parts.length > 2;
}

export async function GET(request: Request) {
  // Prioritize 'x-forwarded-host' for production environments
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (isSubdomain(host)) {
    return customerHandler.GET(request);
  } else {
    return adminHandler.GET(request);
  }
}

export async function POST(request: Request) {
  // Prioritize 'x-forwarded-host' for production environments
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (isSubdomain(host)) {
    return customerHandler.POST(request);
  } else {
    return adminHandler.POST(request);
  }
}