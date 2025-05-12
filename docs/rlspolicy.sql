-- Enable RLS for group_members table
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to join a group
CREATE POLICY "Authenticated user can join group"
ON group_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::INTEGER
);
