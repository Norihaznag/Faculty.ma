import React, { useState, useEffect } from 'react';
import { FlexibleSelect } from './FlexibleSelect';
import { ProPostsTable } from './ProPostsTable';
import {
  fetchUniversitiesSafe,
  insertUniversity,
  updateUniversity,
  deleteUniversity,
  insertFaculty,
  updateFaculty,
  deleteFaculty,
  insertField,
  updateField,
  deleteField,
  insertSemester,
  updateSemester,
  deleteSemester,
  insertSubject,
  updateSubject,
  deleteSubject,
  fetchFacultiesSafe,
  fetchFieldsSafe,
  fetchSemestersSafe,
  fetchSubjectsSafe,
  fetchSchoolLevelsSafe,
  fetchSchoolYearsSafe,
  fetchSchoolSubjectsSafe,
  insertSchoolLevel,
  updateSchoolLevel,
  deleteSchoolLevel,
  insertSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  insertSchoolSubject,
  updateSchoolSubject,
  deleteSchoolSubject,
  fetchAllPostsSafe,
} from '../../lib/supabaseWithFallback';
import type { Post } from '../../types';

interface University {
  id: string;
  name: string;
  city: string;
}

interface Faculty {
  id: string;
  university_id: string;
  name: string;
}

interface Field {
  id: string;
  faculty_id: string;
  name: string;
  degree_type: string;
}

interface Semester {
  id: string;
  field_id: string;
  name: string;
}

interface Subject {
  id: string;
  semester_id: string;
  name: string;
}

interface SchoolLevel {
  id: string;
  name: string;
}

interface SchoolYear {
  id: string;
  level_id: string;
  name: string;
}

interface SchoolSubject {
  id: string;
  year_id: string;
  name: string;
}

export function AdminPanel(): React.ReactNode {
  const [activeTab, setActiveTab] = useState('universities');
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubject[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [newData, setNewData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [unis, facs, flds, sems, subs, levels, years, subjs] = await Promise.all([
        fetchUniversitiesSafe(),
        (async () => {
          const result: Faculty[] = [];
          const unis = await fetchUniversitiesSafe();
          for (const uni of unis) {
            const facs = await fetchFacultiesSafe(uni.id);
            result.push(...facs);
          }
          return result;
        })(),
        (async () => {
          const result: Field[] = [];
          const unis = await fetchUniversitiesSafe();
          for (const uni of unis) {
            const facs = await fetchFacultiesSafe(uni.id);
            for (const fac of facs) {
              const flds = await fetchFieldsSafe(fac.id);
              result.push(...flds);
            }
          }
          return result;
        })(),
        (async () => {
          const result: Semester[] = [];
          const unis = await fetchUniversitiesSafe();
          for (const uni of unis) {
            const facs = await fetchFacultiesSafe(uni.id);
            for (const fac of facs) {
              const flds = await fetchFieldsSafe(fac.id);
              for (const fld of flds) {
                const sems = await fetchSemestersSafe(fld.id);
                result.push(...sems);
              }
            }
          }
          return result;
        })(),
        (async () => {
          const result: Subject[] = [];
          const unis = await fetchUniversitiesSafe();
          for (const uni of unis) {
            const facs = await fetchFacultiesSafe(uni.id);
            for (const fac of facs) {
              const flds = await fetchFieldsSafe(fac.id);
              for (const fld of flds) {
                const sems = await fetchSemestersSafe(fld.id);
                for (const sem of sems) {
                  const subs = await fetchSubjectsSafe(sem.id);
                  result.push(...subs);
                }
              }
            }
          }
          return result;
        })(),
        fetchSchoolLevelsSafe(),
        (async () => {
          const result: SchoolYear[] = [];
          const levels = await fetchSchoolLevelsSafe();
          for (const level of levels) {
            const years = await fetchSchoolYearsSafe(level.id);
            result.push(...years);
          }
          return result;
        })(),
        (async () => {
          const result: SchoolSubject[] = [];
          const levels = await fetchSchoolLevelsSafe();
          for (const level of levels) {
            const years = await fetchSchoolYearsSafe(level.id);
            for (const year of years) {
              const subjs = await fetchSchoolSubjectsSafe(year.id);
              result.push(...subjs);
            }
          }
          return result;
        })(),
      ]);

      const allPosts = await fetchAllPostsSafe();
      
      setUniversities(unis);
      setFaculties(facs);
      setFields(flds);
      setSemesters(sems);
      setSubjects(subs);
      setSchoolLevels(levels);
      setSchoolYears(years);
      setSchoolSubjects(subjs);
      setPosts(allPosts as Post[]);
      setSelectedPostIds(new Set());
      setSchoolYears(years);
      setSchoolSubjects(subjs);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleAddUniversity = async () => {
    if (!newData.name?.trim() || !newData.city?.trim()) {
      showError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await insertUniversity(newData.name.trim(), newData.city.trim());
      setNewData({});
      await loadAllData();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to add university');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUniversity = async (id: string) => {
    if (!editData.name?.trim() || !editData.city?.trim()) {
      showError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await updateUniversity(id, editData.name.trim(), editData.city.trim());
      setEditId(null);
      setEditData({});
      await loadAllData();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!window.confirm('Delete this university and all associated data?')) return;
    try {
      setLoading(true);
      await deleteUniversity(id);
      await loadAllData();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const getUniversityName = (uniId: string) => universities.find(u => u.id === uniId)?.name || '–';
  const getFacultyName = (facId: string) => faculties.find(f => f.id === facId)?.name || '–';
  const getFieldName = (fldId: string) => fields.find(f => f.id === fldId)?.name || '–';
  const getSemesterName = (semId: string) => semesters.find(s => s.id === semId)?.name || '–';
  const getSchoolLevelName = (lvlId: string) => schoolLevels.find(l => l.id === lvlId)?.name || '–';
  const getSchoolYearName = (yrId: string) => schoolYears.find(y => y.id === yrId)?.name || '–';

  // Helper functions for parent lookups
  const getFacultyByFieldId = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? faculties.find(f => f.id === field.faculty_id) : undefined;
  };

  const getUniversityByFacultyId = (facultyId: string) => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty ? universities.find(u => u.id === faculty.university_id) : undefined;
  };

  const getFieldBySemesterId = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId);
    return semester ? fields.find(f => f.id === semester.field_id) : undefined;
  };

  const getLevelByYearId = (yearId: string) => {
    const year = schoolYears.find(y => y.id === yearId);
    return year ? schoolLevels.find(l => l.id === year.level_id) : undefined;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-600 text-gray-900">Admin</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your educational content</p>
            </div>
            {error && (
              <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Apple Style */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-8">
            {[
              { id: 'universities', label: 'Universities' },
              { id: 'faculties', label: 'Faculties' },
              { id: 'fields', label: 'Fields' },
              { id: 'semesters', label: 'Semesters' },
              { id: 'subjects', label: 'Subjects' },
              { id: 'schoolLevels', label: 'Levels' },
              { id: 'schoolYears', label: 'Years' },
              { id: 'schoolSubjects', label: 'S. Subjects' },
              { id: 'posts', label: 'Posts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-0 text-sm font-500 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Universities */}
            {activeTab === 'universities' && (
              <UniversitiesTable
                data={universities}
                onAdd={handleAddUniversity}
                onUpdate={handleUpdateUniversity}
                onDelete={handleDeleteUniversity}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
              />
            )}

            {/* Faculties */}
            {activeTab === 'faculties' && (
              <FacultiesTable
                data={faculties}
                universities={universities}
                getUniversityName={getUniversityName}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* Fields */}
            {activeTab === 'fields' && (
              <FieldsTable
                data={fields}
                faculties={faculties}
                getFacultyName={getFacultyName}
                getUniversityName={getUniversityName}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* Semesters */}
            {activeTab === 'semesters' && (
              <SemestersTable
                data={semesters}
                fields={fields}
                _faculties={faculties}
                _universities={universities}
                _getFieldName={getFieldName}
                getFieldBySemesterId={getFieldBySemesterId}
                getFacultyByFieldId={getFacultyByFieldId}
                getUniversityByFacultyId={getUniversityByFacultyId}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* Subjects */}
            {activeTab === 'subjects' && (
              <SubjectsTable
                data={subjects}
                semesters={semesters}
                fields={fields}
                _faculties={faculties}
                _universities={universities}
                getSemesterName={getSemesterName}
                _getFieldName={getFieldName}
                getFieldBySemesterId={getFieldBySemesterId}
                getFacultyByFieldId={getFacultyByFieldId}
                getUniversityByFacultyId={getUniversityByFacultyId}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* School Levels */}
            {activeTab === 'schoolLevels' && (
              <SchoolLevelsTable
                data={schoolLevels}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* School Years */}
            {activeTab === 'schoolYears' && (
              <SchoolYearsTable
                data={schoolYears}
                schoolLevels={schoolLevels}
                getSchoolLevelName={getSchoolLevelName}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* School Subjects */}
            {activeTab === 'schoolSubjects' && (
              <SchoolSubjectsTable
                data={schoolSubjects}
                schoolYears={schoolYears}
                schoolLevels={schoolLevels}
                getSchoolYearName={getSchoolYearName}
                getSchoolLevelName={getSchoolLevelName}
                getLevelByYearId={getLevelByYearId}
                editId={editId}
                editData={editData}
                setEditData={setEditData}
                setEditId={setEditId}
                newData={newData}
                setNewData={setNewData}
                loading={loading}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}

            {/* Posts */}
            {activeTab === 'posts' && (
              <ProPostsTable
                data={posts}
                subjects={subjects}
                schoolSubjects={schoolSubjects}
                selectedIds={selectedPostIds}
                onSelectId={(id: string) => {
                  const newSet = new Set(selectedPostIds);
                  if (newSet.has(id)) newSet.delete(id);
                  else newSet.add(id);
                  setSelectedPostIds(newSet);
                }}
                onRefresh={loadAllData}
                onError={showError}
              />
            )}
        </div>
      )}
    </div>
  );
}

// Universities Table
function UniversitiesTable({
  data,
  onAdd,
  onUpdate,
  onDelete,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.name?.trim() && newData.city?.trim()));
  }, [newData]);

  return (
    <div className="space-y-4">
      {/* Create Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-600 text-gray-900">Add University</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="City"
            value={newData.city || ''}
            onChange={(e) => setNewData({ ...newData, city: e.target.value })}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-700">City</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: University) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.city || ''}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{row.city}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editId === row.id ? (
                      <>
                        <button
                          onClick={() => onUpdate(row.id)}
                          className="px-3 py-1.5 text-xs font-500 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditData({});
                          }}
                          className="px-3 py-1.5 text-xs font-500 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(row.id);
                            setEditData({ name: row.name, city: row.city });
                          }}
                          className="px-3 py-1.5 text-xs font-500 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="px-3 py-1.5 text-xs font-500 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Faculties Table
function FacultiesTable({
  data,
  universities,
  getUniversityName,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.university_id && newData.name?.trim()));
  }, [newData]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-600 text-gray-900">Add Faculty</h3>
        <FlexibleSelect
          options={universities.map((u: University) => ({ id: u.id, name: u.name }))}
          value={newData.university_id || ''}
          onChange={(value) => setNewData({ ...newData, university_id: value })}
          onAddNew={async (name: string) => {
            await insertUniversity(name, 'New City');
            await onRefresh();
          }}
          placeholder="University"
          disabled={loading}
          loading={loading}
        />
        <input
          type="text"
          placeholder="Faculty Name"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300 transition"
          disabled={loading}
        />
        <div className="flex justify-end">
          <button
            onClick={async () => {
              if (!newData.university_id || !newData.name?.trim()) {
                onError('Please fill all fields');
                return;
              }
              try {
                await insertFaculty(newData.university_id, newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError('Failed to add');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-700">University</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-700">Faculty</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: Faculty) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-600">{getUniversityName(row.university_id)}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editId === row.id ? (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await updateFaculty(row.id, editData.name);
                              setEditId(null);
                              setEditData({});
                              await onRefresh();
                            } catch (error) {
                              onError('Failed');
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-500 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 py-1.5 text-xs font-500 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(row.id);
                            setEditData({ name: row.name });
                          }}
                          className="px-3 py-1.5 text-xs font-500 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete?')) return;
                            try {
                              await deleteFaculty(row.id);
                              await onRefresh();
                            } catch (error) {
                              onError('Failed');
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-500 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fields Table
function FieldsTable({
  data,
  faculties,
  getFacultyName,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.faculty_id && newData.name?.trim() && newData.degree_type));
  }, [newData]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Field</h3>
        <div className="grid grid-cols-4 gap-4">
          <FlexibleSelect
            options={faculties.map((f: Faculty) => ({ id: f.id, name: f.name }))}
            value={newData.faculty_id || ''}
            onChange={(value) => setNewData({ ...newData, faculty_id: value })}
            onAddNew={async (name: string) => {
              const unis = await fetchUniversitiesSafe();
              if (unis && (unis as any[]).length > 0) {
                await insertFaculty((unis as any)[0].id, name);
                await onRefresh();
              } else {
                throw new Error('No universities found');
              }
            }}
            placeholder="Select Faculty"
            disabled={loading}
            loading={loading}
          />
          <input
            type="text"
            placeholder="Field Name"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <select
            value={newData.degree_type || ''}
            onChange={(e) => setNewData({ ...newData, degree_type: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          >
            <option value="">Select Type</option>
            <option value="licence">Licence</option>
            <option value="master">Master</option>
          </select>
          <button
            onClick={async () => {
              if (!newData.faculty_id || !newData.name?.trim() || !newData.degree_type) {
                onError('Please fill in all fields');
                return;
              }
              try {
                await insertField(newData.faculty_id, newData.name.trim(), newData.degree_type);
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Faculty</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Field</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Type</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: Field) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{getFacultyName(row.faculty_id)}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700 text-sm">{row.degree_type}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateField(row.id, editData.name, row.degree_type);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this field?')) return;
                          try {
                            await deleteField(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Semesters Table
function SemestersTable({
  data,
  fields,
  getFieldBySemesterId,
  getFacultyByFieldId,
  getUniversityByFacultyId,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.field_id && newData.name?.trim()));
  }, [newData]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Semester</h3>
        <div className="grid grid-cols-3 gap-4">
          <FlexibleSelect
            options={fields.map((f: Field) => ({ id: f.id, name: f.name }))}
            value={newData.field_id || ''}
            onChange={(value) => setNewData({ ...newData, field_id: value })}
            onAddNew={async (name: string) => {
              const facs = await fetchFacultiesSafe('');
              if (facs && (facs as any[]).length > 0) {
                await insertField((facs as any)[0].id, name, 'licence');
                await onRefresh();
              } else {
                throw new Error('No faculties found');
              }
            }}
            placeholder="Select Field"
            disabled={loading}
            loading={loading}
          />
          <input
            type="text"
            placeholder="Semester (S1-S6)"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            onClick={async () => {
              if (!newData.field_id || !newData.name?.trim()) {
                onError('Please fill in all fields');
                return;
              }
              try {
                await insertSemester(newData.field_id, newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">University</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Faculty</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Field</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Semester</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: Semester) => {
              const field = getFieldBySemesterId(row.id) || fields.find((f: Field) => f.id === row.field_id);
              const faculty = field ? getFacultyByFieldId(field.id) : undefined;
              const university = faculty ? getUniversityByFacultyId(faculty.id) : undefined;
              return (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700 text-sm">{university?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{faculty?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{field?.name || '–'}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateSemester(row.id, editData.name);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this semester?')) return;
                          try {
                            await deleteSemester(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subjects Table
function SubjectsTable({
  data,
  semesters,
  fields,
  getSemesterName,
  getFacultyByFieldId,
  getUniversityByFacultyId,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.semester_id && newData.name?.trim()));
  }, [newData]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Subject</h3>
        <div className="grid grid-cols-3 gap-4">
          <FlexibleSelect
            options={semesters.map((s: Semester) => ({ id: s.id, name: s.name }))}
            value={newData.semester_id || ''}
            onChange={(value) => setNewData({ ...newData, semester_id: value })}
            onAddNew={async (name: string) => {
              const flds = await fetchFieldsSafe('');
              if (flds && (flds as any[]).length > 0) {
                await insertSemester((flds as any)[0].id, name);
                await onRefresh();
              } else {
                throw new Error('No fields found');
              }
            }}
            placeholder="Select Semester"
            disabled={loading}
            loading={loading}
          />
          <input
            type="text"
            placeholder="Subject"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            onClick={async () => {
              if (!newData.semester_id || !newData.name?.trim()) {
                onError('Please fill in all fields');
                return;
              }
              try {
                await insertSubject(newData.semester_id, newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">University</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Faculty</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Field</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Subject</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: Subject) => {
              const semester = semesters.find((s: Semester) => s.id === row.semester_id);
              const semesterField = semester ? fields.find((f: Field) => f.id === semester.field_id) : undefined;
              const faculty = semesterField ? getFacultyByFieldId(semesterField.id) : undefined;
              const university = faculty ? getUniversityByFacultyId(faculty.id) : undefined;
              return (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700 text-sm">{university?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{faculty?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{semesterField?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{getSemesterName(row.semester_id)}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateSubject(row.id, editData.name);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this subject?')) return;
                          try {
                            await deleteSubject(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// School Levels Table
function SchoolLevelsTable({
  data,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.name?.trim()));
  }, [newData]);

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<any>({});

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Level</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Level (Collège, Lycée)"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            onClick={async () => {
              if (!newData.name?.trim()) {
                onError('Please enter level name');
                return;
              }
              try {
                await insertSchoolLevel(newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Level</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: SchoolLevel) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateSchoolLevel(row.id, editData.name);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this level?')) return;
                          try {
                            await deleteSchoolLevel(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// School Years Table
function SchoolYearsTable({
  data,
  schoolLevels,
  getSchoolLevelName,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.level_id && newData.name?.trim()));
  }, [newData]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Year</h3>
        <div className="grid grid-cols-3 gap-4">
          <FlexibleSelect
            options={schoolLevels.map((l: SchoolLevel) => ({ id: l.id, name: l.name }))}
            value={newData.level_id || ''}
            onChange={(value) => setNewData({ ...newData, level_id: value })}
            onAddNew={async (name: string) => {
              await insertSchoolLevel(name);
              await onRefresh();
            }}
            placeholder="Select Level"
            disabled={loading}
            loading={loading}
          />
          <input
            type="text"
            placeholder="Year"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            onClick={async () => {
              if (!newData.level_id || !newData.name?.trim()) {
                onError('Please fill in all fields');
                return;
              }
              try {
                await insertSchoolYear(newData.level_id, newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Level</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Year</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: SchoolYear) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{getSchoolLevelName(row.level_id)}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateSchoolYear(row.id, editData.name);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this year?')) return;
                          try {
                            await deleteSchoolYear(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// School Subjects Table
function SchoolSubjectsTable({
  data,
  schoolYears,
  getSchoolYearName,
  getLevelByYearId,
  editId,
  editData,
  setEditData,
  setEditId,
  newData,
  setNewData,
  loading,
  onRefresh,
  onError,
}: any) {
  const [newFormValid, setNewFormValid] = React.useState(false);
  
  React.useEffect(() => {
    setNewFormValid(!!(newData.year_id && newData.name?.trim()));
  }, [newData]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-600 text-gray-900 mb-4">Add Subject</h3>
        <div className="grid grid-cols-3 gap-4">
          <FlexibleSelect
            options={schoolYears.map((y: SchoolYear) => ({ id: y.id, name: y.name }))}
            value={newData.year_id || ''}
            onChange={(value) => setNewData({ ...newData, year_id: value })}
            onAddNew={async (name: string) => {
              const lvls = await fetchSchoolLevelsSafe();
              if (lvls && (lvls as any[]).length > 0) {
                await insertSchoolYear((lvls as any)[0].id, name);
                await onRefresh();
              } else {
                throw new Error('No levels found');
              }
            }}
            placeholder="Select Year"
            disabled={loading}
            loading={loading}
          />
          <input
            type="text"
            placeholder="Subject"
            value={newData.name || ''}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            onClick={async () => {
              if (!newData.year_id || !newData.name?.trim()) {
                onError('Please fill in all fields');
                return;
              }
              try {
                await insertSchoolSubject(newData.year_id, newData.name.trim());
                setNewData({});
                await onRefresh();
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed');
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-500 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newFormValid}
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Level</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Year</th>
              <th className="px-6 py-3 text-left text-xs font-600 text-gray-900">Subject</th>
              <th className="px-6 py-3 text-right text-xs font-600 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: SchoolSubject) => {
              const level = getLevelByYearId(row.year_id);
              return (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{level?.name || '–'}</td>
                <td className="px-6 py-4 text-gray-700">{getSchoolYearName(row.year_id)}</td>
                <td className="px-6 py-4">
                  {editId === row.id ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-200 w-full text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <span className="text-gray-900 font-500">{row.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editId === row.id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await updateSchoolSubject(row.id, editData.name);
                            setEditId(null);
                            setEditData({});
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-500 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(row.id);
                          setEditData({ name: row.name });
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-500 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this subject?')) return;
                          try {
                            await deleteSchoolSubject(row.id);
                            await onRefresh();
                          } catch (error) {
                            onError('Failed');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-500 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
