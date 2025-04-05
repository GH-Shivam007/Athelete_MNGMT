import React, { useEffect, useState } from "react";
import { triathlonApi } from "../../.api/apis/triathlon-api"; // ✅ Correct Import Path

interface Athlete {
  athlete_id: number;
  athlete_full_name: string;
  athlete_sport?: string;
  athlete_country_name: string;
  athlete_flag: string;
  athlete_age: number;
}

export default function AthleteList() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await triathlonApi.fetchAthletes();
        if (response?.data) {
          setAthletes(response.data);
        } else {
          throw new Error("No data received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch athletes");
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  if (loading) return <div>Loading athletes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Athletes</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {athletes.map((athlete) => (
          <div
            key={athlete.athlete_id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{athlete.athlete_full_name}</h3>
                <p className="text-sm text-gray-500">{athlete.athlete_sport || "Unknown Sport"}</p>
                <p className="text-sm text-gray-500">{athlete.athlete_country_name}</p>
              </div>
              <img
                src={athlete.athlete_flag}
                alt={athlete.athlete_country_name}
                className="w-8 h-5"
              />
            </div>
            <p className="text-sm text-gray-600">Age: {athlete.athlete_age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
