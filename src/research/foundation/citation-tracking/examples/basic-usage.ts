/**
 * Basic Usage Example
 * 
 * This example demonstrates the basic functionality of the citation tracking system,
 * including tracking citations, managing publications, and calculating impact metrics.
 */

import {
  CitationTrackingService,
  PublicationService,
  ImpactMetricsService,

  Publication,
  PublicationType,
  PublicationStatus,
  AccessType,
  ContributionType,

  Citation,
  CitationType,
  CitationContext,
  CitationSentiment,

  Researcher,
  ResearcherRole,
  AcademicRank,

  MetricSource,
  MetricTimePeriod,
  ResearchField
} from '../index';

async function runExample() {
  console.log('=== EdPsych Connect Citation Tracking System ===');
  console.log('Basic Usage Example\n');
  
  // Initialize services
  const citationService = new CitationTrackingService();
  const publicationService = new PublicationService();
  const impactMetricsService = new ImpactMetricsService();
  
  console.log('1. Creating researchers...');
  
  // Create researchers
  const researcher1 = new Researcher({
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: 'A',
    email: 'jane.smith@university.edu',
    researchInterests: ['Cognitive Development', 'Educational Psychology', 'Learning Assessment'],
    affiliations: [
      {
        institutionName: 'University of Example',
        departmentName: 'Department of Psychology',
        role: ResearcherRole.FACULTY,
        rank: AcademicRank.ASSOCIATE_PROFESSOR,
        isCurrent: true
      }
    ],
    identifiers: [
      {
        type: 'orcid',
        value: '0000-0001-2345-6789',
        url: 'https://orcid.org/0000-0001-2345-6789'
      }
    ]
  });
  
  const researcher2 = new Researcher({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    researchInterests: ['Educational Technology', 'STEM Education', 'Learning Analytics'],
    affiliations: [
      {
        institutionName: 'University of Example',
        departmentName: 'Department of Education',
        role: ResearcherRole.FACULTY,
        rank: AcademicRank.ASSISTANT_PROFESSOR,
        isCurrent: true
      }
    ]
  });
  
  console.log(`Created researchers: ${researcher1.name} and ${researcher2.name}`);
  
  console.log('\n2. Creating publications...');
  
  // Create publications
  const publication1 = new Publication({
    title: 'Cognitive Development in Early Childhood Education',
    abstract: 'This study examines the cognitive development patterns in early childhood education settings...',
    keywords: ['cognitive development', 'early childhood', 'education', 'learning'],
    publicationType: PublicationType.JOURNAL_ARTICLE,
    status: PublicationStatus.PUBLISHED,
    authors: [
      {
        authorId: researcher1.id,
        name: researcher1.name,
        email: researcher1.email,
        orcidId: researcher1.getOrcid(),
        affiliations: ['University of Example'],
        contributionType: ContributionType.FIRST_AUTHOR,
        order: 1
      }
    ],
    publicationDate: new Date('2024-05-15'),
    publicationYear: 2024,
    venue: {
      name: 'Journal of Educational Psychology',
      publisher: 'Academic Publishing Association',
      volume: '42',
      issue: '3',
      pages: '215-230'
    },
    identifiers: [
      {
        type: 'doi',
        value: '10.1234/jep.2024.05.123',
        url: 'https://doi.org/10.1234/jep.2024.05.123'
      }
    ],
    language: 'en',
    accessType: AccessType.OPEN_ACCESS
  });
  
  const publication2 = new Publication({
    title: 'Effectiveness of Educational Technology in STEM Learning',
    abstract: 'This research investigates the effectiveness of various educational technologies in STEM learning environments...',
    keywords: ['educational technology', 'STEM', 'learning', 'effectiveness'],
    publicationType: PublicationType.JOURNAL_ARTICLE,
    status: PublicationStatus.PUBLISHED,
    authors: [
      {
        authorId: researcher2.id,
        name: researcher2.name,
        email: researcher2.email,
        affiliations: ['University of Example'],
        contributionType: ContributionType.FIRST_AUTHOR,
        order: 1
      },
      {
        authorId: researcher1.id,
        name: researcher1.name,
        email: researcher1.email,
        orcidId: researcher1.getOrcid(),
        affiliations: ['University of Example'],
        contributionType: ContributionType.CO_AUTHOR,
        order: 2
      }
    ],
    publicationDate: new Date('2024-06-20'),
    publicationYear: 2024,
    venue: {
      name: 'Journal of Educational Technology',
      publisher: 'Tech Education Publishing',
      volume: '15',
      issue: '2',
      pages: '78-95'
    },
    identifiers: [
      {
        type: 'doi',
        value: '10.5678/jet.2024.06.456',
        url: 'https://doi.org/10.5678/jet.2024.06.456'
      }
    ],
    language: 'en',
    accessType: AccessType.OPEN_ACCESS
  });
  
  // Add publications to service
  await publicationService.createPublication({
    ...publication1,
    id: publication1.id
  });
  
  await publicationService.createPublication({
    ...publication2,
    id: publication2.id
  });
  
  console.log(`Created publications: "${publication1.title}" and "${publication2.title}"`);
  
  // Add publications to researchers
  researcher1.addPublication(publication1.id);
  researcher1.addPublication(publication2.id);
  researcher2.addPublication(publication2.id);
  
  // Set researcher publications in metrics service
  impactMetricsService.setResearcherPublications(researcher1.id, [publication1.id, publication2.id]);
  impactMetricsService.setResearcherPublications(researcher2.id, [publication2.id]);
  
  console.log('\n3. Tracking citations...');
  
  // Create a citation
  const citation = new Citation({
    sourcePublicationId: publication2.id,
    targetPublicationId: publication1.id,
    citationType: CitationType.IN_TEXT,
    citationText: 'As demonstrated by Smith (2024), cognitive development in early childhood is significantly influenced by educational environments.',
    position: {
      section: 'Introduction',
      page: 79,
      paragraph: 2
    },
    semantics: {
      context: CitationContext.BACKGROUND,
      sentiment: CitationSentiment.POSITIVE,
      importance: 8,
      explicitness: 7,
      centrality: 6
    },
    detectedBy: 'manual'
  });
  
  // Track the citation
  const citationResult = await citationService.trackCitation({
    ...citation,
    id: citation.id
  });
  
  if (citationResult.success) {
    console.log(`Created citation from "${publication2.title}" to "${publication1.title}"`);
    
    // Update publication citation count
    await publicationService.incrementCitationCount(publication1.id);
    
    // Set publication citation counts in metrics service
    impactMetricsService.setPublicationCitationCount(publication1.id, 1);
    impactMetricsService.setPublicationCitationCount(publication2.id, 0);
  } else {
    console.error('Failed to create citation:', citationResult.error);
  }
  
  console.log('\n4. Calculating impact metrics...');
  
  // Calculate researcher metrics
  const metricsResult = await impactMetricsService.calculateResearcherMetrics(researcher1.id, {
    timePeriod: MetricTimePeriod.ALL_TIME,
    includeFieldNormalized: true,
    includeAltmetrics: true,
    includeAdvancedMetrics: true,
    source: MetricSource.INTERNAL
  });
  
  if (metricsResult.success) {
    const metrics = metricsResult.data!;
    console.log(`Metrics for ${researcher1.name}:`);
    console.log(`- Publications: ${metrics.publicationCount}`);
    console.log(`- Citations: ${metrics.citationCount}`);
    console.log(`- H-index: ${metrics.hIndex}`);
    console.log(`- G-index: ${metrics.gIndex}`);
    console.log(`- i10-index: ${metrics.i10Index}`);
    
    if (metrics.fieldNormalizedCitationImpact) {
      console.log(`- Field-normalized citation impact: ${metrics.fieldNormalizedCitationImpact.toFixed(2)}`);
    }
    
    if (metrics.altmetricScore) {
      console.log(`- Altmetric score: ${metrics.altmetricScore.toFixed(1)}`);
    }
  } else {
    console.error('Failed to calculate metrics:', metricsResult.error);
  }
  
  console.log('\n5. Calculating field-normalized impact...');
  
  // Calculate field-normalized impact
  const fieldResult = await impactMetricsService.calculateFieldNormalizedImpact(
    researcher1.id,
    ResearchField.EDUCATION
  );
  
  if (fieldResult.success) {
    const fieldMetrics = fieldResult.data!;
    console.log(`Field-normalized metrics for ${researcher1.name} in ${fieldMetrics.field}:`);
    console.log(`- Field-normalized citation impact: ${fieldMetrics.fieldNormalizedCitationImpact.toFixed(2)}`);
    console.log(`- Percentile rank: ${fieldMetrics.percentileRank}`);
    console.log(`- Field average citations: ${fieldMetrics.fieldAverageCitations}`);
    console.log(`- Researcher citations: ${fieldMetrics.researcherCitations}`);
  } else {
    console.error('Failed to calculate field-normalized impact:', fieldResult.error);
  }
  
  console.log('\n6. Calculating publication altmetrics...');
  
  // Calculate publication altmetrics
  const altmetricsResult = await impactMetricsService.calculatePublicationAltmetrics(publication1.id);
  
  if (altmetricsResult.success) {
    const altmetrics = altmetricsResult.data!;
    console.log(`Altmetrics for "${publication1.title}":`);
    console.log(`- Altmetric score: ${altmetrics.altmetricScore.toFixed(1)}`);
    console.log(`- Social media mentions: ${altmetrics.socialMediaMentions}`);
    console.log(`- News media mentions: ${altmetrics.newsMediaMentions}`);
    console.log(`- Policy document citations: ${altmetrics.policyDocumentCitations}`);
    console.log(`- Sources: ${altmetrics.sources.map(s => `${s.source} (${s.count})`).join(', ')}`);
  } else {
    console.error('Failed to calculate altmetrics:', altmetricsResult.error);
  }
  
  console.log('\n7. Searching for publications...');
  
  // Search for publications
  const searchResult = await publicationService.searchPublications({
    keywords: ['cognitive', 'education'],
    minCitations: 0,
    sortBy: 'publicationDate',
    sortDirection: 'desc'
  });
  
  if (searchResult.success) {
    const searchData = searchResult.data!;
    console.log(`Found ${searchData.total} publications matching search criteria:`);
    searchData.publications.forEach((pub, index) => {
      console.log(`${index + 1}. "${pub.title}" (${pub.publicationYear}) - Citations: ${pub.citationCount}`);
    });
  } else {
    console.error('Failed to search publications:', searchResult.error);
  }
  
  console.log('\n8. Exporting publications in BibTeX format...');
  
  // Export publications
  const exportResult = await publicationService.exportPublications(
    [publication1.id, publication2.id],
    'bibtex'
  );
  
  if (exportResult.success) {
    console.log('BibTeX export:');
    console.log(exportResult.data!.data);
  } else {
    console.error('Failed to export publications:', exportResult.error);
  }
  
  console.log('\nExample completed successfully!');
}

// Run the example
runExample().catch(error => {
  console.error('Error running example:', error);
});