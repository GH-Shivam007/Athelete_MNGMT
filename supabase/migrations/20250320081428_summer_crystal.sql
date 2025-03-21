/*
  # Add RLS policies for athletes table

  1. Security Changes
    - Add INSERT policy for authenticated users
    - Add UPDATE policy for users to modify their own athletes
    - Add DELETE policy for users to remove their own athletes

  Note: The SELECT policy already exists from the previous migration
*/

-- Policy for inserting new athletes
CREATE POLICY "Users can insert their own athletes"
  ON athletes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating athletes
CREATE POLICY "Users can update their own athletes"
  ON athletes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting athletes
CREATE POLICY "Users can delete their own athletes"
  ON athletes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);