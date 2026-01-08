import { isSupabaseReady, supabase } from './supabase';
import * as dummy from './dummyData';
import { User, ResourceRequest, ContentPack, ContentPackItem } from '../types';

// ============================================
// Validation Helpers
// ============================================

/**
 * Sanitize and validate text input
 */
export const validateText = (text: string, fieldName: string = 'Field', minLength = 1, maxLength = 255): string => {
  const trimmed = text?.trim() || '';
  
  if (trimmed.length < minLength) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }
  
  return trimmed;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): string => {
  const trimmed = email?.trim() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format');
  }
  
  return trimmed;
};

/**
 * Safely check user authentication
 * Returns dummy user if Supabase is not ready
 */
export const checkUserSafe = async (): Promise<User | null> => {
  if (!isSupabaseReady()) {
    console.log('Using dummy user (Supabase not configured)');
    return dummy.dummyUser;
  }

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    return userData as User | null;
  } catch (error) {
    console.log('Error checking user, using dummy data:', error);
    return dummy.dummyUser;
  }
};

/**
 * Safely fetch universities with pagination
 * Returns dummy data if Supabase is not ready
 * 
 * @param page Page number (1-indexed)
 * @param limit Items per page (default 100)
 */
export const fetchUniversitiesSafe = async (page: number = 1, limit: number = 100) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy universities (Supabase not configured)');
    return dummy.dummyUniversities;
  }

  try {
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('universities')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('name');

    if (error) {
      console.log('Error fetching universities, using dummy data:', error);
      return dummy.dummyUniversities;
    }

    console.log(`📊 Fetched page ${page} of universities (${count} total)`);
    return data || dummy.dummyUniversities;
  } catch (error) {
    console.log('Error fetching universities, using dummy data:', error);
    return dummy.dummyUniversities;
  }
};

/**
 * Safely fetch faculties by university
 * Returns dummy data if Supabase is not ready
 */
export const fetchFacultiesSafe = async (universityId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy faculties (Supabase not configured)');
    return dummy.getDummyFacultiesByUniversity(universityId);
  }

  try {
    const { data, error } = await supabase
      .from('faculties')
      .select('*')
      .eq('university_id', universityId);

    if (error) {
      console.log('Error fetching faculties, using dummy data:', error);
      return dummy.getDummyFacultiesByUniversity(universityId);
    }

    return data || dummy.getDummyFacultiesByUniversity(universityId);
  } catch (error) {
    console.log('Error fetching faculties, using dummy data:', error);
    return dummy.getDummyFacultiesByUniversity(universityId);
  }
};

/**
 * Safely fetch fields by faculty
 * Returns dummy data if Supabase is not ready
 */
export const fetchFieldsSafe = async (facultyId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy fields (Supabase not configured)');
    return dummy.getDummyFieldsByFaculty(facultyId);
  }

  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('faculty_id', facultyId);

    if (error) {
      console.log('Error fetching fields, using dummy data:', error);
      return dummy.getDummyFieldsByFaculty(facultyId);
    }

    return data || dummy.getDummyFieldsByFaculty(facultyId);
  } catch (error) {
    console.log('Error fetching fields, using dummy data:', error);
    return dummy.getDummyFieldsByFaculty(facultyId);
  }
};

/**
 * Safely fetch semesters by field
 * Returns dummy data if Supabase is not ready
 */
export const fetchSemestersSafe = async (fieldId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy semesters (Supabase not configured)');
    return dummy.getDummySemestersByField(fieldId);
  }

  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('field_id', fieldId);

    if (error) {
      console.log('Error fetching semesters, using dummy data:', error);
      return dummy.getDummySemestersByField(fieldId);
    }

    return data || dummy.getDummySemestersByField(fieldId);
  } catch (error) {
    console.log('Error fetching semesters, using dummy data:', error);
    return dummy.getDummySemestersByField(fieldId);
  }
};

/**
 * Safely fetch subjects by semester
 * Returns dummy data if Supabase is not ready
 */
export const fetchSubjectsSafe = async (semesterId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy subjects (Supabase not configured)');
    return dummy.getDummySubjectsBySemester(semesterId);
  }

  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('semester_id', semesterId);

    if (error) {
      console.log('Error fetching subjects, using dummy data:', error);
      return dummy.getDummySubjectsBySemester(semesterId);
    }

    return data || dummy.getDummySubjectsBySemester(semesterId);
  } catch (error) {
    console.log('Error fetching subjects, using dummy data:', error);
    return dummy.getDummySubjectsBySemester(semesterId);
  }
};

/**
 * Safely fetch school levels
 * Returns dummy data if Supabase is not ready
 */
export const fetchSchoolLevelsSafe = async () => {
  if (!isSupabaseReady()) {
    console.log('Using dummy school levels (Supabase not configured)');
    return dummy.dummySchoolLevels;
  }

  try {
    const { data, error } = await supabase
      .from('school_levels')
      .select('*');

    if (error) {
      console.log('Error fetching school levels, using dummy data:', error);
      return dummy.dummySchoolLevels;
    }

    return data || dummy.dummySchoolLevels;
  } catch (error) {
    console.log('Error fetching school levels, using dummy data:', error);
    return dummy.dummySchoolLevels;
  }
};

/**
 * Safely fetch school years by level
 * Returns dummy data if Supabase is not ready
 */
export const fetchSchoolYearsSafe = async (levelId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy school years (Supabase not configured)');
    return dummy.getDummySchoolYearsByLevel(levelId);
  }

  try {
    const { data, error } = await supabase
      .from('school_years')
      .select('*')
      .eq('level_id', levelId);

    if (error) {
      console.log('Error fetching school years, using dummy data:', error);
      return dummy.getDummySchoolYearsByLevel(levelId);
    }

    return data || dummy.getDummySchoolYearsByLevel(levelId);
  } catch (error) {
    console.log('Error fetching school years, using dummy data:', error);
    return dummy.getDummySchoolYearsByLevel(levelId);
  }
};

/**
 * Safely fetch school subjects by year
 * Returns dummy data if Supabase is not ready
 */
export const fetchSchoolSubjectsSafe = async (yearId: string) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy school subjects (Supabase not configured)');
    return dummy.getDummySchoolSubjectsByYear(yearId);
  }

  try {
    const { data, error } = await supabase
      .from('school_subjects')
      .select('*')
      .eq('year_id', yearId);

    if (error) {
      console.log('Error fetching school subjects, using dummy data:', error);
      return dummy.getDummySchoolSubjectsByYear(yearId);
    }

    return data || dummy.getDummySchoolSubjectsByYear(yearId);
  } catch (error) {
    console.log('Error fetching school subjects, using dummy data:', error);
    return dummy.getDummySchoolSubjectsByYear(yearId);
  }
};

/**
 * Safely fetch published posts
 * Returns dummy data if Supabase is not ready
 */
export const fetchPublishedPostsSafe = async () => {
  if (!isSupabaseReady()) {
    console.log('Using dummy posts (Supabase not configured)');
    return dummy.getDummyPublishedPosts();
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.log('Error fetching posts, using dummy data:', error);
      return dummy.getDummyPublishedPosts();
    }

    return data || dummy.getDummyPublishedPosts();
  } catch (error) {
    console.log('Error fetching posts, using dummy data:', error);
    return dummy.getDummyPublishedPosts();
  }
};

/**
 * Safely insert a new post
 * Returns error if Supabase is not ready
 */
export const insertPostSafe = async (post: any) => {
  if (!isSupabaseReady()) {
    console.error('Cannot insert post: Supabase is not configured');
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
  }

  try {
    const { data, error } = await supabase.from('posts').insert([post]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error inserting post:', error);
    throw error;
  }
};

// ============================================
// INSERT/UPDATE/DELETE Functions
// ============================================

// Universities
export const insertUniversity = async (name: string, city: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'University name');
  const validatedCity = validateText(city, 'City');
  
  const { data, error } = await supabase
    .from('universities')
    .insert([{ name: validatedName, city: validatedCity }])
    .select();
  if (error) throw error;
  return data;
};

export const updateUniversity = async (id: string, name: string, city: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'University name');
  const validatedCity = validateText(city, 'City');
  
  const { data, error } = await supabase
    .from('universities')
    .update({ name: validatedName, city: validatedCity })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteUniversity = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  console.log('Deleting university with id:', id);
  const { error } = await supabase.from('universities').delete().eq('id', id);
  
  if (error) {
    console.error('Delete error from Supabase:', error);
    throw error;
  }
  
  console.log('Successfully deleted university:', id);
};

// Faculties
export const insertFaculty = async (university_id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Faculty name');
  
  const { data, error } = await supabase
    .from('faculties')
    .insert([{ university_id, name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const updateFaculty = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Faculty name');
  
  const { data, error } = await supabase
    .from('faculties')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteFaculty = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('faculties').delete().eq('id', id);
  if (error) throw error;
};

// Fields
export const insertField = async (faculty_id: string, name: string, degree_type: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Field name');
  const validatedType = validateText(degree_type, 'Degree type');
  
  const { data, error } = await supabase
    .from('fields')
    .insert([{ faculty_id, name: validatedName, degree_type: validatedType }])
    .select();
  if (error) throw error;
  return data;
};

export const updateField = async (id: string, name: string, degree_type: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Field name');
  
  const { data, error } = await supabase
    .from('fields')
    .update({ name: validatedName, degree_type })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteField = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('fields').delete().eq('id', id);
  if (error) throw error;
};

// Semesters
export const insertSemester = async (field_id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Semester');
  
  const { data, error } = await supabase
    .from('semesters')
    .insert([{ field_id, name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const updateSemester = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Semester');
  
  const { data, error } = await supabase
    .from('semesters')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteSemester = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('semesters').delete().eq('id', id);
  if (error) throw error;
};

// Subjects
export const insertSubject = async (semester_id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Subject');
  
  const { data, error } = await supabase
    .from('subjects')
    .insert([{ semester_id, name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const updateSubject = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Subject');
  
  const { data, error } = await supabase
    .from('subjects')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteSubject = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
};

// School Levels
export const insertSchoolLevel = async (name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Level name');
  
  const { data, error } = await supabase
    .from('school_levels')
    .insert([{ name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const deleteSchoolLevel = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('school_levels').delete().eq('id', id);
  if (error) throw error;
};

export const updateSchoolLevel = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Level name');
  
  const { data, error } = await supabase
    .from('school_levels')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

// School Years
export const insertSchoolYear = async (level_id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Year');
  
  const { data, error } = await supabase
    .from('school_years')
    .insert([{ level_id, name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const updateSchoolYear = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Year');
  
  const { data, error } = await supabase
    .from('school_years')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteSchoolYear = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('school_years').delete().eq('id', id);
  if (error) throw error;
};

// School Subjects
export const insertSchoolSubject = async (year_id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Subject');
  
  const { data, error } = await supabase
    .from('school_subjects')
    .insert([{ year_id, name: validatedName }])
    .select();
  if (error) throw error;
  return data;
};

export const updateSchoolSubject = async (id: string, name: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  
  const validatedName = validateText(name, 'Subject');
  
  const { data, error } = await supabase
    .from('school_subjects')
    .update({ name: validatedName })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteSchoolSubject = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');
  const { error } = await supabase.from('school_subjects').delete().eq('id', id);
  if (error) throw error;
};
// ============================================
// POST MANAGEMENT Functions
// ============================================

/**
 * Fetch all posts (admin view)
 */
/**
 * Fetch all posts with pagination
 * @param page Page number (1-indexed, default 1)
 * @param limit Items per page (default 50 for admin)
 */
export const fetchAllPostsSafe = async (page: number = 1, limit: number = 50) => {
  if (!isSupabaseReady()) {
    console.log('Using dummy posts (Supabase not configured)');
    return dummy.getDummyPublishedPosts();
  }

  try {
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching all posts, using dummy data:', error);
      return dummy.getDummyPublishedPosts();
    }

    console.log(`📊 Fetched page ${page} of posts (${count} total)`);
    return data || [];
  } catch (error) {
    console.log('Error fetching all posts, using dummy data:', error);
    return dummy.getDummyPublishedPosts();
  }
};

/**
 * Update post
 */
export const updatePostSafe = async (id: string, updates: any) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete post
 */
export const deletePostSafe = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Bulk update posts (publish/unpublish)
 */
export const bulkUpdatePostsSafe = async (ids: string[], updates: any) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error bulk updating posts:', error);
    throw error;
  }
};

/**
 * Bulk delete posts
 */
export const bulkDeletePostsSafe = async (ids: string[]) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .in('id', ids);

    if (error) throw error;
  } catch (error) {
    console.error('Error bulk deleting posts:', error);
    throw error;
  }
};

// ============================================
// RESOURCE REQUESTS (Phase 1)
// ============================================

export const fetchResourceRequestsSafe = async (): Promise<ResourceRequest[]> => {
  if (!isSupabaseReady()) {
    console.log('Using empty resource requests (Supabase not configured)');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('resource_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching resource requests:', error);
      return [];
    }

    return (data as ResourceRequest[]) || [];
  } catch (error) {
    console.log('Error fetching resource requests:', error);
    return [];
  }
};

export const updateResourceRequestSafe = async (
  id: string,
  updates: Partial<ResourceRequest>
) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { data, error } = await supabase
      .from('resource_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating resource request:', error);
    throw error;
  }
};

export const deleteResourceRequestSafe = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { error } = await supabase
      .from('resource_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting resource request:', error);
    throw error;
  }
};

// ============================================
// CONTENT PACKS (Phase 2)
// ============================================

export const fetchContentPacksSafe = async (): Promise<ContentPack[]> => {
  if (!isSupabaseReady()) {
    console.log('Using empty content packs (Supabase not configured)');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('content_packs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching content packs:', error);
      return [];
    }

    return (data as ContentPack[]) || [];
  } catch (error) {
    console.log('Error fetching content packs:', error);
    return [];
  }
};

export const fetchContentPackItemsSafe = async (packId: string): Promise<ContentPackItem[]> => {
  if (!isSupabaseReady()) {
    console.log('Using empty pack items (Supabase not configured)');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('content_pack_items')
      .select('*')
      .eq('pack_id', packId)
      .order('position', { ascending: true });

    if (error) {
      console.log('Error fetching content pack items:', error);
      return [];
    }

    return (data as ContentPackItem[]) || [];
  } catch (error) {
    console.log('Error fetching content pack items:', error);
    return [];
  }
};

export const insertContentPackSafe = async (pack: {
  title: string;
  description?: string;
  education_type?: string;
  status?: string;
  visibility?: string;
  created_by: string;
}) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  const validatedTitle = validateText(pack.title, 'Pack title');

  try {
    const { data, error } = await supabase
      .from('content_packs')
      .insert([
        {
          title: validatedTitle,
          description: pack.description?.trim() || null,
          education_type: pack.education_type || null,
          status: pack.status || 'draft',
          visibility: pack.visibility || 'public',
          created_by: pack.created_by,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting content pack:', error);
    throw error;
  }
};

export const updateContentPackSafe = async (
  id: string,
  updates: Partial<ContentPack>
) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { data, error } = await supabase
      .from('content_packs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating content pack:', error);
    throw error;
  }
};

export const deleteContentPackSafe = async (id: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { error } = await supabase
      .from('content_packs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting content pack:', error);
    throw error;
  }
};

export const addContentPackItemSafe = async (packId: string, postId: string, position: number = 0) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { data, error } = await supabase
      .from('content_pack_items')
      .insert([{ pack_id: packId, post_id: postId, position }])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding pack item:', error);
    throw error;
  }
};

export const removeContentPackItemSafe = async (packId: string, postId: string) => {
  if (!isSupabaseReady()) throw new Error('Supabase not configured');

  try {
    const { error } = await supabase
      .from('content_pack_items')
      .delete()
      .eq('pack_id', packId)
      .eq('post_id', postId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing pack item:', error);
    throw error;
  }
};
