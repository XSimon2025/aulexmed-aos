import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "aulexmed_support_center";

function getPassword() {
  return process.env.SUPPORT_CENTER_PASSWORD || "";
}

function getAdminToken() {
  return process.env.SUPPORT_ADMIN_TOKEN || "";
}

function hashSecret(value: string) {
  return createHash("sha256").update(`aulexmed-support:${value}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  if (!left || !right) {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createSupportSessionToken(password: string) {
  return hashSecret(password);
}

export function verifySupportPassword(password: string) {
  const configuredPassword = getPassword();
  return safeEqual(password, configuredPassword);
}

export async function isSupportCenterSessionValid() {
  const configuredPassword = getPassword();

  if (!configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value || "";
  return safeEqual(cookieValue, createSupportSessionToken(configuredPassword));
}

export function getSupportCookieName() {
  return COOKIE_NAME;
}

export function isSupportApiRequestAuthorized(request: Request) {
  const adminToken = getAdminToken();
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const headerToken = request.headers.get("x-support-admin-token") || "";

  if (adminToken && (safeEqual(bearer, adminToken) || safeEqual(headerToken, adminToken))) {
    return true;
  }

  const configuredPassword = getPassword();
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieValue =
    cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1] || "";

  return Boolean(configuredPassword && safeEqual(decodeURIComponent(cookieValue), createSupportSessionToken(configuredPassword)));
}

export function isIngestRequestAuthorized(request: Request) {
  const secret = process.env.SUPPORT_INGEST_SECRET;

  if (!secret) {
    console.error("AULEXMED support ingest rejected: SUPPORT_INGEST_SECRET is not configured.");
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const headerSecret = request.headers.get("x-support-ingest-secret") || "";

  return safeEqual(bearer, secret) || safeEqual(headerSecret, secret);
}
