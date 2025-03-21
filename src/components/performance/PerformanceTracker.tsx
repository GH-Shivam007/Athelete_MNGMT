import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { PerformanceMetric, Athlete } from '../../types/database';
import { LineChart, TrendingUp, Plus } from 'lucide-react';

export default function PerformanceTracker() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');

  const fetchData = async () => {
    try {
      const [metricsResponse, athletesResponse] = await Promise.all([
        supabase
          .from('performance_metrics')
          .select('*')
          .order('recorded_at', { ascending: false }),
        supabase
          .from('athletes')
          .select('*')
      ]);

      if (metricsResponse.error) throw metricsResponse.error;
      if (athletesResponse.error) throw athletesResponse.error;

      setMetrics(metricsResponse.data || []);
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

  const handleAddMetric = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newMetric = {
        athlete_id: selectedAthlete,
        metric_type: formData.get('metric_type'),
        value: parseFloat(formData.get('value') as string),
      };

      const { error } = await supabase
        .from('performance_metrics')
        .insert([newMetric]);

      if (error) throw error;
      
      form.reset();
      setShowForm(false);
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
        <h2 className="text-2xl font-bold text-gray-900">Performance Tracking</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Metric
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
          {metrics
            .filter((metric) => metric.athlete_id === selectedAthlete)
            .map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{metric.metric_type}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(metric.recorded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{metric.value}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Metric</h3>
            <form onSubmit={handleAddMetric} className="space-y-4">
              <div>
                <label htmlFor="metric_type" className="block text-sm font-medium text-gray-700">
                  Metric Type
                </label>
                <input
                  type="text"
                  id="metric_type"
                  name="metric_type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Speed, Weight, Distance"
                />
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Value
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Metric
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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