export interface Athlete {
  id: string;
  user_id: string;
  name: string;
  sport: string;
  date_of_birth: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  athlete_id: string;
  metric_type: string;
  value: number;
  recorded_at: string;
}

export interface TrainingPlan {
  id: string;
  athlete_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string;
  created_at: string;
}

export interface InjuryReport {
  id: string;
  athlete_id: string;
  injury_type: string;
  severity: string;
  date_reported: string;
  recovery_status: 'ongoing' | 'recovered' | 'rehabilitation';
}