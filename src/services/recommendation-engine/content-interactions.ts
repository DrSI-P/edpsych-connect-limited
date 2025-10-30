import {
  CreateContentInteractionInput,
  UpdateContentInteractionInput,
  InteractionType,
  ContentPopularityStats
} from "../../types/recommendation-engine-types";
import db from "./database-adapter";

/**
 * Service for tracking and managing content interactions
 */
export class ContentInteractionService {
  /**
   * Record a new content interaction
   */
  async createInteraction(data: CreateContentInteractionInput) {
    return db.createContentInteraction({
      id: data.id,
      contentId: data.contentId,
      interactionType: data.interactionType,
      durationSeconds: data.durationSeconds,
      completionPercentage: data.completionPercentage,
      rating: data.rating,
      bookmarked: data.bookmarked || false
    });
  }

  /**
   * Get interactions by user
   */
  async getUserInteractions(id: string) {
    return db.getUserInteractions(id);
  }

  /**
   * Get interactions for a specific content item
   */
  async getContentInteractions(contentId: string) {
    return db.getContentInteractions(contentId);
  }

  /**
   * Get interactions by type for a user
   */
  async getUserInteractionsByType(id: string, interactionType: InteractionType) {
    const result = await db.executeQuery(
      `SELECT ci.*, c.title as "contentTitle", c.type as "contentType"
       FROM "ContentInteraction" ci
       JOIN "Content" c ON ci."contentId" = c.id
       WHERE ci."id" = $1 AND ci."interactionType" = $2
       ORDER BY ci."createdAt" DESC`,
      [id, interactionType]
    );
    return result.rows;
  }

  /**
   * Get interactions by type for a content item
   */
  async getContentInteractionsByType(contentId: string, interactionType: InteractionType) {
    const result = await db.executeQuery(
      `SELECT ci.*, u.name as "userName", u.email as "userEmail"
       FROM "ContentInteraction" ci
       JOIN "User" u ON ci."id" = u.id
       WHERE ci."contentId" = $1 AND ci."interactionType" = $2
       ORDER BY ci."createdAt" DESC`,
      [contentId, interactionType]
    );
    return result.rows;
  }

  /**
   * Update an interaction
   */
  async updateInteraction(id: string, data: UpdateContentInteractionInput) {
    return db.updateContentInteraction(id, {
      interactionType: data.interactionType,
      durationSeconds: data.durationSeconds,
      completionPercentage: data.completionPercentage,
      rating: data.rating,
      bookmarked: data.bookmarked
    });
  }

  /**
   * Delete an interaction
   */
  async deleteInteraction(id: string) {
    return db.deleteContentInteraction(id);
  }

  /**
   * Toggle a bookmark for a content item
   */
  async toggleBookmark(id: string, contentId: string) {
    const result = await db.executeQuery(
      `SELECT * FROM "ContentInteraction"
       WHERE "id" = $1 AND "contentId" = $2 AND "interactionType" = $3`,
      [id, contentId, InteractionType.BOOKMARK]
    );
    
    const existingBookmark = result.rows[0];

    if (existingBookmark) {
      // Toggle off by deleting the bookmark
      return db.deleteContentInteraction(existingBookmark.id);
    } else {
      // Toggle on by creating a bookmark
      return db.createContentInteraction({
        id,
        contentId,
        interactionType: InteractionType.BOOKMARK,
        bookmarked: true
      });
    }
  }

  /**
   * Rate a content item
   */
  async rateContent(id: string, contentId: string, rating: number) {
    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const result = await db.executeQuery(
      `SELECT * FROM "ContentInteraction"
       WHERE "id" = $1 AND "contentId" = $2 AND "interactionType" = $3`,
      [id, contentId, InteractionType.RATE]
    );
    
    const existingRating = result.rows[0];

    if (existingRating) {
      // Update the existing rating
      return db.updateContentInteraction(existingRating.id, { rating });
    } else {
      // Create a new rating
      return db.createContentInteraction({
        id,
        contentId,
        interactionType: InteractionType.RATE,
        rating
      });
    }
  }

  /**
   * Record a content view
   */
  async recordView(id: string, contentId: string) {
    return db.createContentInteraction({
      id,
      contentId,
      interactionType: InteractionType.VIEW
    });
  }

  /**
   * Record content read with duration
   */
  async recordRead(id: string, contentId: string, durationSeconds: number, completionPercentage?: number) {
    return db.createContentInteraction({
      id,
      contentId,
      interactionType: InteractionType.READ,
      durationSeconds,
      completionPercentage
    });
  }

  /**
   * Record content download
   */
  async recordDownload(id: string, contentId: string) {
    return db.createContentInteraction({
      id,
      contentId,
      interactionType: InteractionType.DOWNLOAD
    });
  }

  /**
   * Record content share
   */
  async recordShare(id: string, contentId: string) {
    return db.createContentInteraction({
      id,
      contentId,
      interactionType: InteractionType.SHARE
    });
  }

  /**
   * Get content popularity statistics
   */
  async getContentPopularityStats(contentId: string): Promise<ContentPopularityStats> {
    // Get view count
    const viewsResult = await db.executeQuery(
      `SELECT COUNT(*) as count FROM "ContentInteraction"
       WHERE "contentId" = $1 AND "interactionType" = $2`,
      [contentId, InteractionType.VIEW]
    );
    const views = parseInt(viewsResult.rows[0].count);

    // Get download count
    const downloadsResult = await db.executeQuery(
      `SELECT COUNT(*) as count FROM "ContentInteraction"
       WHERE "contentId" = $1 AND "interactionType" = $2`,
      [contentId, InteractionType.DOWNLOAD]
    );
    const downloads = parseInt(downloadsResult.rows[0].count);

    // Get bookmark count
    const bookmarksResult = await db.executeQuery(
      `SELECT COUNT(*) as count FROM "ContentInteraction"
       WHERE "contentId" = $1 AND "interactionType" = $2`,
      [contentId, InteractionType.BOOKMARK]
    );
    const bookmarks = parseInt(bookmarksResult.rows[0].count);

    // Get share count
    const sharesResult = await db.executeQuery(
      `SELECT COUNT(*) as count FROM "ContentInteraction"
       WHERE "contentId" = $1 AND "interactionType" = $2`,
      [contentId, InteractionType.SHARE]
    );
    const shares = parseInt(sharesResult.rows[0].count);

    // Get ratings
    const ratingsResult = await db.executeQuery(
      `SELECT rating FROM "ContentInteraction"
       WHERE "contentId" = $1 AND "interactionType" = $2 AND rating IS NOT NULL`,
      [contentId, InteractionType.RATE]
    );
    
    const ratings = ratingsResult.rows;
    const totalRating = ratings.reduce((sum: number, record: any) => sum + (parseFloat(record.rating) || 0), 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // Get total interactions
    const totalResult = await db.executeQuery(
      `SELECT COUNT(*) as count FROM "ContentInteraction" WHERE "contentId" = $1`,
      [contentId]
    );
    const totalInteractions = parseInt(totalResult.rows[0].count);

    return {
      contentId,
      viewCount: views,
      downloadCount: downloads,
      bookmarkCount: bookmarks,
      shareCount: shares,
      averageRating,
      totalInteractions
    };
  }

  /**
   * Get most popular content based on interaction counts
   */
  async getMostPopularContent(limit: number = 10) {
    const result = await db.executeQuery(
      `SELECT "contentId", COUNT(*) as interaction_count
       FROM "ContentInteraction"
       GROUP BY "contentId"
       ORDER BY interaction_count DESC
       LIMIT $1`,
      [limit]
    );
    
    const popularContentIds = result.rows.map((row: any) => row.contentId);
    
    if (popularContentIds.length === 0) {
      return [];
    }
    
    // Get content details
    const contentQuery = `SELECT * FROM "Content" WHERE id IN (${popularContentIds.map((_: any, i: number) => `$${i+1}`).join(',')})`;
    const contentResult = await db.executeQuery(contentQuery, popularContentIds);
    
    return contentResult.rows;
  }
}

export default new ContentInteractionService();