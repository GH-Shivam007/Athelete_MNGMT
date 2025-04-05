import React, { useState } from 'react';
import type { TrainingPlan, Athlete } from '../../types/database';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function TrainingPlanList() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([
    { id: '1', name: 'Tommaso Fogliatto' },
    { id: '2', name: 'Pietro Matarazzo' },
    { id: '3', name: 'Taylor Foster' },
    { id: '4', name: 'Samantha Valdes Molina' },
    { id: '5', name: 'Steffi Steinberg' },
    { id: '6', name: 'Ciat Joyce' },
    { id: '7', name: 'Victoria Sosa' },
    { id: '8', name: 'Thyago Alberto Guimarães Santos' },
    { id: '9', name: 'Paula Ryder' },
    { id: '10', name: 'Noura Alomairi' }
  ]);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('1');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newPlan: TrainingPlan = {
      id: Math.random().toString(36).substring(7), // Random ID for local storage
      athlete_id: selectedAthlete,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      status: formData.get('status') as string,
    };

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((plan) => (plan.id === editingPlan.id ? newPlan : plan))
      );
    } else {
      setPlans((prev) => [...prev, newPlan]);
    }

    form.reset();
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this training plan?')) return;
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Training Plans</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
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
          {plans
            .filter((plan) => plan.athlete_id === selectedAthlete)
            .map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {plan.status}
                  </span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingPlan ? 'Edit Training Plan' : 'Add New Training Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingPlan?.title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingPlan?.description || ''}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    defaultValue={editingPlan?.start_date}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    defaultValue={editingPlan?.end_date}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md">
                  {editingPlan ? 'Update Plan' : 'Add Plan'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 px-4 bg-gray-200 rounded-md">
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
