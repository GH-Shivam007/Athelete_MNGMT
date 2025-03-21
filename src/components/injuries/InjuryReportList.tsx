import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { InjuryReport, Athlete } from '../../types/database';
import { AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';

export default function InjuryReportList() {
  const [reports, setReports] = useState<InjuryReport[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [editingReport, setEditingReport] = useState<InjuryReport | null>(null);

  const fetchData = async () => {
    try {
      const [reportsResponse, athletesResponse] = await Promise.all([
        supabase
          .from('injury_reports')
          .select('*')
          .order('date_reported', { ascending: false }),
        supabase
          .from('athletes')
          .select('*')
      ]);

      if (reportsResponse.error) throw reportsResponse.error;
      if (athletesResponse.error) throw athletesResponse.error;

      setReports(reportsResponse.data || []);
      setAthletes(athletesResponse.data || []);
      if (athletesResponse.data?.length > 0) {
        setSelectedAthlete(athletesResponse.data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const reportData = {
        athlete_id: selectedAthlete,
        injury_type: formData.get('injury_type'),
        severity: formData.get('severity'),
        recovery_status: formData.get('recovery_status'),
      };

      let error;
      if (editingReport) {
        ({ error } = await supabase
          .from('injury_reports')
          .update(reportData)
          .eq('id', editingReport.id));
      } else {
        ({ error } = await supabase
          .from('injury_reports')
          .insert([reportData]));
      }

      if (error) throw error;
      
      form.reset();
      setShowForm(false);
      setEditingReport(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this injury report?')) return;

    try {
      const { error } = await supabase
        .from('injury_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Injury Reports</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="athlete" className="block text-sm font-medium text-gray-700">
            Select Athlete
          </label>
          <select
            id="athlete"
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {reports
            .filter((report) => report.athlete_id === selectedAthlete)
            .map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.injury_type}</h3>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">
                        Reported: {new Date(report.date_reported).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {report.severity}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {report.recovery_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingReport(report);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingReport ? 'Edit Injury Report' : 'Add New Injury Report'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="injury_type" className="block text-sm font-medium text-gray-700">
                  Injury Type
                </label>
                <input
                  type="text"
                  id="injury_type"
                  name="injury_type"
                  defaultValue={editingReport?.injury_type}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  defaultValue={editingReport?.severity || 'mild'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label htmlFor="recovery_status" className="block text-sm font-medium text-gray-700">
                  Recovery Status
                </label>
                <select
                  id="recovery_status"
                  name="recovery_status"
                  defaultValue={editingReport?.recovery_status || 'ongoing'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="recovered">Recovered</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingReport ? 'Update Report' : 'Add Report'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingReport(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}