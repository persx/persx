/**
 * Audit Logging System
 *
 * Tracks admin actions for security, compliance, and debugging.
 * Stores audit logs in the database for long-term retention.
 */

import { createClient } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";

export enum AuditAction {
  // Content actions
  CONTENT_CREATE = "content_create",
  CONTENT_UPDATE = "content_update",
  CONTENT_DELETE = "content_delete",
  CONTENT_PUBLISH = "content_publish",
  CONTENT_UNPUBLISH = "content_unpublish",

  // Admin actions
  ADMIN_LOGIN = "admin_login",
  ADMIN_LOGOUT = "admin_logout",
  PASSWORD_RESET = "password_reset",

  // Configuration actions
  CONFIG_UPDATE = "config_update",

  // Data export
  DATA_EXPORT = "data_export",
}

interface AuditLogEntry {
  action: AuditAction;
  actor_id?: string;
  actor_email?: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Log an admin action to the audit log
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createClient();

    // Insert audit log into database
    const { error } = await supabase.from("audit_logs").insert({
      action: entry.action,
      actor_id: entry.actor_id || null,
      actor_email: entry.actor_email || null,
      resource_type: entry.resource_type || null,
      resource_id: entry.resource_id || null,
      details: entry.details || null,
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      // Log error but don't throw - audit logging shouldn't break the app
      logger.error("Failed to write audit log", error, { entry });
    } else {
      logger.debug("Audit log written", { action: entry.action, actor: entry.actor_email });
    }
  } catch (error) {
    // Catch any errors to prevent audit logging from breaking the app
    logger.error("Audit logging error", error as Error, { entry });
  }
}

/**
 * Helper to extract request metadata
 */
export function getRequestMetadata(request: Request): {
  ip_address: string;
  user_agent: string;
} {
  const headers = request.headers;

  const ip_address =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  const user_agent = headers.get("user-agent") || "unknown";

  return { ip_address, user_agent };
}

/**
 * Helper functions for common audit events
 */

export async function logContentCreate(
  actorEmail: string,
  contentId: string,
  contentTitle: string,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.CONTENT_CREATE,
    actor_email: actorEmail,
    resource_type: "content",
    resource_id: contentId,
    details: { title: contentTitle },
    ...metadata,
  });
}

export async function logContentUpdate(
  actorEmail: string,
  contentId: string,
  changes: Record<string, unknown>,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.CONTENT_UPDATE,
    actor_email: actorEmail,
    resource_type: "content",
    resource_id: contentId,
    details: { changes },
    ...metadata,
  });
}

export async function logContentDelete(
  actorEmail: string,
  contentId: string,
  contentTitle: string,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.CONTENT_DELETE,
    actor_email: actorEmail,
    resource_type: "content",
    resource_id: contentId,
    details: { title: contentTitle },
    ...metadata,
  });
}

export async function logContentPublish(
  actorEmail: string,
  contentId: string,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.CONTENT_PUBLISH,
    actor_email: actorEmail,
    resource_type: "content",
    resource_id: contentId,
    ...metadata,
  });
}

export async function logAdminLogin(
  actorEmail: string,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.ADMIN_LOGIN,
    actor_email: actorEmail,
    ...metadata,
  });
}

export async function logPasswordReset(
  actorEmail: string,
  request?: Request
): Promise<void> {
  const metadata = request ? getRequestMetadata(request) : {};

  await logAuditEvent({
    action: AuditAction.PASSWORD_RESET,
    actor_email: actorEmail,
    ...metadata,
  });
}

/**
 * Query audit logs
 */
export async function getAuditLogs(filters?: {
  action?: AuditAction;
  actor_email?: string;
  resource_id?: string;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
}) {
  const supabase = createClient();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.action) {
    query = query.eq("action", filters.action);
  }

  if (filters?.actor_email) {
    query = query.eq("actor_email", filters.actor_email);
  }

  if (filters?.resource_id) {
    query = query.eq("resource_id", filters.resource_id);
  }

  if (filters?.start_date) {
    query = query.gte("created_at", filters.start_date.toISOString());
  }

  if (filters?.end_date) {
    query = query.lte("created_at", filters.end_date.toISOString());
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("Failed to fetch audit logs", error);
    throw error;
  }

  return data;
}
