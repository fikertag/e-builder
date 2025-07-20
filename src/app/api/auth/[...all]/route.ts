import { auth as adminAuth } from "@/lib/auth";
import { auth as customerAuth } from "@/lib/customer-auth";
import { toNextJsHandler } from "better-auth/next-js";

const adminHandler = toNextJsHandler(adminAuth);
const customerHandler = toNextJsHandler(customerAuth);

function extractSubdomainFromHost(host: string): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0];
  const rootDomain = process.env.ROOT_DOMAIN || "ethify.app";

  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  // Production subdomain support
  if (
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    hostname.endsWith(`.${rootDomain}`)
  ) {
    const sub = hostname.replace(`.${rootDomain}`, "");
    return sub;
  }
  return null;
}

export async function GET(request: Request) {
  const host = request.headers.get("host") ?? "";
  const subdomain = extractSubdomainFromHost(host);

  if (subdomain) {
    return customerHandler.GET(request);
  } else {
    return adminHandler.GET(request);
  }
}

export async function POST(request: Request) {
  const host = request.headers.get("host") ?? "";
  const subdomain = extractSubdomainFromHost(host);

  if (subdomain) {
    return customerHandler.POST(request);
  } else {
    return adminHandler.POST(request);
  }
}
