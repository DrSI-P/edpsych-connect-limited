/**
 * NHS Digital FHIR Integration Example
 * 
 * This example demonstrates how to use the FHIR integration service
 * to connect to NHS Digital and exchange healthcare data in a secure,
 * standardized format.
 */

import { FHIRService } from '../services/fhir-service';
import { FHIRServiceConfig } from '../models/fhir-config';
import * as fhirMappers from '../mappers/fhir-mappers';
import { Student, MentalHealthAssessment } from '../../core/models/education-models';

// Example configuration for NHS Digital integration
const nhsDigitalConfig: FHIRServiceConfig = {
  serverUrl: 'https://api.service.nhs.uk/personal-demographics/FHIR/R4',
  authType: 'bearer',
  token: process.env.NHS_DIGITAL_TOKEN || 'YOUR_TOKEN_HERE',
  timeout: 30000,
  nhsDigitalEnabled: true,
  nhsDigitalApiKey: process.env.NHS_DIGITAL_API_KEY || 'YOUR_API_KEY_HERE',
  secure: true,
  headers: {
    'X-Request-ID': Date.now().toString(),
    'X-Correlation-ID': Date.now().toString()
  },
  validateResources: true
};

// Example student data
const exampleStudent: Student = {
  id: 'student-12345',
  firstName: 'Emma',
  lastName: 'Watson',
  dateOfBirth: '2010-06-15',
  gender: 'female',
  yearGroup: 'Year 5',
  keyStage: 'KS2',
  schoolId: 'school-78901',
  nhsNumber: '9000000009',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  attendance: 97.5,
  punctuality: 98.2,
  sen: [
    {
      type: 'SPLD',
      severity: 'mild',
      dateIdentified: '2018-09-12',
      supportLevel: 'SEN support',
      details: 'Specific learning difficulties with reading and spelling'
    }
  ]
};

// Example mental health assessment
const exampleAssessment: MentalHealthAssessment = {
  id: 'assessment-56789',
  studentId: 'student-12345',
  assessorId: 'staff-23456',
  assessmentType: 'SDQ',
  date: new Date().toISOString(),
  scores: {
    emotional: 3,
    conduct: 2,
    hyperactivity: 6,
    peerProblems: 1,
    prosocial: 8,
    totalDifficulties: 12
  },
  interpretations: {
    emotional: 'Close to average',
    conduct: 'Close to average',
    hyperactivity: 'Slightly raised',
    peerProblems: 'Close to average',
    prosocial: 'Close to average',
    totalDifficulties: 'Close to average'
  },
  followUpRequired: false,
  parentVersionCompleted: true,
  teacherVersionCompleted: true,
  selfVersionCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Main example function demonstrating NHS Digital integration
 */
async function runNHSDigitalIntegrationExample() {
  console.log('Starting NHS Digital FHIR Integration Example...');
  
  try {
    // Initialize the FHIR service
    const fhirService = new FHIRService(nhsDigitalConfig);
    console.log('FHIR Service initialized');
    
    // Step 1: Map EdPsych student to FHIR Patient resource
    console.log('Mapping student to FHIR Patient...');
    const patientResource = fhirMappers.mapStudentToPatient(exampleStudent);
    console.log('Successfully mapped student to FHIR Patient');
    
    // Step 2: Create the patient record in the FHIR server
    console.log('Creating patient record in FHIR server...');
    try {
      const createdPatient = await fhirService.createResource(patientResource);
      console.log(`Successfully created patient with ID: ${createdPatient.id}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      console.log('Continuing with example using local patient resource...');
    }
    
    // Step 3: Map mental health assessment to FHIR Observation
    console.log('Mapping assessment to FHIR Observation...');
    const observationResource = {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'https://edpsych-connect.org/fhir/extensions/assessment-types',
          code: exampleAssessment.assessmentType,
          display: 'Strengths and Difficulties Questionnaire'
        }]
      },
      subject: {
        reference: `Patient/${exampleStudent.id}`
      },
      effectiveDateTime: exampleAssessment.date,
      valueQuantity: {
        value: exampleAssessment.scores.totalDifficulties,
        unit: 'score',
        system: 'https://edpsych-connect.org/fhir/extensions/score-units',
        code: 'score'
      },
      component: [
        {
          code: {
            coding: [{
              system: 'https://edpsych-connect.org/fhir/extensions/sdq-subscales',
              code: 'emotional',
              display: 'Emotional Symptoms'
            }]
          },
          valueQuantity: {
            value: exampleAssessment.scores.emotional,
            unit: 'score',
            system: 'https://edpsych-connect.org/fhir/extensions/score-units',
            code: 'score'
          }
        },
        {
          code: {
            coding: [{
              system: 'https://edpsych-connect.org/fhir/extensions/sdq-subscales',
              code: 'conduct',
              display: 'Conduct Problems'
            }]
          },
          valueQuantity: {
            value: exampleAssessment.scores.conduct,
            unit: 'score',
            system: 'https://edpsych-connect.org/fhir/extensions/score-units',
            code: 'score'
          }
        },
        {
          code: {
            coding: [{
              system: 'https://edpsych-connect.org/fhir/extensions/sdq-subscales',
              code: 'hyperactivity',
              display: 'Hyperactivity'
            }]
          },
          valueQuantity: {
            value: exampleAssessment.scores.hyperactivity,
            unit: 'score',
            system: 'https://edpsych-connect.org/fhir/extensions/score-units',
            code: 'score'
          }
        }
      ]
    };
    console.log('Successfully mapped assessment to FHIR Observation');
    
    // Step 4: Create the observation in the FHIR server
    console.log('Creating observation in FHIR server...');
    try {
      const createdObservation = await fhirService.createResource(observationResource);
      console.log(`Successfully created observation with ID: ${(createdObservation as any).id || 'N/A'}`);
    } catch (error) {
      console.error('Error creating observation:', error);
      console.log('Continuing with example using local observation resource...');
    }
    
    // Step 5: Fetch a patient's NHS record using NHS Number
    console.log('Fetching patient demographics from NHS Digital...');
    try {
      const nhsPatient = await fhirService.getNHSPatientDemographics(exampleStudent.nhsNumber!);
      console.log('Successfully retrieved NHS patient record:');
      console.log(`Name: ${nhsPatient.name?.[0]?.given?.join(' ')} ${nhsPatient.name?.[0]?.family}`);
      console.log(`NHS Number: ${nhsPatient.identifier?.find(id => id.system === 'https://fhir.nhs.uk/Id/nhs-number')?.value}`);
      console.log(`Date of Birth: ${nhsPatient.birthDate}`);
    } catch (error) {
      console.error('Error fetching NHS patient demographics:', error);
      console.log('This error is expected in this example as we are not using real NHS credentials');
    }
    
    // Step 6: Create an intervention plan (CarePlan)
    console.log('Creating a care plan...');
    const carePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      intent: 'plan',
      title: 'Reading Support Intervention',
      description: 'Intensive reading support for student with specific learning difficulties',
      subject: {
        reference: `Patient/${exampleStudent.id}`
      },
      period: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString() // 90 days
      },
      activity: [
        {
          detail: {
            status: 'scheduled',
            description: 'One-to-one reading support sessions',
            scheduledString: 'Three times per week for 30 minutes'
          }
        },
        {
          detail: {
            status: 'scheduled',
            description: 'Phonics intervention program',
            scheduledString: 'Daily for 15 minutes'
          }
        }
      ]
    };
    
    try {
      const createdCarePlan = await fhirService.createCarePlan(carePlan as any);
      console.log(`Successfully created care plan with ID: ${(createdCarePlan as any).id || 'N/A'}`);
    } catch (error) {
      console.error('Error creating care plan:', error);
      console.log('Continuing with example...');
    }
    
    console.log('NHS Digital FHIR Integration Example completed');
  } catch (error) {
    console.error('Error in integration example:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runNHSDigitalIntegrationExample()
    .then(() => console.log('Example completed'))
    .catch(error => console.error('Example failed:', error));
}

export { runNHSDigitalIntegrationExample };