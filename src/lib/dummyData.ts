import {
  University,
  Faculty,
  Field,
  Semester,
  Subject,
  SchoolLevel,
  SchoolYear,
  SchoolSubject,
  Post,
  User,
} from '../types';

// Mock user
export const dummyUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'demo@example.com',
  role: 'admin',
  created_at: new Date().toISOString(),
};

// Mock universities
export const dummyUniversities: University[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Université Hassan II de Casablanca',
    city: 'Casablanca',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Université Al Akhawayn',
    city: 'Ifrane',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Université Mohammed V de Rabat',
    city: 'Rabat',
    created_at: new Date().toISOString(),
  },
];

// Mock faculties
export const dummyFaculties: Faculty[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    university_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Faculté des Sciences',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    university_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Faculté de Droit',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    university_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'School of Science and Engineering',
    created_at: new Date().toISOString(),
  },
];

// Mock fields
export const dummyFields: Field[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440201',
    faculty_id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Informatique',
    degree_type: 'licence',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440202',
    faculty_id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Mathématiques',
    degree_type: 'licence',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440203',
    faculty_id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Informatique',
    degree_type: 'master',
    created_at: new Date().toISOString(),
  },
];

// Mock semesters
export const dummySemesters: Semester[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440301',
    field_id: '550e8400-e29b-41d4-a716-446655440201',
    name: 'S1',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440302',
    field_id: '550e8400-e29b-41d4-a716-446655440201',
    name: 'S2',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440303',
    field_id: '550e8400-e29b-41d4-a716-446655440201',
    name: 'S3',
    created_at: new Date().toISOString(),
  },
];

// Mock subjects
export const dummySubjects: Subject[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440401',
    semester_id: '550e8400-e29b-41d4-a716-446655440301',
    name: 'Algorithmes et Structures de Données',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440402',
    semester_id: '550e8400-e29b-41d4-a716-446655440301',
    name: 'Programmation Orientée Objet',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440403',
    semester_id: '550e8400-e29b-41d4-a716-446655440302',
    name: 'Bases de Données',
    created_at: new Date().toISOString(),
  },
];

// Mock school levels
export const dummySchoolLevels: SchoolLevel[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440501',
    name: 'Collège',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440502',
    name: 'Lycée',
    created_at: new Date().toISOString(),
  },
];

// Mock school years
export const dummySchoolYears: SchoolYear[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440601',
    level_id: '550e8400-e29b-41d4-a716-446655440501',
    name: '1ère Année Collège',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440602',
    level_id: '550e8400-e29b-41d4-a716-446655440501',
    name: '2ème Année Collège',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440603',
    level_id: '550e8400-e29b-41d4-a716-446655440502',
    name: 'Tronc Commun',
    created_at: new Date().toISOString(),
  },
];

// Mock school subjects
export const dummySchoolSubjects: SchoolSubject[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440701',
    year_id: '550e8400-e29b-41d4-a716-446655440601',
    name: 'Mathématiques',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440702',
    year_id: '550e8400-e29b-41d4-a716-446655440601',
    name: 'Sciences Physiques',
    created_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440703',
    year_id: '550e8400-e29b-41d4-a716-446655440602',
    name: 'Mathématiques',
    created_at: new Date().toISOString(),
  },
];

// Mock posts
export const dummyPosts: Post[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440801',
    title: 'Cours: Introduction aux Algorithmes',
    description: 'Un guide complet pour comprendre les bases des algorithmes',
    content_type: 'course',
    education_type: 'university',
    subject_id: '550e8400-e29b-41d4-a716-446655440401',
    file_url: 'https://example.com/algo.pdf',
    embed_url: undefined,
    published: true,
    created_by: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440802',
    title: 'Examen: POO - Janvier 2025',
    description: 'Examen final du semestre',
    content_type: 'exam',
    education_type: 'university',
    subject_id: '550e8400-e29b-41d4-a716-446655440402',
    file_url: 'https://example.com/exam.pdf',
    embed_url: undefined,
    published: true,
    created_by: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440803',
    title: 'TD: Mathématiques - Collège',
    description: 'Travaux dirigés pour 1ère année collège',
    content_type: 'td',
    education_type: 'school',
    school_subject_id: '550e8400-e29b-41d4-a716-446655440701',
    file_url: 'https://example.com/td.pdf',
    embed_url: undefined,
    published: true,
    created_by: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Helper functions to get dummy data filtered by parent ID
export const getDummyFacultiesByUniversity = (
  universityId: string
): Faculty[] => {
  return dummyFaculties.filter((f) => f.university_id === universityId);
};

export const getDummyFieldsByFaculty = (facultyId: string): Field[] => {
  return dummyFields.filter((f) => f.faculty_id === facultyId);
};

export const getDummySemestersByField = (fieldId: string): Semester[] => {
  return dummySemesters.filter((s) => s.field_id === fieldId);
};

export const getDummySubjectsBySemester = (semesterId: string): Subject[] => {
  return dummySubjects.filter((s) => s.semester_id === semesterId);
};

export const getDummySchoolYearsByLevel = (levelId: string): SchoolYear[] => {
  return dummySchoolYears.filter((y) => y.level_id === levelId);
};

export const getDummySchoolSubjectsByYear = (
  yearId: string
): SchoolSubject[] => {
  return dummySchoolSubjects.filter((s) => s.year_id === yearId);
};

export const getDummyPublishedPosts = (): Post[] => {
  return dummyPosts.filter((p) => p.published === true);
};
