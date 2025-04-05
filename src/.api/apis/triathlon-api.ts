// src/api/apis/triathlon-api.ts

const API_BASE_URL = "https://api.triathlon.org/v1";
const API_KEY = "2649776ef9ece4c391003b521cbfce7a"; // Ideally, store in an environment variable

export const triathlonApi = {
  async fetchAthletes() {
    try {
      const response = await fetch(`${API_BASE_URL}/athletes`, {
        headers: {
          "Content-Type": "application/json",
          "apikey": API_KEY
        }
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch athletes:", error);
      return null;
    }
  },

  async fetchAthleteStatistics(athlete_id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/athleteStatistics?athlete_id=${athlete_id}`, {
        headers: {
          "Content-Type": "application/json",
          "apikey": API_KEY
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch athlete statistics:", error);
      return null;
    }
  }
};
