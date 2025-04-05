import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

// Static list of athletes
const athletes = [
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
];

interface InjuryReport {
  id: string;
  athlete_id: string;
  injury_type: string;
  severity: string;
  recovery_status: string;
  date_reported: string;
}

export default function InjuryReportList() {
  const [reports, setReports] = useState<InjuryReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<string>(athletes[0].id);
  const [editingReport, setEditingReport] = useState<InjuryReport | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newReport: InjuryReport = {
      id: `${Date.now()}`, // Temporary ID
      athlete_id: selectedAthlete,
      injury_type: formData.get('injury_type') as string,
      severity: formData.get('severity') as string,
      recovery_status: formData.get('recovery_status') as string,
      date_reported: new Date().toISOString()
    };

    setReports((prevReports) => [newReport, ...prevReports]);

    form.reset();
    setShowForm(false);
    setEditingReport(null);
  };

  const getAthleteName = (id: string) => {
    return athletes.find((a) => a.id === id)?.name || 'Unknown';
  };

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
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.injury_type}</h3>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">
                        Reported: {new Date(report.date_reported).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getAthleteName(report.athlete_id)}
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
                      onClick={() => setReports(reports.filter((r) => r.id !== report.id))}
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

              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingReport ? 'Update Report' : 'Add Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
