import { 
  CreateContentSimilarityInput, 
  UpdateContentSimilarityInput,
  SimilarityType
} from "../../types/recommendation-engine-types";
import db from "./database-adapter";

/**
 * Service for managing content similarity relationships
 */
export class ContentSimilarityService {
  /**
   * Create a new content similarity record
   */
  async createSimilarity(data: CreateContentSimilarityInput) {
    return db.createContentSimilarity({
      contentIdA: data.contentIdA,
      contentIdB: data.contentIdB,
      similarityScore: data.similarityScore,
      similarityType: data.similarityType
    });
  }
  
  /**
   * Get similar content for a specific content item
   */
  async getSimilarContent(contentId: string) {
    return db.getContentSimilarities(contentId);
  }

  /**
   * Get similar content by similarity type
   */
  async getSimilarContentByType(contentId: string, similarityType: SimilarityType) {
    const result = await db.executeQuery(
      `SELECT cs.*, 
        CASE 
          WHEN cs."contentIdA" = $1 THEN cs."contentIdB" 
          ELSE cs."contentIdA" 
        END as "relatedContentId",
        c.title as "relatedContentTitle",
        c.type as "relatedContentType"
      FROM "ContentSimilarity" cs
      JOIN "Content" c ON c.id = 
        CASE 
          WHEN cs."contentIdA" = $1 THEN cs."contentIdB" 
          ELSE cs."contentIdA" 
        END
      WHERE (cs."contentIdA" = $1 OR cs."contentIdB" = $1) AND cs."similarityType" = $2
      ORDER BY cs."similarityScore" DESC`,
      [contentId, similarityType]
    );
    return result.rows;
  }
  
  /**
   * Update a similarity record
   */
  async updateSimilarity(id: string, data: UpdateContentSimilarityInput) {
    const query = `
      UPDATE "ContentSimilarity"
      SET "similarityScore" = $1, "similarityType" = $2, "updatedAt" = $3
      WHERE "id" = $4
      RETURNING *;
    `;
    const values = [
      data.similarityScore,
      data.similarityType,
      new Date(),
      id
    ];
    
    const result = await db.executeQuery(query, values);
    return result.rows[0];
  }
  
  /**
   * Delete a similarity record
   */
  async deleteSimilarity(id: string) {
    const query = `
      DELETE FROM "ContentSimilarity"
      WHERE "id" = $1
      RETURNING *;
    `;
    const result = await db.executeQuery(query, [id]);
    return result.rows[0];
  }
  
  /**
   * Calculate content-based similarity using TF-IDF on titles and descriptions
   * This is a simplified implementation that could be enhanced with NLP libraries
   */
  async calculateContentBasedSimilarity(contentId: string) {
    // First, get the target content
    const targetContentQuery = `
      SELECT id, title, description, type FROM "Content"
      WHERE id = $1;
    `;
    const targetContentResult = await db.executeQuery(targetContentQuery, [contentId]);
    
    if (targetContentResult.rows.length === 0) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    const targetContent = targetContentResult.rows[0];
    
    // Get other content of the same type to compare
    const otherContentQuery = `
      SELECT id, title, description, type FROM "Content"
      WHERE id != $1 AND type = $2
      LIMIT 100;
    `;
    const otherContentResult = await db.executeQuery(otherContentQuery, [contentId, targetContent.type]);
    
    const similarityRecords = [];
    
    // Simple text similarity calculation based on word overlap
    for (const otherContent of otherContentResult.rows) {
      const targetText = `${targetContent.title} ${targetContent.description || ''}`.toLowerCase();
      const otherText = `${otherContent.title} ${otherContent.description || ''}`.toLowerCase();
      
      const targetWords = targetText.split(/\W+/).filter((w: string) => w.length > 3);
      const otherWords = otherText.split(/\W+/).filter((w: string) => w.length > 3);
      
      // Calculate Jaccard similarity
      const targetSet = new Set(targetWords);
      const otherSet = new Set(otherWords);
      
      // Use Array.from instead of spread operator for better compatibility
      const intersection = new Set(Array.from(targetSet).filter((x: string) => otherSet.has(x)));
      const union = new Set();
      targetWords.forEach((word: string) => union.add(word));
      otherWords.forEach((word: string) => union.add(word));
      
      const similarityScore = intersection.size / union.size;
      
      if (similarityScore > 0.1) { // Only store if similarity is above threshold
        similarityRecords.push({
          contentIdA: targetContent.id,
          contentIdB: otherContent.id,
          similarityScore,
          similarityType: SimilarityType.CONTENT_BASED
        });
      }
    }
    
    // Store the similarity records
    for (const record of similarityRecords) {
      // Check if a record already exists
      const existingQuery = `
        SELECT id FROM "ContentSimilarity"
        WHERE (("contentIdA" = $1 AND "contentIdB" = $2) OR ("contentIdA" = $2 AND "contentIdB" = $1))
        AND "similarityType" = $3
      `;
      const existingResult = await db.executeQuery(existingQuery, [
        record.contentIdA, 
        record.contentIdB,
        SimilarityType.CONTENT_BASED
      ]);
      
      if (existingResult.rows.length > 0) {
        // Update existing record
        await this.updateSimilarity(existingResult.rows[0].id, {
          id: existingResult.rows[0].id,
          similarityScore: record.similarityScore
        });
      } else {
        // Create new record
        await this.createSimilarity(record);
      }
    }
    
    return similarityRecords;
  }
  
  /**
   * Calculate tag-based similarity between content items
   */
  async calculateTagBasedSimilarity(contentId: string) {
    // First get the tags for this content
    const contentTagsQuery = `
      SELECT t.id, t.name
      FROM "Tag" t
      JOIN "ContentTag" ct ON t.id = ct."tagId"
      WHERE ct."contentId" = $1
    `;
    const contentTagsResult = await db.executeQuery(contentTagsQuery, [contentId]);
    
    if (contentTagsResult.rows.length === 0) {
      return []; // No tags to compare
    }
    
    const contentTags = contentTagsResult.rows;
    const tagIds = contentTags.map((tag: any) => tag.id);
    
    // Find other content with the same tags
    const similarContentQuery = `
      SELECT c.id, c.title, COUNT(ct."tagId") as tag_match_count
      FROM "Content" c
      JOIN "ContentTag" ct ON c.id = ct."contentId"
      WHERE c.id != $1 AND ct."tagId" IN (${tagIds.map((_: any, i: number) => `$${i+2}`).join(',')})
      GROUP BY c.id, c.title
      HAVING COUNT(ct."tagId") > 0
      ORDER BY tag_match_count DESC
      LIMIT 50
    `;
    
    const similarContentResult = await db.executeQuery(
      similarContentQuery, 
      [contentId, ...tagIds]
    );
    
    const similarityRecords = [];
    
    for (const similarContent of similarContentResult.rows) {
      // Calculate similarity score based on tag overlap
      const similarityScore = similarContent.tag_match_count / contentTags.length;
      
      similarityRecords.push({
        contentIdA: contentId,
        contentIdB: similarContent.id,
        similarityScore,
        similarityType: SimilarityType.TAG_BASED
      });
    }
    
    // Store the similarity records
    for (const record of similarityRecords) {
      // Check if a record already exists
      const existingQuery = `
        SELECT id FROM "ContentSimilarity"
        WHERE (("contentIdA" = $1 AND "contentIdB" = $2) OR ("contentIdA" = $2 AND "contentIdB" = $1))
        AND "similarityType" = $3
      `;
      const existingResult = await db.executeQuery(existingQuery, [
        record.contentIdA, 
        record.contentIdB,
        SimilarityType.TAG_BASED
      ]);
      
      if (existingResult.rows.length > 0) {
        // Update existing record
        await this.updateSimilarity(existingResult.rows[0].id, {
          id: existingResult.rows[0].id,
          similarityScore: record.similarityScore
        });
      } else {
        // Create new record
        await this.createSimilarity(record);
      }
    }
    
    return similarityRecords;
  }
  
  /**
   * Calculate collaborative filtering similarity based on user interactions
   */
  async calculateCollaborativeSimilarity(contentId: string) {
    // Get users who interacted with this content
    const usersQuery = `
      SELECT DISTINCT "id" 
      FROM "ContentInteraction"
      WHERE "contentId" = $1
    `;
    const usersResult = await db.executeQuery(usersQuery, [contentId]);
    
    if (usersResult.rows.length === 0) {
      return []; // No user interactions to use
    }
    
    const userIds = usersResult.rows.map((row: any) => row.id);
    
    // Find other content that these users interacted with
    const otherContentQuery = `
      SELECT ci."contentId", COUNT(DISTINCT ci."id") as user_overlap_count
      FROM "ContentInteraction" ci
      WHERE ci."id" IN (${userIds.map((_: any, i: number) => `$${i+1}`).join(',')})
      AND ci."contentId" != $${userIds.length+1}
      GROUP BY ci."contentId"
      HAVING COUNT(DISTINCT ci."id") > 1
      ORDER BY user_overlap_count DESC
      LIMIT 50
    `;
    
    const otherContentResult = await db.executeQuery(
      otherContentQuery,
      [...userIds, contentId]
    );
    
    const similarityRecords = [];
    
    for (const otherContent of otherContentResult.rows) {
      // Calculate similarity score based on user overlap
      const similarityScore = otherContent.user_overlap_count / userIds.length;
      
      similarityRecords.push({
        contentIdA: contentId,
        contentIdB: otherContent.contentId,
        similarityScore,
        similarityType: SimilarityType.COLLABORATIVE
      });
    }
    
    // Store the similarity records
    for (const record of similarityRecords) {
      // Check if a record already exists
      const existingQuery = `
        SELECT id FROM "ContentSimilarity"
        WHERE (("contentIdA" = $1 AND "contentIdB" = $2) OR ("contentIdA" = $2 AND "contentIdB" = $1))
        AND "similarityType" = $3
      `;
      const existingResult = await db.executeQuery(existingQuery, [
        record.contentIdA, 
        record.contentIdB,
        SimilarityType.COLLABORATIVE
      ]);
      
      if (existingResult.rows.length > 0) {
        // Update existing record
        await this.updateSimilarity(existingResult.rows[0].id, {
          id: existingResult.rows[0].id,
          similarityScore: record.similarityScore
        });
      } else {
        // Create new record
        await this.createSimilarity(record);
      }
    }
    
    return similarityRecords;
  }
  
  /**
   * Run all similarity algorithms for a piece of content
   */
  async analyzeContentSimilarity(contentId: string) {
    const results = {
      contentBased: await this.calculateContentBasedSimilarity(contentId),
      tagBased: await this.calculateTagBasedSimilarity(contentId),
      collaborative: await this.calculateCollaborativeSimilarity(contentId)
    };
    
    return results;
  }
}

export default new ContentSimilarityService();