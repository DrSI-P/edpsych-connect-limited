// This is a central export file for the Gamification API
// All implementations should reference this file

import { GamificationImpl } from './gamificationImpl';
import { logger } from '../utils/logger';

// Add the methods needed by AdvancedAnalyticsDashboard
const enhancedApi = {
  ...GamificationImpl,
  
  // Add methods referenced in components
  getChallenges: async () => {
    logger.info('Getting challenges');
    return [];
  },
  
  getAchievements: async () => {
    logger.info('Getting achievements');
    return [];
  }
};

// Export as the standard name used throughout the application
export const GamificationAPI = enhancedApi;