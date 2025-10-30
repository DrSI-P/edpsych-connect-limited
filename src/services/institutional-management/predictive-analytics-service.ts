import { prisma } from '../../lib/prisma';

/**
 * Types for student outcome analytics
 */
interface StudentOutcomePrediction {
  studentId: string;
  targetOutcome: string;
  probabilityScore: number;
  contributingFactors: {
    factor: string;
    weight: number;
    description: string;
  }[];
  recommendedInterventions: {
    id: string;
    name: string;
    description: string;
    expectedImpact: number;
  }[];
  confidenceLevel: number;
  predictionDate: Date;
}

interface PerformanceTrend {
  metric: string;
  dataPoints: {
    date: Date;
    value: number;
  }[];
  trend: 'improving' | 'declining' | 'stable';
  percentageChange: number;
  comparisonPeriod: string;
}

interface InstitutionBenchmark {
  metric: string;
  institutionValue: number;
  benchmarkValue: number;
  percentageDifference: number;
  rank?: number;
  totalInstitutions?: number;
}

/**
 * Service for predictive analytics related to student outcomes
 */
class PredictiveAnalyticsService {
  /**
   * Generate predictions for student outcomes based on historical data and various factors
   * 
   * @param id - The institution to generate predictions for
   * @param outcomeType - The type of outcome to predict (e.g., 'academic_performance', 'attendance')
   * @param timeframe - Timeframe for the prediction in days
   * @returns Array of student outcome predictions
   */
  async generateStudentOutcomePredictions(
    id: string,
    outcomeType: string = 'academic_performance',
    timeframe: number = 90
  ): Promise<StudentOutcomePrediction[]> {
    try {
      // In a real implementation, we would query the actual database
      // This is a simplified mock implementation for demonstration
      
      // Mock student data for demonstration
      const institutionStudents = await this.getMockStudentData(id);

      // Prepare predictions for each student
      const predictions: StudentOutcomePrediction[] = [];

      for (const student of institutionStudents) {
        // Calculate baseline metrics
        const assessmentScores = student.assessmentResults.map((result: any) => result.score || 0);
        const averageScore = assessmentScores.length > 0
          ? assessmentScores.reduce((a: number, b: number) => a + b, 0) / assessmentScores.length
          : 0;
        
        const interventionProgress = student.interventions.map((intervention: any) => {
          const progressRecords = intervention.progressRecords || [];
          return progressRecords.length > 0
            ? progressRecords[progressRecords.length - 1].progressPercentage || 0
            : 0;
        });
        
        const averageInterventionProgress = interventionProgress.length > 0
          ? interventionProgress.reduce((a: number, b: number) => a + b, 0) / interventionProgress.length
          : 0;
        
        // Analyze engagement from activities
        const engagementScore = this.calculateEngagementScore(student.activities);
        
        // Generate prediction based on analyzed factors
        // This would normally use a trained ML model - simplified for demonstration
        const predictionFactors = [
          {
            factor: 'Assessment Performance',
            weight: 0.35,
            value: averageScore,
            description: `Average assessment score: ${averageScore.toFixed(1)}%`
          },
          {
            factor: 'Intervention Progress',
            weight: 0.25,
            value: averageInterventionProgress,
            description: `Average intervention progress: ${averageInterventionProgress.toFixed(1)}%`
          },
          {
            factor: 'Engagement Level',
            weight: 0.20,
            value: engagementScore,
            description: `Platform engagement score: ${engagementScore.toFixed(1)}/10`
          },
          {
            factor: 'Attendance Rate',
            weight: 0.15,
            value: student.studentProfile?.attendanceRate || 0,
            description: `Attendance rate: ${(student.studentProfile?.attendanceRate || 0).toFixed(1)}%`
          },
          {
            factor: 'Previous Performance Trend',
            weight: 0.05,
            value: this.calculatePerformanceTrend(student.assessmentResults),
            description: `Performance trend: ${this.calculatePerformanceTrend(student.assessmentResults) > 0 ? 'Improving' : 'Declining'}`
          }
        ];
        
        // Calculate weighted prediction score
        const predictionScore = predictionFactors.reduce(
          (score: number, factor: any) => score + (factor.value * factor.weight),
          0
        );
        
        // Convert to probability (0-1)
        const probabilityScore = Math.min(Math.max(predictionScore / 100, 0), 1);
        
        // Determine recommended interventions based on factors
        const recommendedInterventions = await this.getRecommendedInterventions(
          student.id, 
          predictionFactors, 
          outcomeType
        );
        
        // Create prediction object
        const prediction: StudentOutcomePrediction = {
          studentId: student.id,
          targetOutcome: outcomeType,
          probabilityScore,
          contributingFactors: predictionFactors.map(f => ({
            factor: f.factor,
            weight: f.weight,
            description: f.description
          })),
          recommendedInterventions,
          confidenceLevel: this.calculateConfidenceLevel(predictionFactors),
          predictionDate: new Date()
        };
        
        predictions.push(prediction);
      }
      
      return predictions;
      
    } catch (error) {
      console.error('Error generating student outcome predictions:', error);
      throw new Error('Failed to generate student outcome predictions');
    }
  }
  
  /**
   * Get performance trends for an institution
   * 
   * @param id - The institution to analyze
   * @param metrics - Array of metrics to analyze
   * @param timeframe - Timeframe for trend analysis in days
   */
  async getPerformanceTrends(
    id: string,
    metrics: string[] = ['assessment_completion', 'average_score', 'intervention_progress'],
    timeframe: number = 90
  ): Promise<PerformanceTrend[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframe);
      
      const trends: PerformanceTrend[] = [];
      
      for (const metric of metrics) {
        let dataPoints: {date: Date, value: number}[] = [];
        let trend: 'improving' | 'declining' | 'stable' = 'stable';
        let percentageChange = 0;
        
        // Get historical data based on metric
        switch (metric) {
          case 'assessment_completion':
            dataPoints = await this.getAssessmentCompletionTrend(id, cutoffDate);
            break;
          case 'average_score':
            dataPoints = await this.getAverageScoreTrend(id, cutoffDate);
            break;
          case 'intervention_progress':
            dataPoints = await this.getInterventionProgressTrend(id, cutoffDate);
            break;
          // Add more metrics as needed
        }
        
        // Calculate trend direction and percentage change
        if (dataPoints.length >= 2) {
          const oldestValue = dataPoints[0].value;
          const newestValue = dataPoints[dataPoints.length - 1].value;
          
          percentageChange = oldestValue > 0 
            ? ((newestValue - oldestValue) / oldestValue) * 100
            : 0;
          
          if (percentageChange > 5) {
            trend = 'improving';
          } else if (percentageChange < -5) {
            trend = 'declining';
          } else {
            trend = 'stable';
          }
        }
        
        trends.push({
          metric,
          dataPoints,
          trend,
          percentageChange,
          comparisonPeriod: `Last ${timeframe} days`
        });
      }
      
      return trends;
      
    } catch (error) {
      console.error('Error getting performance trends:', error);
      throw new Error('Failed to get performance trends');
    }
  }
  
  /**
   * Get institutional benchmarks comparing to similar institutions
   * 
   * @param id - The institution to benchmark
   * @param metrics - Array of metrics for benchmarking
   */
  async getInstitutionalBenchmarks(
    id: string,
    metrics: string[] = ['assessment_completion', 'average_score', 'intervention_effectiveness']
  ): Promise<InstitutionBenchmark[]> {
    try {
      // Fetch institution data and similar institutions using raw SQL query
      // This approach works regardless of the actual model structure
      const institutionQuery = `
        SELECT
          id, name, type,
          COALESCE(student_count, 0) as student_count,
          COALESCE(teacher_count, 0) as teacher_count,
          local_authority
        FROM
          "${id.includes('school') ? 'School' : 'Institution'}"
        WHERE
          id = $1
      `;
      
      const institutionResult = await prisma.$queryRaw`${institutionQuery}::text, ${id}`;
      const institution = Array.isArray(institutionResult) && institutionResult.length > 0
        ? institutionResult[0]
        : null;
      
      if (!institution) {
        throw new Error('Institution not found');
      }
      
      // Get similar institutions based on type
      const similarInstitutionsQuery = `
        SELECT
          id, name, type,
          COALESCE(student_count, 0) as student_count,
          COALESCE(teacher_count, 0) as teacher_count
        FROM
          "${id.includes('school') ? 'School' : 'Institution'}"
        WHERE
          id != $1
          AND type = $2
          AND local_authority = $3
        LIMIT 10
      `;
      
      const similarInstitutions = await prisma.$queryRaw`
        ${similarInstitutionsQuery}::text,
        ${id},
        ${institution.type},
        ${institution.local_authority}
      `;
      
      const benchmarks: InstitutionBenchmark[] = [];
      
      for (const metric of metrics) {
        // Calculate institution's value for this metric
        const institutionValue = await this.calculateInstitutionMetric(institution, metric);
        
        // Calculate benchmark (average of similar institutions)
        // Cast the SQL result to the proper type
        const typedSimilarInstitutions = similarInstitutions as any[];
        
        const similarValues = await Promise.all(
          typedSimilarInstitutions.map(inst => this.calculateInstitutionMetric(inst, metric))
        );
        
        const benchmarkValue = similarValues.length > 0
          ? similarValues.reduce((a: number, b: number) => a + b, 0) / similarValues.length
          : 0;
        
        // Calculate percentage difference
        const percentageDifference = benchmarkValue > 0
          ? ((institutionValue - benchmarkValue) / benchmarkValue) * 100
          : 0;
        
        // Calculate rank
        const allValues = [institutionValue, ...similarValues].sort((a: number, b: number) => b - a);
        const rank = allValues.indexOf(institutionValue) + 1;
        
        benchmarks.push({
          metric,
          institutionValue,
          benchmarkValue,
          percentageDifference,
          rank,
          totalInstitutions: typedSimilarInstitutions.length + 1
        });
      }
      
      return benchmarks;
      
    } catch (error) {
      console.error('Error getting institutional benchmarks:', error);
      throw new Error('Failed to get institutional benchmarks');
    }
  }
  
  /**
   * Mock data methods for demonstration
   */
  
  private async getMockStudentData(id: string): Promise<any[]> {
    // Generate mock student data with assessment results, interventions, and activities
    return Array.from({ length: 10 }, (_, i) => ({
      id: `student-${i + 1}`,
      name: `Student ${i + 1}`,
      role: 'STUDENT',
      studentProfile: {
        attendanceRate: 85 + Math.random() * 15
      },
      assessmentResults: Array.from({ length: 5 }, (_, j) => ({
        id: `result-${i}-${j}`,
        score: 60 + Math.random() * 40,
        completedAt: new Date(Date.now() - j * 7 * 24 * 60 * 60 * 1000)
      })),
      interventions: Array.from({ length: 2 }, (_, j) => ({
        id: `intervention-${i}-${j}`,
        title: `Intervention ${j + 1}`,
        progressRecords: Array.from({ length: 3 }, (_, k) => ({
          id: `progress-${i}-${j}-${k}`,
          progressPercentage: k * 33.3,
          recordedAt: new Date(Date.now() - k * 7 * 24 * 60 * 60 * 1000)
        }))
      })),
      activities: Array.from({ length: 20 }, (_, j) => ({
        id: `activity-${i}-${j}`,
        type: ['login', 'assessment', 'resource_view', 'intervention'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - j * 24 * 60 * 60 * 1000)
      }))
    }));
  }

  /**
   * Private helper methods
   */
  
  private calculateEngagementScore(activities: any[]): number {
    if (!activities || activities.length === 0) {
      return 0;
    }
    
    // Simple engagement scoring based on activity count and recency
    const activityCount = Math.min(activities.length, 50);
    const activityScore = activityCount / 50 * 7.5;
    
    // Recency score (higher if recent activity)
    const mostRecentActivity = activities[0]?.createdAt || new Date(0);
    const daysSinceLastActivity = Math.max(
      0, 
      (Date.now() - mostRecentActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const recencyScore = Math.max(0, 2.5 - (daysSinceLastActivity / 7) * 2.5);
    
    return Math.min(activityScore + recencyScore, 10);
  }
  
  private calculatePerformanceTrend(assessmentResults: any[]): number {
    if (!assessmentResults || assessmentResults.length < 2) {
      return 0;
    }
    
    // Calculate slope of assessment scores over time
    const scores = assessmentResults.map(result => ({
      date: result.completedAt.getTime(),
      score: result.score || 0
    }));
    
    // Sort by date
    scores.sort((a: any, b: any) => a.date - b.date);
    
    // Simple linear regression to calculate trend
    const n = scores.length;
    const sumX = scores.reduce((sum: number, point: any) => sum + point.date, 0);
    const sumY = scores.reduce((sum: number, point: any) => sum + point.score, 0);
    const sumXY = scores.reduce((sum: number, point: any) => sum + point.date * point.score, 0);
    const sumXX = scores.reduce((sum: number, point: any) => sum + point.date * point.date, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Normalize and return trend direction
    return slope * 1e9; // Scale up since timestamps are large numbers
  }
  
  private calculateConfidenceLevel(factors: any[]): number {
    // More factors with high weights = higher confidence
    const weightedFactorCount = factors.reduce(
      (sum: number, factor: any) => sum + (factor.weight * (factor.value > 0 ? 1 : 0)),
      0
    );
    
    // Scale to 0-1
    return Math.min(Math.max(weightedFactorCount * 2, 0), 1);
  }
  
  private async getRecommendedInterventions(
    studentId: string, 
    factors: any[], 
    outcomeType: string
  ): Promise<any[]> {
    // Find interventions that address the lowest performing factors
    const weakestFactors = factors
      .filter((f: any) => f.value < 0.6)
      .sort((a: any, b: any) => a.value - b.value)
      .slice(0, 2);
    
    if (weakestFactors.length === 0) {
      return [];
    }
    
    // Mock intervention templates for demonstration
    const mockInterventions = [
      {
        id: 'intervention-template-1',
        name: 'Targeted Reading Intervention',
        description: 'A structured program to improve reading comprehension and fluency',
        effectivenessScore: 0.85
      },
      {
        id: 'intervention-template-2',
        name: 'Mathematics Skill Builder',
        description: 'Progressive exercises to build foundational math skills',
        effectivenessScore: 0.82
      },
      {
        id: 'intervention-template-3',
        name: 'Attendance Improvement Program',
        description: 'Structured approach to address attendance issues and encourage participation',
        effectivenessScore: 0.78
      },
      {
        id: 'intervention-template-4',
        name: 'Engagement Enhancement Activities',
        description: 'Interactive activities designed to increase student engagement',
        effectivenessScore: 0.75
      },
      {
        id: 'intervention-template-5',
        name: 'Performance Tracking System',
        description: 'A personalized system for students to track and improve their academic performance',
        effectivenessScore: 0.72
      }
    ];
    
    // Filter interventions based on weakest factors
    const factorKeywords = weakestFactors.map((f: any) => f.factor.toLowerCase());
    let recommendedInterventions = mockInterventions;
    
    // Simple filtering logic to simulate database query
    if (factorKeywords.includes('assessment performance')) {
      recommendedInterventions = recommendedInterventions.filter((i: any) =>
        i.name.toLowerCase().includes('skill') ||
        i.description.toLowerCase().includes('academic')
      );
    }
    
    if (factorKeywords.includes('attendance rate')) {
      recommendedInterventions = recommendedInterventions.filter((i: any) =>
        i.name.toLowerCase().includes('attendance') ||
        i.description.toLowerCase().includes('attendance')
      );
    }
    
    if (factorKeywords.includes('engagement level')) {
      recommendedInterventions = recommendedInterventions.filter((i: any) =>
        i.name.toLowerCase().includes('engagement') ||
        i.description.toLowerCase().includes('engagement')
      );
    }
    
    // Return top 3 interventions sorted by effectiveness
    recommendedInterventions = recommendedInterventions
      .sort((a: any, b: any) => b.effectivenessScore - a.effectivenessScore)
      .slice(0, 3);
    
    return recommendedInterventions.map((intervention: any) => ({
      id: intervention.id,
      name: intervention.name,
      description: intervention.description || '',
      expectedImpact: intervention.effectivenessScore || 0.7
    }));
  }
  
  private async getAssessmentCompletionTrend(
    id: string,
    cutoffDate: Date
  ): Promise<{date: Date, value: number}[]> {
    // This would query assessment completion rates grouped by time periods
    
    // Group by week
    const weeklyData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', "completedAt") as week,
        COUNT(*) as count
      FROM "AssessmentResult" ar
      JOIN "User" u ON ar."id" = u.id
      JOIN "InstitutionUser" iu ON u.id = iu."id"
      WHERE iu."id" = ${id}
      AND ar."completedAt" >= ${cutoffDate}
      GROUP BY week
      ORDER BY week ASC
    `;
    
    return (weeklyData as any[]).map((row: any) => ({
      date: row.week,
      value: Number(row.count)
    }));
  }
  
  private async getAverageScoreTrend(
    id: string,
    cutoffDate: Date
  ): Promise<{date: Date, value: number}[]> {
    // This would query average assessment scores grouped by time periods
    
    // Group by week
    const weeklyData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', "completedAt") as week,
        AVG(score) as avg_score
      FROM "AssessmentResult" ar
      JOIN "User" u ON ar."id" = u.id
      JOIN "InstitutionUser" iu ON u.id = iu."id"
      WHERE iu."id" = ${id}
      AND ar."completedAt" >= ${cutoffDate}
      GROUP BY week
      ORDER BY week ASC
    `;
    
    return (weeklyData as any[]).map((row: any) => ({
      date: row.week,
      value: Number(row.avg_score)
    }));
  }
  
  private async getInterventionProgressTrend(
    id: string,
    cutoffDate: Date
  ): Promise<{date: Date, value: number}[]> {
    // This would query intervention progress records grouped by time periods
    
    // Group by week
    const weeklyData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', pr."recordedAt") as week,
        AVG(pr."progressPercentage") as avg_progress
      FROM "ProgressRecord" pr
      JOIN "Intervention" i ON pr."interventionId" = i.id
      JOIN "User" u ON i."id" = u.id
      JOIN "InstitutionUser" iu ON u.id = iu."id"
      WHERE iu."id" = ${id}
      AND pr."recordedAt" >= ${cutoffDate}
      GROUP BY week
      ORDER BY week ASC
    `;
    
    return (weeklyData as any[]).map((row: any) => ({
      date: row.week,
      value: Number(row.avg_progress)
    }));
  }
  
  private async calculateInstitutionMetric(institution: any, metric: string): Promise<number> {
    // Calculate various metrics for an institution
    // This would be a complex calculation based on the specific metric
    // Simplified implementation for demonstration
    
    switch (metric) {
      case 'assessment_completion':
        // e.g. average number of assessments per student
        return 8.5;
        
      case 'average_score':
        // e.g. average assessment score
        return 76.3;
        
      case 'intervention_effectiveness':
        // e.g. percentage of interventions with positive outcomes
        return 68.7;
        
      default:
        return 0;
    }
  }
}

export default new PredictiveAnalyticsService();