ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Allow insert to group_members
CREATE POLICY "Allow insert to group_members"
ON group_members
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow select from group_members
CREATE POLICY "Allow select from group_members"
ON group_members
FOR SELECT
TO authenticated
USING (true);
