import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase, isSupabaseReady } from '../../lib/supabase';
import {
  fetchSchoolLevelsSafe,
  fetchSchoolYearsSafe,
  fetchSchoolSubjectsSafe,
  insertPostSafe,
} from '../../lib/supabaseWithFallback';
import { Select } from '../ui/Select';
import type { ContentType, SchoolLevel, SchoolYear, SchoolSubject } from '../../types';

interface SchoolFormData {
  level_id: string;
  year_id: string;
  subject_id: string;
  title: string;
  description: string;
  content_type: ContentType;
  file_url: string;
  embed_url: string;
  published: boolean;
}

export function CreateSchoolPost(): React.ReactNode {
  const [step, setStep] = useState(1);
  const [levels, setLevels] = useState<SchoolLevel[]>([]);
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubject[]>([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<SchoolFormData>({
    level_id: '',
    year_id: '',
    subject_id: '',
    title: '',
    description: '',
    content_type: 'course',
    file_url: '',
    embed_url: '',
    published: false,
  });

  useEffect(() => {
    loadLevels();
  }, []);

  useEffect(() => {
    if (formData.level_id) loadYears();
  }, [formData.level_id]);

  useEffect(() => {
    if (formData.year_id) loadSubjects();
  }, [formData.year_id]);

  const loadLevels = async (): Promise<void> => {
    try {
      const data = await fetchSchoolLevelsSafe();
      setLevels(data as SchoolLevel[]);
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const loadYears = async (): Promise<void> => {
    try {
      const data = await fetchSchoolYearsSafe(formData.level_id);
      setYears(data as SchoolYear[]);
    } catch (error) {
      console.error('Error loading years:', error);
    }
  };

  const loadSubjects = async (): Promise<void> => {
    try {
      const data = await fetchSchoolSubjectsSafe(formData.year_id);
      setSchoolSubjects(data as SchoolSubject[]);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setSaving(true);
    try {
      if (!isSupabaseReady()) {
        alert('Supabase is not configured. Please set environment variables.');
        setSaving(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('User not authenticated');
        setSaving(false);
        return;
      }

      await insertPostSafe({
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        education_type: 'school',
        school_subject_id: formData.subject_id,
        file_url: formData.file_url || null,
        embed_url: formData.embed_url || null,
        published: formData.published,
        created_by: user.id,
      });

      alert('Contenu créé avec succès!');
      setFormData({
        level_id: '',
        year_id: '',
        subject_id: '',
        title: '',
        description: '',
        content_type: 'course',
        file_url: '',
        embed_url: '',
        published: false,
      });
      setStep(1);
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Progress Steps */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 1 && 'Sélectionner la Structure'}
            {step === 2 && 'Détails du Contenu'}
            {step === 3 && 'Aperçu et Publication'}
          </h2>
          <p className="text-gray-600">
            {step === 1 && 'Choisissez niveau, année et matière'}
            {step === 2 && 'Ajoutez titre, description et fichiers'}
            {step === 3 && 'Vérifiez et publiez votre contenu'}
          </p>
        </div>

        <div className="px-8 pb-8">
          {step === 1 && (
            <div className="space-y-4">
              <Select
                label="Niveau"
                value={formData.level_id}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    level_id: v,
                    year_id: '',
                    subject_id: '',
                  })
                }
                options={levels}
              />
              {formData.level_id && (
                <Select
                  label="Année"
                  value={formData.year_id}
                  onChange={(v) =>
                    setFormData({
                      ...formData,
                      year_id: v,
                      subject_id: '',
                    })
                  }
                  options={years}
                />
              )}
              {formData.year_id && (
                <Select
                  label="Matière"
                  value={formData.subject_id}
                  onChange={(v) => setFormData({ ...formData, subject_id: v })}
                  options={schoolSubjects}
                />
              )}
              {formData.subject_id && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Continuer
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Contenu
                </label>
                <select
                  value={formData.content_type}
                  onChange={(e) =>
                    setFormData({ ...formData, content_type: e.target.value as ContentType })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="course">Cours</option>
                  <option value="exam">Examen</option>
                  <option value="td">TD</option>
                  <option value="summary">Résumé</option>
                  <option value="link">Lien</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Mathématiques - Chapitre 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Description du contenu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du Fichier (PDF)
                </label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL d'Intégration (YouTube, etc.)
                </label>
                <input
                  type="url"
                  value={formData.embed_url}
                  onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Aperçu</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Titre:</strong> {formData.title}
                  </p>
                  <p>
                    <strong>Type:</strong> {formData.content_type}
                  </p>
                  <p>
                    <strong>Description:</strong> {formData.description}
                  </p>
                  {formData.file_url && <p><strong>Fichier:</strong> ✓</p>}
                  {formData.embed_url && <p><strong>Intégration:</strong> ✓</p>}
                </div>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-900 font-medium">Publier immédiatement</span>
              </label>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
