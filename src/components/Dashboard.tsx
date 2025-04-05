import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, Medal } from 'lucide-react';
import { triathlonApi } from '../.api/apis/triathlon-api'; // ✅ Correct API for fetching athletes
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalAthletes: number;
  activeTrainingPlans: number;
  averagePerformance: number;
  totalEvents: number;
  recentActivities: any[];
  upcomingEvents: any[];
  athleteNames: string[];
}

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-500" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAthletes: 0,
    activeTrainingPlans: 0,
    averagePerformance: 0,
    totalEvents: 0,
    recentActivities: [],
    upcomingEvents: [],
    athleteNames: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          athletesResponse, // ✅ Fetch from the correct API
          trainingPlansResponse,
          performanceResponse,
          eventsResponse
        ] = await Promise.all([
          triathlonApi.fetchAthletes(), // ✅ Ensuring correct API call
          supabase.from('training_plans').select('*').eq('status', 'in_progress'),
          supabase.from('performance_metrics').select('value'),
          supabase.from('events').select('*').gte('event_date', new Date().toISOString()).order('event_date', { ascending: true }).limit(3),
        ]);

        console.log("Athletes Response:", athletesResponse); // 🔹 Debugging Output

        if (!athletesResponse || !athletesResponse.data) {
          throw new Error('Failed to fetch athletes.');
        }

        const performanceValues = performanceResponse.data || [];
        const averagePerformance = performanceValues.length > 0
          ? performanceValues.reduce((acc, curr) => acc + Number(curr.value), 0) / performanceValues.length
          : 0;

        setStats({
          totalAthletes: athletesResponse.data.length || 0, // ✅ Ensuring correct athlete count
          activeTrainingPlans: trainingPlansResponse.data?.length || 0,
          averagePerformance: Math.round(averagePerformance * 100) / 100,
          totalEvents: eventsResponse.data?.length || 0,
          recentActivities: performanceValues.slice(0, 3),
          upcomingEvents: eventsResponse.data || [],
          athleteNames: athletesResponse.data.map((athlete: any) => athlete.athlete_full_name) || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-gray-900 dark:text-white">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <Link 
          to="/athletes"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Athlete
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Athletes" value={stats.totalAthletes} />
        <StatCard icon={Activity} label="Active Training Plans" value={stats.activeTrainingPlans} />
        <StatCard icon={TrendingUp} label="Average Performance" value={stats.averagePerformance} />
        <StatCard icon={Medal} label="Upcoming Events" value={stats.totalEvents} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Athlete Names</h2>
        <ul className="list-disc pl-5 text-gray-900 dark:text-white">
          {stats.athleteNames.length > 0 ? (
            stats.athleteNames.map((name, index) => <li key={index}>{name}</li>)
          ) : (
            <li>No athletes available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
