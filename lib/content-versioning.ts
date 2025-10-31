/**
 * Content Versioning System
 *
 * Provides functions to manage content versions, compare versions,
 * and restore previous versions.
 */

import { createClient } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";

export interface ContentVersion {
  id: string;
  content_id: string;
  version_number: number;
  title: string;
  content: string;
  excerpt?: string;
  content_type: string;
  status: string;
  tags: string[];
  change_summary?: string;
  changed_by?: string;
  created_at: string;
}

/**
 * Get all versions for a content item
 */
export async function getContentVersions(contentId: string): Promise<ContentVersion[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_versions")
    .select("*")
    .eq("content_id", contentId)
    .order("version_number", { ascending: false });

  if (error) {
    logger.error("Failed to fetch content versions", error, { contentId });
    throw error;
  }

  return data || [];
}

/**
 * Get a specific version of content
 */
export async function getContentVersion(
  contentId: string,
  versionNumber: number
): Promise<ContentVersion | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_versions")
    .select("*")
    .eq("content_id", contentId)
    .eq("version_number", versionNumber)
    .single();

  if (error) {
    logger.error("Failed to fetch content version", error, { contentId, versionNumber });
    throw error;
  }

  return data;
}

/**
 * Get the latest version number for a content item
 */
export async function getLatestVersionNumber(contentId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_versions")
    .select("version_number")
    .eq("content_id", contentId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    logger.error("Failed to fetch latest version number", error, { contentId });
    return 0;
  }

  return data?.version_number || 0;
}

/**
 * Restore a previous version of content
 */
export async function restoreContentVersion(
  contentId: string,
  versionNumber: number,
  restoredBy: string
): Promise<void> {
  const supabase = createClient();

  // Get the version to restore
  const version = await getContentVersion(contentId, versionNumber);

  if (!version) {
    throw new Error(`Version ${versionNumber} not found for content ${contentId}`);
  }

  // Update the current content with the version data
  const { error } = await supabase
    .from("knowledge_base_content")
    .update({
      title: version.title,
      content: version.content,
      excerpt: version.excerpt,
      content_type: version.content_type,
      status: version.status,
      tags: version.tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contentId);

  if (error) {
    logger.error("Failed to restore content version", error, { contentId, versionNumber });
    throw error;
  }

  logger.info("Content version restored", {
    contentId,
    versionNumber,
    restoredBy,
  });
}

/**
 * Compare two versions of content
 */
export function compareVersions(
  oldVersion: ContentVersion,
  newVersion: ContentVersion
): {
  titleChanged: boolean;
  contentChanged: boolean;
  statusChanged: boolean;
  tagsChanged: boolean;
} {
  return {
    titleChanged: oldVersion.title !== newVersion.title,
    contentChanged: oldVersion.content !== newVersion.content,
    statusChanged: oldVersion.status !== newVersion.status,
    tagsChanged: JSON.stringify(oldVersion.tags) !== JSON.stringify(newVersion.tags),
  };
}

/**
 * Get version history with change summaries
 */
export async function getVersionHistory(contentId: string): Promise<
  Array<{
    version: number;
    timestamp: string;
    changedBy?: string;
    changeSummary?: string;
    changes: string[];
  }>
> {
  const versions = await getContentVersions(contentId);

  const history = versions.map((version, index) => {
    const changes: string[] = [];

    // Compare with previous version if it exists
    const prevVersion = versions[index + 1];
    if (prevVersion) {
      const diff = compareVersions(prevVersion, version);

      if (diff.titleChanged) changes.push("Title changed");
      if (diff.contentChanged) changes.push("Content updated");
      if (diff.statusChanged) changes.push(`Status changed to ${version.status}`);
      if (diff.tagsChanged) changes.push("Tags updated");
    } else {
      changes.push("Initial version");
    }

    return {
      version: version.version_number,
      timestamp: version.created_at,
      changedBy: version.changed_by,
      changeSummary: version.change_summary,
      changes,
    };
  });

  return history;
}

/**
 * Delete old versions (keep only the last N versions)
 */
export async function pruneOldVersions(
  contentId: string,
  keepCount: number = 10
): Promise<number> {
  const supabase = createClient();

  // Get versions to delete
  const { data: versionsToDelete, error: fetchError } = await supabase
    .from("content_versions")
    .select("id, version_number")
    .eq("content_id", contentId)
    .order("version_number", { ascending: false })
    .range(keepCount, 1000); // Delete all beyond keepCount

  if (fetchError) {
    logger.error("Failed to fetch versions for pruning", fetchError, { contentId });
    throw fetchError;
  }

  if (!versionsToDelete || versionsToDelete.length === 0) {
    return 0;
  }

  // Delete old versions
  const versionIds = versionsToDelete.map((v) => v.id);
  const { error: deleteError } = await supabase
    .from("content_versions")
    .delete()
    .in("id", versionIds);

  if (deleteError) {
    logger.error("Failed to delete old versions", deleteError, { contentId });
    throw deleteError;
  }

  logger.info("Pruned old content versions", {
    contentId,
    deletedCount: versionsToDelete.length,
  });

  return versionsToDelete.length;
}
