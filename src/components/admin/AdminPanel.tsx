import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
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
  deleteSchoolLevel,
  insertSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  insertSchoolSubject,
  updateSchoolSubject,
  deleteSchoolSubject,
} from '../../lib/supabaseWithFallback';

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

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [newData, setNewData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setUniversities(unis);
      setFaculties(facs);
      setFields(flds);
      setSemesters(sems);
      setSubjects(subs);
      setSchoolLevels(levels);
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
    <div className="bg-white min-h-screen">
      <div className="max-w-full p-4">
        {/* Header */}
        <div className="mb-4 border-b">
          <h1 className="text-sm font-bold text-gray-900 mb-4">Admin Management</h1>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-900">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Tabs - Excel Style */}
        <div className="mb-0 border-b border-gray-300 flex overflow-x-auto">
          {[
            { id: 'universities', label: 'Universities' },
            { id: 'faculties', label: 'Faculties' },
            { id: 'fields', label: 'Fields' },
            { id: 'semesters', label: 'Semesters' },
            { id: 'subjects', label: 'Subjects' },
            { id: 'schoolLevels', label: 'School Levels' },
            { id: 'schoolYears', label: 'School Years' },
            { id: 'schoolSubjects', label: 'School Subjects' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-gray-50'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading...
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
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
          </>
        )}
      </div>
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <input
          type="text"
          placeholder="Name"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="City"
          value={newData.city || ''}
          onChange={(e) => setNewData({ ...newData, city: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        />
        <button
          onClick={onAdd}
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">Name</th>
            <th className="px-3 py-2 text-left font-bold">City</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: University, idx: number) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.city || ''}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.city
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
                {editId === row.id ? (
                  <>
                    <button
                      onClick={() => onUpdate(row.id)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditData({});
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(row.id)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.university_id || ''}
          onChange={(e) => setNewData({ ...newData, university_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select University</option>
          {universities.map((u: University) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Faculty Name"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        />
        <button
          onClick={async () => {
            if (!newData.university_id || !newData.name?.trim()) {
              onError('Please fill in all fields');
              return;
            }
            try {
              await insertFaculty(newData.university_id, newData.name.trim());
              setNewData({});
              await onRefresh();
            } catch (error) {
              onError(error instanceof Error ? error.message : 'Failed');
            }
          }}
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">University</th>
            <th className="px-3 py-2 text-left font-bold">Faculty</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Faculty, idx: number) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600">{getUniversityName(row.university_id)}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.faculty_id || ''}
          onChange={(e) => setNewData({ ...newData, faculty_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select Faculty</option>
          {faculties.map((f: Faculty) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Field Name"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        />
        <select
          value={newData.degree_type || ''}
          onChange={(e) => setNewData({ ...newData, degree_type: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm w-24"
          disabled={loading}
        >
          <option value="">Type</option>
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">Faculty</th>
            <th className="px-3 py-2 text-left font-bold">Field</th>
            <th className="px-3 py-2 text-left font-bold w-20">Type</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Field, idx: number) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600 text-xs">{getFacultyName(row.faculty_id)}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-xs">{row.degree_type}</td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete?')) return;
                        try {
                          await deleteField(row.id);
                          await onRefresh();
                        } catch (error) {
                          onError('Failed');
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.field_id || ''}
          onChange={(e) => setNewData({ ...newData, field_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select Field</option>
          {fields.map((f: Field) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Semester (S1-S6)"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">University</th>
            <th className="px-3 py-2 text-left font-bold">Faculty</th>
            <th className="px-3 py-2 text-left font-bold">Field</th>
            <th className="px-3 py-2 text-left font-bold">Semester</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Semester, idx: number) => {
            const field = getFieldBySemesterId(row.id) || fields.find((f: Field) => f.id === row.field_id);
            const faculty = field ? getFacultyByFieldId(field.id) : undefined;
            const university = faculty ? getUniversityByFacultyId(faculty.id) : undefined;
            return (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600 text-xs">{university?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{faculty?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{field?.name || '–'}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete?')) return;
                        try {
                          await deleteSemester(row.id);
                          await onRefresh();
                        } catch (error) {
                          onError('Failed');
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.semester_id || ''}
          onChange={(e) => setNewData({ ...newData, semester_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select Semester</option>
          {semesters.map((s: Semester) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">University</th>
            <th className="px-3 py-2 text-left font-bold">Faculty</th>
            <th className="px-3 py-2 text-left font-bold">Field</th>
            <th className="px-3 py-2 text-left font-bold">Semester</th>
            <th className="px-3 py-2 text-left font-bold">Subject</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Subject, idx: number) => {
            const semester = semesters.find((s: Semester) => s.id === row.semester_id);
            const semesterField = semester ? fields.find((f: Field) => f.id === semester.field_id) : undefined;
            const faculty = semesterField ? getFacultyByFieldId(semesterField.id) : undefined;
            const university = faculty ? getUniversityByFacultyId(faculty.id) : undefined;
            return (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600 text-xs">{university?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{faculty?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{semesterField?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{getSemesterName(row.semester_id)}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete?')) return;
                        try {
                          await deleteSubject(row.id);
                          await onRefresh();
                        } catch (error) {
                          onError('Failed');
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <input
          type="text"
          placeholder="Level (Collège, Lycée)"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">Level</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: SchoolLevel, idx: number) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1">{row.name}</td>
              <td className="px-3 py-1 text-right space-x-1">
                <button
                  onClick={async () => {
                    if (!window.confirm('Delete?')) return;
                    try {
                      await deleteSchoolLevel(row.id);
                      await onRefresh();
                    } catch (error) {
                      onError('Failed');
                    }
                  }}
                  className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.level_id || ''}
          onChange={(e) => setNewData({ ...newData, level_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select Level</option>
          {schoolLevels.map((l: SchoolLevel) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Year"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">Level</th>
            <th className="px-3 py-2 text-left font-bold">Year</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: SchoolYear, idx: number) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600 text-xs">{getSchoolLevelName(row.level_id)}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete?')) return;
                        try {
                          await deleteSchoolYear(row.id);
                          await onRefresh();
                        } catch (error) {
                          onError('Failed');
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
        <select
          value={newData.year_id || ''}
          onChange={(e) => setNewData({ ...newData, year_id: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
          disabled={loading}
        >
          <option value="">Select Year</option>
          {schoolYears.map((y: SchoolYear) => (
            <option key={y.id} value={y.id}>{y.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={newData.name || ''}
          onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
          className="px-3 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-3 py-2 text-left font-bold">Level</th>
            <th className="px-3 py-2 text-left font-bold">Year</th>
            <th className="px-3 py-2 text-left font-bold">Subject</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: SchoolSubject, idx: number) => {
            const level = getLevelByYearId(row.year_id);
            return (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
              <td className="px-3 py-1 text-gray-600 text-xs">{level?.name || '–'}</td>
              <td className="px-3 py-1 text-gray-600 text-xs">{getSchoolYearName(row.year_id)}</td>
              <td className="px-3 py-1">
                {editId === row.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 w-full text-sm"
                  />
                ) : (
                  row.name
                )}
              </td>
              <td className="px-3 py-1 text-right space-x-1">
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
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
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete?')) return;
                        try {
                          await deleteSchoolSubject(row.id);
                          await onRefresh();
                        } catch (error) {
                          onError('Failed');
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-gray-300 text-xs hover:bg-gray-50 text-red-600"
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
  );
}
