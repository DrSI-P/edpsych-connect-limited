import { CreateUserPreferenceInput, UpdateUserPreferenceInput } from "../../types/recommendation-engine-types";
import db from "./database-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service for managing user preferences for the recommendation engine
 */
export class UserPreferenceService {
  /**
   * Create a new user preference
   */
  async createPreference(data: CreateUserPreferenceInput) {
    return db.createUserPreference({
      id: data.id,
      categoryId: data.categoryId,
      tagId: data.tagId,
      contentType: data.contentType,
      weight: data.weight || 1.0
    });
  }

  /**
   * Get all preferences for a user
   */
  async getUserPreferences(id: string) {
    return db.getUserPreferences(id);
  }

  /**
   * Get preferences by category for a user
   */
  async getUserCategoryPreferences(id: string, categoryId: string) {
    const allPreferences = await db.getUserPreferences(id);
    return allPreferences.filter((pref: any) => pref.categoryId === categoryId);
  }

  /**
   * Get preferences by tag for a user
   */
  async getUserTagPreferences(id: string, tagId: string) {
    const allPreferences = await db.getUserPreferences(id);
    return allPreferences.filter((pref: any) => pref.tagId === tagId);
  }

  /**
   * Get preferences by content type for a user
   */
  async getUserContentTypePreferences(id: string, contentType: string) {
    const allPreferences = await db.getUserPreferences(id);
    return allPreferences.filter((pref: any) => pref.contentType === contentType);
  }

  /**
   * Update a user preference
   */
  async updatePreference(id: string, data: UpdateUserPreferenceInput) {
    return db.updateUserPreference(id, {
      categoryId: data.categoryId,
      tagId: data.tagId,
      contentType: data.contentType,
      weight: data.weight
    });
  }

  /**
   * Delete a user preference
   */
  async deletePreference(id: string) {
    return db.deleteUserPreference(id);
  }

  /**
   * Get user preference analytics
   */
  async getUserPreferenceAnalytics(id: string) {
    const categoryPreferences = await prisma.userPreference.groupBy({
      by: ['category'],
      where: {
        userId: id,
      },
      _count: true,
    });

    const typePreferences = await prisma.userPreference.groupBy({
      by: ['type'],
      where: {
        userId: id,
      },
      _count: true,
    });

    return {
      categoryPreferences,
      typePreferences,
      total: await prisma.userPreference.count({ where: { userId: id } }),
    };
  }

  /**
   * Bulk update user preferences
   */
  async bulkUpdatePreferences(preferences: UpdateUserPreferenceInput[]) {
    const updates = preferences.map((pref: UpdateUserPreferenceInput) => {
      return prisma.userPreference.update({
        where: { id: pref.id! },
        data: {
          category: pref.categoryId,
          type: pref.contentType,
          value: pref as any,
        }
      });
    });
    
    return prisma.$transaction(updates);
  }

  /**
   * Increment preference weight
   */
  async incrementPreferenceWeight(id: string, incrementBy: number = 0.1) {
    const preference = await prisma.userPreference.findUnique({
      where: { id },
    });

    if (!preference) {
      throw new Error(`Preference with ID ${id} not found`);
    }

    const currentValue = preference.value as any;
    const newValue = {
      ...currentValue,
      weight: (currentValue?.weight || 0) + incrementBy,
    };

    return prisma.userPreference.update({
      where: { id },
      data: {
        value: newValue,
      },
    });
  }
}

export default new UserPreferenceService();