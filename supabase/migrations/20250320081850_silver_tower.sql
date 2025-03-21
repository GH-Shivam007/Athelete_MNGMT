/*
  # Add CRUD policies for all tables

  1. Security Changes
    - Add INSERT, UPDATE, DELETE policies for performance_metrics
    - Add INSERT, UPDATE, DELETE policies for training_plans
    - Add INSERT, UPDATE, DELETE policies for events
    - Add INSERT, UPDATE, DELETE policies for injury_reports

  Note: SELECT policies already exist from the previous migration
*/

-- Performance Metrics Policies
CREATE POLICY "Users can insert performance metrics for their athletes"
  ON performance_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = performance_metrics.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update performance metrics for their athletes"
  ON performance_metrics
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = performance_metrics.athlete_id
    AND athletes.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = performance_metrics.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete performance metrics for their athletes"
  ON performance_metrics
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = performance_metrics.athlete_id
    AND athletes.user_id = auth.uid()
  ));

-- Training Plans Policies
CREATE POLICY "Users can insert training plans for their athletes"
  ON training_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = training_plans.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update training plans for their athletes"
  ON training_plans
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = training_plans.athlete_id
    AND athletes.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = training_plans.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete training plans for their athletes"
  ON training_plans
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = training_plans.athlete_id
    AND athletes.user_id = auth.uid()
  ));

-- Events Policies
CREATE POLICY "Users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- Injury Reports Policies
CREATE POLICY "Users can insert injury reports for their athletes"
  ON injury_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = injury_reports.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update injury reports for their athletes"
  ON injury_reports
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = injury_reports.athlete_id
    AND athletes.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = injury_reports.athlete_id
    AND athletes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete injury reports for their athletes"
  ON injury_reports
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = injury_reports.athlete_id
    AND athletes.user_id = auth.uid()
  ));