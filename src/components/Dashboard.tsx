import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, Medal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalAthletes: number;
  activeTrainingPlans: number;
  averagePerformance: number;
  totalEvents: number;
  recentActivities: any[];
  upcomingEvents: any[];
}

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string | number, trend?: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-500" />
    </div>
    {trend && <p className="text-sm text-green-500 mt-2">{trend}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAthletes: 0,
    activeTrainingPlans: 0,
    averagePerformance: 0,
    totalEvents: 0,
    recentActivities: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          athletesResponse,
          trainingPlansResponse,
          performanceResponse,
          eventsResponse
        ] = await Promise.all([
          supabase
            .from('athletes')
            .select('id', { count: 'exact' }),
          
          supabase
            .from('training_plans')
            .select('id', { count: 'exact' })
            .eq('status', 'in_progress'),
          
          supabase
            .from('performance_metrics')
            .select('value'),
          
          supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString())
            .order('event_date', { ascending: true })
            .limit(3)
        ]);

        const performanceValues = performanceResponse.data || [];
        const averagePerformance = performanceValues.length > 0
          ? performanceValues.reduce((acc, curr) => acc + Number(curr.value), 0) / performanceValues.length
          : 0;

        setStats({
          totalAthletes: athletesResponse.count || 0,
          activeTrainingPlans: trainingPlansResponse.count || 0,
          averagePerformance: Math.round(averagePerformance * 100) / 100,
          totalEvents: (eventsResponse.data || []).length,
          recentActivities: performanceValues.slice(0, 3),
          upcomingEvents: eventsResponse.data || []
        });
      } catch (err) {
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
        <StatCard
          icon={Users}
          label="Total Athletes"
          value={stats.totalAthletes}
        />
        <StatCard
          icon={Activity}
          label="Active Training Plans"
          value={stats.activeTrainingPlans}
        />
        <StatCard
          icon={TrendingUp}
          label="Average Performance"
          value={stats.averagePerformance}
        />
        <StatCard
          icon={Medal}
          label="Upcoming Events"
          value={stats.totalEvents}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activities</h2>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.metric_type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Value: {activity.value}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Events</h2>
          <div className="space-y-4">
            {stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Medal className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;