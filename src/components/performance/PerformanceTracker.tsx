import React, { useEffect, useState } from "react";
import { triathlonApi } from "../../.api/apis/triathlon-api"; // ✅ Correct Import Path

interface Athlete {
  athlete_id: number;
  athlete_full_name: string;
}

interface PerformanceData {
  race_starts: number;
  race_finishes: number;
  race_wins: number;
  race_podiums: number;
}

export default function PerformanceTracker() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [performance, setPerformance] = useState<PerformanceData>({
    race_starts: 0,
    race_finishes: 0,
    race_wins: 0,
    race_podiums: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all athletes on component mount
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await triathlonApi.fetchAthletes();
        if (response?.data) {
          setAthletes(response.data);
        } else {
          throw new Error("No athlete data received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch athletes");
      }
    };

    fetchAthletes();
  }, []);

  // Fetch performance data when an athlete is selected
  useEffect(() => {
    if (!selectedAthleteId || typeof triathlonApi.athleteStatistics !== "function") {
      if (!selectedAthleteId) return;
      console.warn("triathlonApi.athleteStatistics is not a function. Check API implementation.");
      return;
    }

    const fetchPerformance = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await triathlonApi.athleteStatistics({
          elite: "false",
          athlete_id: selectedAthleteId,
        });

        if (response?.data) {
          setPerformance({
            race_starts: response.data.race_starts ?? 0,
            race_finishes: response.data.race_finishes ?? 0,
            race_wins: response.data.race_wins ?? 0,
            race_podiums: response.data.race_podiums ?? 0,
          });
        } else {
          setPerformance({ race_starts: 0, race_finishes: 0, race_wins: 0, race_podiums: 0 });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch performance data");
        setPerformance({ race_starts: 0, race_finishes: 0, race_wins: 0, race_podiums: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [selectedAthleteId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Tracker</h2>

      {/* Athlete Selection Dropdown */}
      <div className="flex space-x-4">
        <select
          value={selectedAthleteId || ""}
          onChange={(e) => setSelectedAthleteId(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Select an Athlete</option>
          {athletes.map((athlete) => (
            <option key={athlete.athlete_id} value={athlete.athlete_id}>
              {athlete.athlete_full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading & Error Messages */}
      {loading && <p>Loading performance data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display Performance Data Only If an Athlete is Selected */}
      {selectedAthleteId && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Performance Data</h3>
          <p>Race Starts: {performance.race_starts}</p>
          <p>Race Finishes: {performance.race_finishes}</p>
          <p>Race Wins: {performance.race_wins}</p>
          <p>Race Podiums: {performance.race_podiums}</p>
        </div>
      )}
    </div>
  );
}
