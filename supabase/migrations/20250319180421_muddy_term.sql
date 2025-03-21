/*
  # Initial Schema Setup for Athlete Management System

  1. New Tables
    - athletes
      - id (uuid, primary key)
      - user_id (references auth.users)
      - name (text)
      - sport (text)
      - date_of_birth (date)
      - created_at (timestamp)
    
    - performance_metrics
      - id (uuid, primary key)
      - athlete_id (references athletes)
      - metric_type (text)
      - value (numeric)
      - recorded_at (timestamp)
    
    - training_plans
      - id (uuid, primary key)
      - athlete_id (references athletes)
      - title (text)
      - description (text)
      - start_date (date)
      - end_date (date)
      - status (text)
    
    - events
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - event_date (timestamp)
      - location (text)
      - created_at (timestamp)
    
    - injury_reports
      - id (uuid, primary key)
      - athlete_id (references athletes)
      - injury_type (text)
      - severity (text)
      - date_reported (timestamp)
      - recovery_status (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create athletes table
CREATE TABLE athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  sport text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create performance_metrics table
CREATE TABLE performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Create training_plans table
CREATE TABLE training_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create injury_reports table
CREATE TABLE injury_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes NOT NULL,
  injury_type text NOT NULL,
  severity text NOT NULL,
  date_reported timestamptz DEFAULT now(),
  recovery_status text NOT NULL DEFAULT 'ongoing'
);

-- Enable Row Level Security
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE injury_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own athlete profile"
  ON athletes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance metrics"
  ON performance_metrics
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = performance_metrics.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own training plans"
  ON training_plans
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = training_plans.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can view all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own injury reports"
  ON injury_reports
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = injury_reports.athlete_id
    AND athletes.user_id = auth.uid()
  ));