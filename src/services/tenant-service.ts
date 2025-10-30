/**
 * Multi-Tenant SaaS Architecture for EdPsych Connect World
 * Comprehensive tenant management for schools, teachers, students, and parents
 */

import { AIService } from './ai-service';

export interface Tenant {
  id: string;
  name: string;
  type: 'primary_school' | 'secondary_school' | 'academy' | 'multi_academy_trust' | 'local_authority';
  subscription: SubscriptionPlan;
  settings: TenantSettings;
  users: TenantUser[];
  structure: SchoolStructure;
  createdAt: Date;
  lastActive: Date;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
}

export interface SubscriptionPlan {
  tier: 'starter' | 'professional' | 'enterprise' | 'research';
  features: string[];
  userLimit: number;
  storageLimit: number; // GB
  apiCalls: number; // per month
  supportLevel: 'basic' | 'priority' | 'dedicated';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
}

export interface TenantSettings {
  branding: TenantBranding;
  features: FeatureFlags;
  integrations: ExternalIntegrations;
  compliance: ComplianceSettings;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
    categories: {
      achievements: boolean;
      progress: boolean;
      behavior: boolean;
      events: boolean;
      tips: boolean;
    };
  };
}

export interface TenantBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customDomain?: string;
  emailTemplate: EmailTemplate;
}

export interface EmailTemplate {
  headerImage?: string;
  footerText: string;
  signature: string;
  colors: {
    primary: string;
    background: string;
    text: string;
  };
}

export interface FeatureFlags {
  aiCurriculumPlanning: boolean;
  battleRoyaleGames: boolean;
  advancedAnalytics: boolean;
  researchParticipation: boolean;
  parentalPortal: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
}

export interface ExternalIntegrations {
  sis: SISIntegration[]; // Student Information Systems
  assessment: AssessmentIntegration[];
  communication: CommunicationIntegration[];
  calendar: CalendarIntegration[];
}

export interface SISIntegration {
  provider: 'arbor' | 'sims' | 'bromcom' | 'integris' | 'custom';
  status: 'connected' | 'error' | 'syncing';
  lastSync: Date;
  syncFrequency: 'real-time' | 'hourly' | 'daily';
  dataMapping: DataMapping[];
}

export interface DataMapping {
  platformField: string;
  externalField: string;
  transformation?: string;
}

export interface AssessmentIntegration {
  provider: 'glean' | '4matrix' | 'custom';
  subjects: string[];
  syncResults: boolean;
  syncPredictions: boolean;
}

export interface CommunicationIntegration {
  provider: 'parentmail' | 'teachers2parents' | 'custom';
  templates: CommunicationTemplate[];
}

export interface CommunicationTemplate {
  type: 'progress_report' | 'achievement' | 'event' | 'newsletter';
  templateId: string;
  variables: string[];
}

export interface CalendarIntegration {
  provider: 'google_workspace' | 'microsoft_365' | 'custom';
  syncEvents: boolean;
  syncTimetables: boolean;
}

export interface ComplianceSettings {
  gdpr: GDPRSettings;
  safeguarding: SafeguardingSettings;
  dataRetention: DataRetentionPolicy;
  auditLogging: boolean;
}

export interface GDPRSettings {
  dataProcessingAgreement: boolean;
  privacyNotices: PrivacyNotice[];
  consentManagement: boolean;
  dataSubjectRequests: boolean;
  breachNotification: boolean;
}

export interface PrivacyNotice {
  audience: 'students' | 'parents' | 'staff';
  version: string;
  effectiveDate: Date;
  content: string;
}

export interface SafeguardingSettings {
  dbsChecks: boolean;
  trainingRecords: boolean;
  incidentReporting: boolean;
  riskAssessments: boolean;
}

export interface DataRetentionPolicy {
  studentData: number; // months
  assessmentData: number;
  communicationData: number;
  systemLogs: number;
}

export interface TenantUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  profile: UserProfile;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
  tenantId: string;
}

export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'headteacher'
  | 'deputy_head'
  | 'subject_lead'
  | 'class_teacher'
  | 'teaching_assistant'
  | 'sen_coordinator'
  | 'parent'
  | 'student'
  | 'researcher';

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  title?: string;
  subjects?: string[];
  yearGroups?: string[];
  qualifications?: string[];
  specialisms?: string[];
}

export interface SchoolStructure {
  departments: Department[];
  yearGroups: YearGroup[];
  classes: Class[];
  subjects: Subject[];
  leadership: LeadershipStructure;
}

export interface Department {
  id: string;
  name: string;
  head: string; // user ID
  subjects: string[]; // subject IDs
  staff: string[]; // user IDs
  budget?: number;
}

export interface YearGroup {
  id: string;
  name: string; // e.g., "Year 7", "Reception"
  headOfYear: string; // user ID
  classes: string[]; // class IDs
  curriculum: CurriculumOverview;
}

export interface Class {
  id: string;
  name: string; // e.g., "7A", "Reception Blue"
  yearGroup: string;
  classTeacher: string; // user ID
  subjectTeachers: Record<string, string>; // subject ID -> teacher ID
  students: string[]; // student user IDs
  timetable: Timetable;
  capacity: number;
  currentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string; // e.g., "EN1", "MA2"
  department: string;
  keyStage: number;
  curriculum: SubjectCurriculum;
  assessmentPoints: string[];
}

export interface CurriculumOverview {
  framework: 'national_curriculum' | 'international_baccalaureate' | 'custom';
  keyStages: number[];
  subjects: string[];
  assessmentSchedule: AssessmentSchedule[];
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  url?: string;
}

export interface SubjectCurriculum {
  topics: CurriculumTopic[];
  skills: Skill[];
  knowledge: KnowledgeArea[];
  resources: Resource[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  order: number;
  duration: number; // weeks
  learningObjectives: string[];
  successCriteria: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'cognitive' | 'physical' | 'social' | 'emotional';
  progression: SkillProgression[];
}

export interface SkillProgression {
  level: string;
  description: string;
  examples: string[];
}

export interface KnowledgeArea {
  id: string;
  name: string;
  concepts: string[];
  misconceptions: string[];
  links: string[]; // related knowledge areas
}

export interface LeadershipStructure {
  headteacher: string;
  deputyHeads: string[];
  seniorLeadership: string[];
  middleLeadership: string[];
  subjectLeads: Record<string, string>; // subject ID -> lead user ID
}

export interface Timetable {
  periods: Period[];
  days: string[];
  terms: Term[];
}

export interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'lesson' | 'break' | 'assembly' | 'tutor_time';
}

export interface Term {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  halfTerms: HalfTerm[];
}

export interface HalfTerm {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface AssessmentSchedule {
  name: string;
  type: 'formative' | 'summative' | 'diagnostic';
  subjects: string[];
  yearGroups: string[];
  frequency: 'weekly' | 'half-termly' | 'termly' | 'annually';
  methods: string[];
}

export class TenantService {
  private static instance: TenantService;
  private tenants: Map<string, Tenant> = new Map();
  private users: Map<string, TenantUser> = new Map();

  private constructor() {}

  public static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  /**
   * Create new school tenant
   */
  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant: Tenant = {
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: tenantData.name!,
      type: tenantData.type || 'primary_school',
      subscription: tenantData.subscription || {
        tier: 'starter',
        features: ['basic_curriculum', 'basic_assessment'],
        userLimit: 100,
        storageLimit: 10,
        apiCalls: 10000,
        supportLevel: 'basic',
        price: 99,
        currency: 'GBP',
        billingCycle: 'monthly'
      },
      settings: tenantData.settings || {
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          accentColor: '#10b981',
          emailTemplate: {
            footerText: 'Sent by EdPsych Connect World',
            signature: 'The EdPsych Team',
            colors: {
              primary: '#3b82f6',
              background: '#ffffff',
              text: '#000000'
            }
          }
        },
        features: {
          aiCurriculumPlanning: true,
          battleRoyaleGames: true,
          advancedAnalytics: false,
          researchParticipation: true,
          parentalPortal: true,
          apiAccess: false,
          customIntegrations: false,
          prioritySupport: false
        },
        integrations: {
          sis: [],
          assessment: [],
          communication: [],
          calendar: []
        },
        compliance: {
          gdpr: {
            dataProcessingAgreement: true,
            privacyNotices: [],
            consentManagement: true,
            dataSubjectRequests: true,
            breachNotification: true
          },
          safeguarding: {
            dbsChecks: true,
            trainingRecords: true,
            incidentReporting: true,
            riskAssessments: true
          },
          dataRetention: {
            studentData: 84, // 7 years
            assessmentData: 36, // 3 years
            communicationData: 24, // 2 years
            systemLogs: 12 // 1 year
          },
          auditLogging: true
        },
        notifications: {
          email: true,
          sms: false,
          push: true,
          frequency: 'weekly',
          categories: {
            achievements: true,
            progress: true,
            behavior: false,
            events: true,
            tips: true
          }
        }
      },
      users: [],
      structure: tenantData.structure || {
        departments: [],
        yearGroups: [],
        classes: [],
        subjects: [],
        leadership: {
          headteacher: '',
          deputyHeads: [],
          seniorLeadership: [],
          middleLeadership: [],
          subjectLeads: {}
        }
      },
      createdAt: new Date(),
      lastActive: new Date(),
      status: 'trial'
    };

    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  /**
   * Add user to tenant with appropriate role and permissions
   */
  async addUserToTenant(
    tenantId: string,
    userData: Partial<TenantUser>
  ): Promise<TenantUser> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const user: TenantUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email!,
      role: userData.role || 'class_teacher',
      permissions: this.generatePermissionsForRole(userData.role || 'class_teacher'),
      profile: userData.profile || {
        firstName: '',
        lastName: ''
      },
      lastLogin: new Date(),
      status: 'active',
      tenantId
    };

    tenant.users.push(user);
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Set up school structure for secondary school with subject teachers
   */
  async setupSecondarySchoolStructure(
    tenantId: string,
    subjects: string[],
    yearGroups: string[]
  ): Promise<SchoolStructure> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    // Create subjects
    const subjectObjects: Subject[] = subjects.map((subject, index) => ({
      id: `subject_${index + 1}`,
      name: subject,
      code: `${subject.substring(0, 2).toUpperCase()}${index + 1}`,
      department: this.getDepartmentForSubject(subject),
      keyStage: this.getKeyStageForYearGroup(yearGroups[0]),
      curriculum: {
        topics: [],
        skills: [],
        knowledge: [],
        resources: []
      },
      assessmentPoints: ['end_of_term', 'mock_exams', 'final_exams']
    }));

    // Create year groups
    const yearGroupObjects: YearGroup[] = yearGroups.map((yearGroup, index) => ({
      id: `year_${index + 1}`,
      name: yearGroup,
      headOfYear: '', // To be assigned
      classes: [],
      curriculum: {
        framework: 'national_curriculum',
        keyStages: [this.getKeyStageForYearGroup(yearGroup)],
        subjects: subjects,
        assessmentSchedule: [
          {
            name: 'Formative Assessment',
            type: 'formative',
            subjects: subjects,
            yearGroups: [yearGroup],
            frequency: 'weekly',
            methods: ['quiz', 'observation', 'discussion']
          }
        ]
      }
    }));

    // Create classes for each year group
    const classObjects: Class[] = [];
    yearGroups.forEach((yearGroup, yearIndex) => {
      const classesInYear = yearIndex < 2 ? 4 : 6; // More classes in older years
      for (let classNum = 1; classNum <= classesInYear; classNum++) {
        const classObj: Class = {
          id: `class_${yearIndex + 1}_${classNum}`,
          name: `${yearGroup}${String.fromCharCode(64 + classNum)}`,
          yearGroup: `year_${yearIndex + 1}`,
          classTeacher: '', // To be assigned
          subjectTeachers: {},
          students: [],
          timetable: this.generateTimetable(yearGroup),
          capacity: 30,
          currentCount: 0
        };
        classObjects.push(classObj);
        yearGroupObjects[yearIndex].classes.push(classObj.id);
      }
    });

    const structure: SchoolStructure = {
      departments: this.createDepartments(subjects),
      yearGroups: yearGroupObjects,
      classes: classObjects,
      subjects: subjectObjects,
      leadership: {
        headteacher: '',
        deputyHeads: [],
        seniorLeadership: [],
        middleLeadership: [],
        subjectLeads: {}
      }
    };

    tenant.structure = structure;
    return structure;
  }

  /**
   * Generate permissions for user role
   */
  private generatePermissionsForRole(role: UserRole): Permission[] {
    const rolePermissions: Record<UserRole, Permission[]> = {
      super_admin: [
        {
          resource: '*',
          actions: ['*']
        }
      ],
      school_admin: [
        {
          resource: 'tenant',
          actions: ['read', 'update', 'manage_users', 'manage_settings']
        },
        {
          resource: 'users',
          actions: ['read', 'create', 'update', 'delete']
        },
        {
          resource: 'curriculum',
          actions: ['read', 'create', 'update', 'delete']
        }
      ],
      headteacher: [
        {
          resource: 'school',
          actions: ['read', 'manage_curriculum', 'manage_staff', 'view_analytics']
        },
        {
          resource: 'students',
          actions: ['read', 'view_progress', 'manage_interventions']
        }
      ],
      subject_lead: [
        {
          resource: 'subject_curriculum',
          actions: ['read', 'create', 'update', 'manage_assessments']
        },
        {
          resource: 'subject_students',
          actions: ['read', 'track_progress', 'create_interventions']
        }
      ],
      class_teacher: [
        {
          resource: 'class_students',
          actions: ['read', 'track_progress', 'create_assessments', 'manage_interventions']
        },
        {
          resource: 'class_curriculum',
          actions: ['read', 'adapt', 'track_delivery']
        }
      ],
      parent: [
        {
          resource: 'child_progress',
          actions: ['read', 'view_reports', 'receive_notifications']
        },
        {
          resource: 'parent_communications',
          actions: ['read', 'send', 'manage_preferences']
        }
      ],
      student: [
        {
          resource: 'own_progress',
          actions: ['read', 'view_achievements', 'access_games']
        },
        {
          resource: 'learning_activities',
          actions: ['read', 'complete', 'track_progress']
        }
      ],
      researcher: [
        {
          resource: 'research_data',
          actions: ['read', 'analyze', 'export'],
          conditions: ['anonymized_data_only', 'ethical_approval_required']
        },
        {
          resource: 'research_studies',
          actions: ['create', 'manage', 'publish']
        }
      ],
      deputy_head: [
        {
          resource: 'school_management',
          actions: ['read', 'manage_curriculum', 'manage_timetable', 'view_analytics']
        }
      ],
      teaching_assistant: [
        {
          resource: 'assigned_students',
          actions: ['read', 'support', 'track_interventions']
        }
      ],
      sen_coordinator: [
        {
          resource: 'sen_students',
          actions: ['read', 'manage_interventions', 'coordinate_support', 'track_progress']
        }
      ]
    };

    return rolePermissions[role] || [];
  }

  /**
   * Create departments based on subjects
   */
  private createDepartments(subjects: string[]): Department[] {
    const departments: Department[] = [];

    // Group subjects into departments
    const departmentGroups = {
      'english': ['english', 'literacy', 'drama'],
      'mathematics': ['maths', 'numeracy'],
      'science': ['biology', 'chemistry', 'physics'],
      'humanities': ['history', 'geography', 'religious_studies'],
      'languages': ['french', 'spanish', 'german'],
      'arts': ['art', 'music', 'design_technology'],
      'pe': ['physical_education'],
      'computing': ['computer_science', 'ict']
    };

    Object.entries(departmentGroups).forEach(([deptName, deptSubjects]) => {
      if (subjects.some(subject => deptSubjects.includes(subject.toLowerCase()))) {
        departments.push({
          id: `dept_${deptName.toLowerCase()}`,
          name: deptName,
          head: '', // To be assigned
          subjects: deptSubjects.filter(s => subjects.includes(s)),
          staff: []
        });
      }
    });

    return departments;
  }

  /**
   * Generate timetable for a year group
   */
  private generateTimetable(yearGroup: string): Timetable {
    const keyStage = this.getKeyStageForYearGroup(yearGroup);

    return {
      periods: [
        { id: 'p1', name: 'Period 1', startTime: '09:00', endTime: '09:45', type: 'lesson' },
        { id: 'p2', name: 'Period 2', startTime: '09:45', endTime: '10:30', type: 'lesson' },
        { id: 'break', name: 'Break', startTime: '10:30', endTime: '10:45', type: 'break' },
        { id: 'p3', name: 'Period 3', startTime: '10:45', endTime: '11:30', type: 'lesson' },
        { id: 'p4', name: 'Period 4', startTime: '11:30', endTime: '12:15', type: 'lesson' },
        { id: 'lunch', name: 'Lunch', startTime: '12:15', endTime: '13:15', type: 'break' },
        { id: 'p5', name: 'Period 5', startTime: '13:15', endTime: '14:00', type: 'lesson' },
        { id: 'p6', name: 'Period 6', startTime: '14:00', endTime: '14:45', type: 'lesson' }
      ],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      terms: [
        {
          id: 'autumn_2024',
          name: 'Autumn Term 2024',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-20'),
          halfTerms: [
            {
              id: 'autumn_half_1',
              name: 'Autumn Half Term 1',
              startDate: new Date('2024-09-01'),
              endDate: new Date('2024-10-25')
            }
          ]
        }
      ]
    };
  }

  /**
   * Get department for subject
   */
  private getDepartmentForSubject(subject: string): string {
    const subjectDeptMap: Record<string, string> = {
      'english': 'english',
      'maths': 'mathematics',
      'biology': 'science',
      'chemistry': 'science',
      'physics': 'science',
      'history': 'humanities',
      'geography': 'humanities',
      'french': 'languages',
      'spanish': 'languages',
      'art': 'arts',
      'music': 'arts',
      'physical_education': 'pe'
    };

    return subjectDeptMap[subject.toLowerCase()] || 'general';
  }

  /**
   * Get key stage for year group
   */
  private getKeyStageForYearGroup(yearGroup: string): number {
    const yearNum = parseInt(yearGroup.replace('Year ', ''));
    if (yearNum <= 2) return 1;
    if (yearNum <= 6) return 2;
    if (yearNum <= 9) return 3;
    return 4;
  }

  /**
   * Get tenant by ID
   */
  getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): TenantUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Get all tenants
   */
  getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  /**
   * Get users for a tenant
   */
  getTenantUsers(tenantId: string): TenantUser[] {
    return Array.from(this.users.values()).filter(user => user.tenantId === tenantId);
  }

  /**
   * Assign subject teacher to class
   */
  assignSubjectTeacher(
    tenantId: string,
    classId: string,
    subjectId: string,
    teacherId: string
  ): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;

    const classObj = tenant.structure.classes.find(c => c.id === classId);
    if (!classObj) return false;

    classObj.subjectTeachers[subjectId] = teacherId;
    return true;
  }

  /**
   * Get teacher's classes and subjects
   */
  getTeacherResponsibilities(tenantId: string, teacherId: string): any {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const classes = tenant.structure.classes.filter(c =>
      c.classTeacher === teacherId || Object.values(c.subjectTeachers).includes(teacherId)
    );

    const subjects = new Set<string>();
    classes.forEach(cls => {
      if (cls.classTeacher === teacherId) {
        subjects.add('class_teacher');
      }
      Object.entries(cls.subjectTeachers).forEach(([subjectId, teacher]) => {
        if (teacher === teacherId) {
          const subject = tenant.structure.subjects.find(s => s.id === subjectId);
          if (subject) subjects.add(subject.name);
        }
      });
    });

    return {
      classes: classes.map(c => ({ id: c.id, name: c.name, role: c.classTeacher === teacherId ? 'class_teacher' : 'subject_teacher' })),
      subjects: Array.from(subjects),
      totalStudents: classes.reduce((total, c) => total + c.currentCount, 0)
    };
  }

  /**
   * Generate tenant-specific curriculum
   */
  async generateTenantCurriculum(tenantId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    // Generate curriculum based on tenant type and structure
    return {
      tenantId,
      framework: tenant.structure.yearGroups[0]?.curriculum.framework || 'national_curriculum',
      subjects: tenant.structure.subjects,
      yearGroups: tenant.structure.yearGroups,
      assessmentSchedule: tenant.structure.yearGroups[0]?.curriculum.assessmentSchedule || [],
      generatedAt: new Date()
    };
  }

  /**
   * Get research data for tenant (anonymized)
   */
  async getTenantResearchData(tenantId: string, researcherId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    // Check if researcher has access
    const researcher = this.users.get(researcherId);
    if (!researcher || researcher.role !== 'researcher') {
      throw new Error('Unauthorized access to research data');
    }

    // Return anonymized tenant data for research
    return {
      tenantId,
      type: tenant.type,
      structure: {
        totalStudents: tenant.structure.classes.reduce((total, c) => total + c.currentCount, 0),
        subjects: tenant.structure.subjects.length,
        yearGroups: tenant.structure.yearGroups.length,
        departments: tenant.structure.departments.length
      },
      anonymizedData: {
        engagement: Math.random() * 100,
        progress: Math.random() * 100,
        satisfaction: Math.random() * 100
      },
      accessedAt: new Date(),
      researcherId
    };
  }
}