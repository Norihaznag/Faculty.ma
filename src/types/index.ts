export type UserRole = 'admin' | 'moderator';
export type EducationType = 'university' | 'school';
export type ContentType = 'course' | 'exam' | 'td' | 'summary' | 'link';
export type DegreeType = 'licence' | 'master';
export type SemesterName = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  city: string;
  created_at: string;
}

export interface Faculty {
  id: string;
  university_id: string;
  name: string;
  created_at: string;
}

export interface Field {
  id: string;
  faculty_id: string;
  name: string;
  degree_type: DegreeType;
  created_at: string;
}

export interface Semester {
  id: string;
  field_id: string;
  name: SemesterName;
  created_at: string;
}

export interface Subject {
  id: string;
  semester_id: string;
  name: string;
  created_at: string;
}

export interface SchoolLevel {
  id: string;
  name: 'Collège' | 'Lycée';
  created_at: string;
}

export interface SchoolYear {
  id: string;
  level_id: string;
  name: string;
  created_at: string;
}

export interface SchoolSubject {
  id: string;
  year_id: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content_type: ContentType;
  education_type: EducationType;
  subject_id?: string;
  school_subject_id?: string;
  file_url?: string;
  embed_url?: string;
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}
