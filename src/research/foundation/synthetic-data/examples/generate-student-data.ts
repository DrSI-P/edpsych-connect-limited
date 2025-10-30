/**
 * Synthetic Data Generation Example
 * 
 * This example demonstrates how to use the synthetic data generation system
 * to create a dataset of student performance data, validate it, and export
 * it in different formats.
 */

import { SyntheticDataGenerator } from '../services/synthetic-data-generator';
import { SyntheticDataType, DemographicDistribution, UKEducationKeyStage, PrivacyMethod } from '../models/synthetic-data';
import { DataValidator } from '../validators/data-validator';
import { exportToFederatedPipeline } from '../utils/federated-integration';
import path from 'path';

/**
 * Example showing how to generate, validate, and export synthetic student data
 */
async function generateStudentDataExample() {
  console.log('Starting synthetic data generation...');
  
  // Create a generator for student performance data
  const generator = new SyntheticDataGenerator({
    // Core configuration
    dataType: SyntheticDataType.STUDENT_PERFORMANCE,
    recordCount: 1000,
    demographicDistribution: DemographicDistribution.UK_NATIONAL,
    
    // UK-specific educational settings
    keyStage: UKEducationKeyStage.KEY_STAGE_2,
    academicYearRange: [2024, 2025],
    includeSpecialEducationalNeeds: true,
    
    // Privacy settings
    privacyMethod: PrivacyMethod.DIFFERENTIAL_PRIVACY,
    
    // Generator settings
    generateRelationships: true,
    seed: 12345, // Fixed seed for reproducibility
    
    // Output settings
    outputDirectory: './output',
    validateOutput: true
  });
  
  console.log('Generating synthetic dataset...');
  const dataset = await generator.generateDataset();
  
  console.log(`Generated ${dataset.records.length} synthetic student records`);
  console.log(`Dataset ID: ${dataset.metadata.id}`);
  
  // Validate the dataset
  console.log('Validating dataset...');
  const validator = new DataValidator({
    strictness: 'high',
    validateStatistics: true,
    validateUtility: true,
    validatePrivacy: true
  });
  
  const validationResult = validator.validate(dataset);
  
  if (validationResult.valid) {
    console.log('Dataset validation passed!');
  } else {
    console.warn('Dataset validation found issues:');
    validationResult.issues.forEach(issue => {
      console.warn(`- [${issue.type}] ${issue.message}`);
    });
  }
  
  // Export to different formats
  console.log('Exporting dataset...');
  
  // CSV export
  const csvPath = path.join('./output', 'student-performance.csv');
  await generator.exportToCsv(csvPath, dataset);
  console.log(`Exported to CSV: ${csvPath}`);
  
  // JSON export
  const jsonPath = path.join('./output', 'student-performance.json');
  await generator.exportToJson(jsonPath, dataset);
  console.log(`Exported to JSON: ${jsonPath}`);
  
  // Export to federated learning pipeline
  console.log('Integrating with federated learning pipeline...');
  const federatedDatasetId = await exportToFederatedPipeline(dataset, {
    projectId: 'educational-analytics-uk',
    trainSplit: 0.8,
    validationSplit: 0.2,
    applyPrivacy: true
  });
  
  console.log(`Dataset exported to federated learning pipeline with ID: ${federatedDatasetId}`);
  
  // Output dataset statistics
  console.log('\nDataset Statistics:');
  Object.entries(dataset.metadata.statistics.fieldStats).forEach(([field, stats]) => {
    console.log(`${field}:`, stats);
  });
  
  return {
    dataset,
    validationResult,
    federatedDatasetId
  };
}

// Run the example if this file is executed directly
if (require.main === module) {
  generateStudentDataExample()
    .then(() => console.log('Example completed successfully'))
    .catch(error => console.error('Example failed:', error));
}

export { generateStudentDataExample };