CREATE POLICY "Authenticated user can join groups"
ON group_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::INTEGER
);
