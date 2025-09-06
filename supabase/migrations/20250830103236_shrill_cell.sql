/*
  # CameroonMart E-Commerce Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name in English)
      - `name_fr` (text, category name in French)
      - `slug` (text, URL-friendly category identifier)
      - `icon` (text, icon identifier)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name in English)
      - `name_fr` (text, product name in French)
      - `description` (text, product description in English)
      - `description_fr` (text, product description in French)
      - `price` (integer, price in XAF cents)
      - `image_url` (text, product image URL)
      - `category_id` (uuid, foreign key to categories)
      - `stock` (integer, available quantity)
      - `featured` (boolean, whether product is featured)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (text, Clerk user ID)
      - `items` (jsonb, order items array)
      - `total` (integer, total amount in XAF cents)
      - `status` (text, order status)
      - `payment_method` (text, payment method used)
      - `shipping_address` (jsonb, delivery address)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `users`
      - `id` (text, Clerk user ID, primary key)
      - `email` (text, user email)
      - `role` (text, user role - admin or user)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own orders
    - Admin users can access all data
    - Products and categories are publicly readable
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_fr text,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT 'package',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_fr text,
  description text NOT NULL,
  description_fr text,
  price integer NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  items jsonb NOT NULL,
  total integer NOT NULL CHECK (total > 0),
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'dispatched', 'delivered', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('cod', 'mobile_money')),
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table for role management
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Categories policies (publicly readable)
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- Products policies (publicly readable)
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();