-- Step 1: Enable RLS (if not already enabled)
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Step 2: Create insert policy
CREATE POLICY "Allow insert for all authenticated"
ON group_members
FOR INSERT
TO authenticated
WITH CHECK (true);
