/*
  # Authentication and User Management Schema

  1. New Tables
    - Updates to existing users table for Supabase Auth integration
    - Ensures proper RLS policies for authentication

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users
    - Add trigger for automatic user profile creation

  3. Functions
    - Function to create user profile on signup
    - Function to handle user role assignment
*/

-- Update users table to work with Supabase Auth
ALTER TABLE users ALTER COLUMN id TYPE uuid USING id::uuid;
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add trigger to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name, preferences)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email = 'admin@cameroonmart.cm' THEN 'admin'
      ELSE 'user'
    END,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    jsonb_build_object(
      'theme', 'emerald',
      'language', 'en',
      'data_saver', false,
      'notifications', true
    )
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies for users table
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins and managers can read all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins and managers can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update orders table to use uuid for user_id
ALTER TABLE orders ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Update orders RLS policies
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Admins and managers can manage all orders" ON orders;

CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and managers can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Update wishlists table to use uuid for user_id
ALTER TABLE wishlists ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Update wishlists RLS policies
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlists;

CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Update reviews table to use uuid for user_id
ALTER TABLE reviews ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Update reviews RLS policies
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Update user_sessions table to use uuid for user_id
ALTER TABLE user_sessions ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Update user_sessions RLS policies
DROP POLICY IF EXISTS "Users can read their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can read all sessions" ON user_sessions;

CREATE POLICY "Users can read their own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update coupons table foreign key
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_created_by_fkey;
ALTER TABLE coupons ALTER COLUMN created_by TYPE uuid USING created_by::uuid;
ALTER TABLE coupons ADD CONSTRAINT coupons_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES users(id);

-- Update app_settings table foreign key
ALTER TABLE app_settings DROP CONSTRAINT IF EXISTS app_settings_updated_by_fkey;
ALTER TABLE app_settings ALTER COLUMN updated_by TYPE uuid USING updated_by::uuid;
ALTER TABLE app_settings ADD CONSTRAINT app_settings_updated_by_fkey 
  FOREIGN KEY (updated_by) REFERENCES users(id);