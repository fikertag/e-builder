import { auth as adminAuth } from "@/lib/auth";
import { auth as customerAuth } from "@/lib/customer-auth";
import { toNextJsHandler } from "better-auth/next-js";

const adminHandler = toNextJsHandler(adminAuth);
const customerHandler = toNextJsHandler(customerAuth);

function extractSubdomainFromHost(host: string): string | null {
  console.log("[extractSubdomainFromHost] Raw host:", host);

  if (!host) return null;
  const hostname = host.split(":")[0];
  const rootDomain = process.env.ROOT_DOMAIN || "ethify.app";

  // Localhost support
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    console.log("[extractSubdomainFromHost] Localhost parts:", parts);
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
    console.log("[extractSubdomainFromHost] Detected subdomain:", sub);
    return sub;
  }

  console.log("[extractSubdomainFromHost] No subdomain detected.");
  return null;
}

export async function GET(request: Request) {
  console.log("=== [GET] auth route ===");
  const host = request.headers.get("host") ?? "";
  console.log("[GET] Host header:", host);

  const subdomain = extractSubdomainFromHost(host);
  console.log("[GET] Final subdomain:", subdomain);

  if (subdomain) {
    console.log("[GET] → Routing to customerHandler.GET");
    return customerHandler.GET(request);
  } else {
    console.log("[GET] → Routing to adminHandler.GET");
    return adminHandler.GET(request);
  }
}

export async function POST(request: Request) {
  console.log("=== [POST] auth route ===");
  const host = request.headers.get("host") ?? "";
  console.log("[POST] Host header:", host);

  const subdomain = extractSubdomainFromHost(host);
  console.log("[POST] Final subdomain:", subdomain);

  if (subdomain) {
    console.log("[POST] → Routing to customerHandler.POST");
    return customerHandler.POST(request);
  } else {
    console.log("[POST] → Routing to adminHandler.POST");
    return adminHandler.POST(request);
  }
}
