/*
  # Production E-Commerce Schema for CameroonMart

  1. New Tables
    - `categories` - Product categories with multilingual support
    - `products` - Products with advanced features (SKU, weight, dimensions, tags)
    - `product_images` - Multiple images per product for gallery view
    - `orders` - Customer orders with tracking and notes
    - `users` - User management with roles (admin, manager, user)
    - `wishlists` - User wishlist functionality
    - `reviews` - Product reviews and ratings
    - `coupons` - Discount codes and promotions
    - `app_settings` - Global app configuration
    - `user_sessions` - Track user activity for analytics

  2. Security
    - Enable RLS on all tables
    - Role-based access control (admin, manager, user)
    - Users can only access their own data
    - Admins and managers have elevated permissions

  3. Features
    - Real-time inventory tracking
    - Advanced search with full-text search
    - Multi-image product galleries
    - Wishlist and favorites
    - Review system with verified purchases
    - Coupon and discount system
    - User activity tracking
    - App theme customization
*/

-- Create users table first (needed for foreign keys)
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  first_name text,
  last_name text,
  phone text,
  preferences jsonb DEFAULT '{"language": "en", "theme": "emerald", "notifications": true, "data_saver": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_fr text,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT 'package',
  description text,
  description_fr text,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  active boolean DEFAULT true,
  sku text UNIQUE,
  weight numeric,
  dimensions text,
  tags text[],
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table for gallery
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
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
  tracking_number text,
  notes text,
  coupon_code text,
  discount_amount integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  min_order_amount integer DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_by text REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create app_settings table for global configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by text REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Create user_sessions for analytics
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  session_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins and managers can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role IN ('admin', 'manager')
    )
  );

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

-- Categories policies
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins and managers can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Products policies
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins and managers can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Product images policies
CREATE POLICY "Product images are publicly readable"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins and managers can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Orders policies
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins and managers can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Wishlists policies
CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Reviews policies
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Coupons policies
CREATE POLICY "Active coupons are publicly readable"
  ON coupons FOR SELECT
  TO public
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- App settings policies
CREATE POLICY "App settings are publicly readable"
  ON app_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage app settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- User sessions policies
CREATE POLICY "Users can read their own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Admins can read all sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.jwt() ->> 'sub' 
      AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Create functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';


-- Insert default admin user and app settings
INSERT INTO users (id, email, role, first_name, last_name) 
VALUES ('admin_cameroonmart_2025', 'admin@cameroonmart.cm', 'admin', 'Admin', 'CameroonMart')
ON CONFLICT (id) DO NOTHING;

-- Insert default app settings
INSERT INTO app_settings (key, value, description) VALUES
('app_name', '"CameroonMart"', 'Application name'),
('app_description', '"Your trusted marketplace in Cameroon"', 'Application description'),
('default_theme', '"emerald"', 'Default theme color'),
('available_themes', '["emerald", "blue", "purple", "orange", "red", "pink"]', 'Available theme colors'),
('currency', '"XAF"', 'Default currency'),
('shipping_fee', '2500', 'Default shipping fee in XAF'),
('free_shipping_threshold', '50000', 'Minimum order for free shipping'),
('tax_rate', '0.1925', 'Default tax rate (19.25% VAT)'),
('contact_email', '"support@cameroonmart.cm"', 'Support email'),
('contact_phone', '"+237 6XX XXX XXX"', 'Support phone'),
('social_facebook', '"https://facebook.com/cameroonmart"', 'Facebook page URL'),
('social_instagram', '"https://instagram.com/cameroonmart"', 'Instagram page URL'),
('social_twitter', '"https://twitter.com/cameroonmart"', 'Twitter page URL')
ON CONFLICT (key) DO NOTHING;