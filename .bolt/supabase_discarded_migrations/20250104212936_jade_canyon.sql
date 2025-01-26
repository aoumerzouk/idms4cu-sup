/*
  # Users and Roles Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Firebase Auth UID
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text) - Account status (active/inactive)
    
    - `roles`
      - `id` (text, primary key) - Role identifier (admin, document_manager, etc)
      - `name` (text) - Display name
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_roles`
      - `user_id` (uuid, references users.id)
      - `role_id` (text, references roles.id)
      - `assigned_at` (timestamp)
      - Primary key is (user_id, role_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user self-access

  3. Functions
    - get_user_roles(user_id uuid) - Returns all roles for a user
    - assign_role(user_id uuid, role_id text) - Assigns a role to a user
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  isactive boolean DEFAULT TRUE,
  password text
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id text REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create policies for roles table
CREATE POLICY "Anyone can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Remove policies for user_roles table
-- CREATE POLICY "Users can read own roles"
--   ON user_roles
--   FOR SELECT
--   TO authenticated
--   USING (user_id = auth.uid());

-- CREATE POLICY "Admins can manage user roles"
--   ON user_roles
--   FOR ALL
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM user_roles ur
--       WHERE ur.user_id = auth.uid()
--       AND ur.role_id = 'admin'
--     )
--   );

-- Create policies for permissions table
CREATE POLICY "Anyone can read permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify permissions"
  ON permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create policies for role_permissions table
CREATE POLICY "Anyone can read role permissions"
  ON role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage role permissions"
  ON role_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id uuid)
RETURNS TABLE (
  role_id text,
  role_name text,
  role_description text
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description
  FROM roles r
  JOIN user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to assign role
CREATE OR REPLACE FUNCTION assign_role(p_user_id uuid, p_role_id text)
RETURNS void AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_id)
  VALUES (p_user_id, p_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default permissions
INSERT INTO permissions (id, name, description)
VALUES
  ('ADMIN', 'Admin', 'Full system access'),
  ('SCAN_DOCUMENTS', 'Scan Documents', 'Can scan documents'),
  ('VIEW_DOCUMENTS', 'View Documents', 'Can view documents'),
  ('CREATE_DOCUMENTS', 'Create Documents', 'Can create documents'),
  ('DELETE_DOCUMENTS', 'Delete Documents', 'Can delete documents'),
  ('APPROVE_DOCUMENTS', 'Approve Documents', 'Can approve documents'),
  ('REVIEW_DOCUMENTS', 'Review Documents', 'Can review documents'),
  ('REJECT_DOCUMENTS', 'Reject Documents', 'Can reject documents')
ON CONFLICT (id) DO NOTHING;

-- Insert default roles
INSERT INTO roles (id, name, description)
VALUES
  ('admin', 'Administrator', 'Full system access'),
  ('document_manager', 'Document Manager', 'Can manage all document operations'),
  ('document_viewer', 'Document Viewer', 'Can only view documents')
ON CONFLICT (id) DO NOTHING;

-- Insert default role permissions
INSERT INTO role_permissions (role_id, permission_id)
VALUES
  ('admin', 'ADMIN'),
  ('admin', 'SCAN_DOCUMENTS'),
  ('admin', 'VIEW_DOCUMENTS'),
  ('admin', 'CREATE_DOCUMENTS'),
  ('admin', 'DELETE_DOCUMENTS'),
  ('admin', 'APPROVE_DOCUMENTS'),
  ('admin', 'REVIEW_DOCUMENTS'),
  ('admin', 'REJECT_DOCUMENTS'),
  ('document_manager', 'SCAN_DOCUMENTS'),
  ('document_manager', 'VIEW_DOCUMENTS'),
  ('document_manager', 'CREATE_DOCUMENTS'),
  ('document_manager', 'APPROVE_DOCUMENTS'),
  ('document_manager', 'REVIEW_DOCUMENTS'),
  ('document_viewer', 'VIEW_DOCUMENTS')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert initial admin user
INSERT INTO users (id, email)
VALUES
  (uuid_generate_v4(), 'aoumerzouk@hotmail.com')
ON CONFLICT (id) DO NOTHING;

-- Assign admin role to the initial admin user
INSERT INTO user_roles (user_id, role_id)
SELECT id, 'admin' FROM users WHERE email = 'aoumerzouk@hotmail.com'
ON CONFLICT (user_id, role_id) DO NOTHING;
```

**Key Change:**

*   **Removed `user_roles` Policies:** The RLS policies for the `user_roles` table have been commented out.

By removing these policies, we should be able to isolate the issue and confirm if the recursion is indeed the cause.

Please try loading the application again. If the `500` error is resolved, we can then re-evaluate the RLS policies and implement them in a way that avoids recursion.
