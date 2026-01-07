import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseReady } from '../../lib/supabase';
import {
  fetchSchoolLevelsSafe,
  fetchSchoolYearsSafe,
  fetchSchoolSubjectsSafe,
  insertPostSafe,
} from '../../lib/supabaseWithFallback';
import { Button, Card, Stepper, SelectInput, TextInput, TextArea, Badge, Toast, type ToastMessage } from '../design-system';
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

interface CreateSchoolPostProps {
  onBack: () => void;
}

export function CreateSchoolPost({ onBack }: CreateSchoolPostProps): React.ReactNode {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [levels, setLevels] = useState<SchoolLevel[]>([]);
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubject[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

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
    setError('');
    try {
      if (!isSupabaseReady()) {
        setToast({
          type: 'error',
          message: 'Supabase is not configured. Please set environment variables.',
        });
        setSaving(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
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

      setToast({
        type: 'success',
        message: `Content created successfully as ${formData.published ? 'Published' : 'Draft'}!`,
      });
      
      setTimeout(onBack, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = (): void => {
    setError('');
    if (step === 0) {
      if (!formData.subject_id) {
        setError('Please select all fields to continue');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!formData.title || !formData.description) {
        setError('Title and description are required');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = (): void => {
    if (step > 0) {
      setStep(step - 1);
      setError('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="subtle" icon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New School Content</h1>
          <p className="text-slate-600 text-sm mt-1">Add courses and materials for school students</p>
        </div>
      </div>

      <Card className="p-8">
        <Stepper steps={['Select Subject', 'Content Details', 'Review & Publish']} currentStep={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">Follow the hierarchy to select where this content belongs</p>
              <div className="space-y-4">
                <SelectInput
                  label="School Level"
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
                  required
                />

                {formData.level_id && (
                  <SelectInput
                    label="Year"
                    value={formData.year_id}
                    onChange={(v) =>
                      setFormData({
                        ...formData,
                        year_id: v,
                        subject_id: '',
                      })
                    }
                    options={years}
                    required
                  />
                )}

                {formData.year_id && (
                  <SelectInput
                    label="Subject"
                    value={formData.subject_id}
                    onChange={(v) => setFormData({ ...formData, subject_id: v })}
                    options={schoolSubjects}
                    required
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={onBack} fullWidth>
                Cancel
              </Button>
              <Button onClick={handleNext} fullWidth disabled={!formData.subject_id}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">Add the content details</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Content Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['course', 'exam', 'td', 'summary', 'link'] as ContentType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, content_type: type })}
                        className={`p-3 rounded-lg border-2 transition ${
                          formData.content_type === type
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-medium text-slate-900 capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <TextInput
                  label="Title"
                  value={formData.title}
                  onChange={(v) => setFormData({ ...formData, title: v })}
                  placeholder="e.g., Mathematics - Chapter 5"
                  required
                />

                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(v) => setFormData({ ...formData, description: v })}
                  placeholder="Describe the content briefly..."
                  rows={4}
                  required
                />

                <TextInput
                  label="File URL (PDF, Word, etc.)"
                  type="url"
                  value={formData.file_url}
                  onChange={(v) => setFormData({ ...formData, file_url: v })}
                  placeholder="https://..."
                />

                <TextInput
                  label="Embed URL (YouTube, Google Drive, etc.)"
                  type="url"
                  value={formData.embed_url}
                  onChange={(v) => setFormData({ ...formData, embed_url: v })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleBack} fullWidth>
                Back
              </Button>
              <Button onClick={handleNext} fullWidth>
                Review
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">Review and publish your content</p>

              <div className="bg-slate-50 rounded-lg p-6 space-y-4 mb-6">
                <div>
                  <p className="text-xs text-slate-600 font-medium mb-1">Title</p>
                  <p className="text-slate-900 font-medium">{formData.title}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-medium mb-1">Description</p>
                  <p className="text-slate-900">{formData.description}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge label={formData.content_type} variant="primary" />
                  {formData.file_url && <Badge label="Has file" variant="success" />}
                  {formData.embed_url && <Badge label="Has embed" variant="success" />}
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300"
                />
                <span className="text-slate-900 font-medium">Publish immediately</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleBack} fullWidth>
                Back
              </Button>
              <Button onClick={handleSubmit} loading={saving} fullWidth icon={Save}>
                Save & Publish
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
