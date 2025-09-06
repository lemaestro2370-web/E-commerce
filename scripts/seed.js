import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const loadEnv = () => {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Could not load .env file. Please run npm run setup first.');
    process.exit(1);
  }
};

const seed = async () => {
  console.log('🌱 Seeding CameroonMart production database...\n');

  const env = loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration in .env file');
    console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const { error: adminError } = await supabase
      .from('users')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@cameroonmart.cm',
        role: 'admin',
        first_name: 'Admin',
        last_name: 'CameroonMart',
        preferences: {
          language: 'en',
          theme: 'emerald',
          notifications: true,
          data_saver: false
        }
      });

    if (adminError) console.log('Admin user already exists or error:', adminError.message);
    else console.log('✅ Admin user created');

    // Create demo user
    console.log('👤 Creating demo user...');
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440099',
        email: 'user@example.com',
        role: 'user',
        first_name: 'Demo',
        last_name: 'User',
        preferences: {
          language: 'en',
          theme: 'emerald',
          notifications: true,
          data_saver: false
        }
      });

    if (userError) console.log('Demo user already exists or error:', userError.message);
    else console.log('✅ Demo user created');
    // Categories
    console.log('📂 Creating categories...');
    const categories = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Electronics',
        name_fr: 'Électronique',
        slug: 'electronics',
        icon: 'smartphone',
        description: 'Latest gadgets and electronic devices',
        description_fr: 'Derniers gadgets et appareils électroniques'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Fashion',
        name_fr: 'Mode',
        slug: 'fashion',
        icon: 'shirt',
        description: 'Trendy clothing and accessories',
        description_fr: 'Vêtements et accessoires tendance'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Home & Garden',
        name_fr: 'Maison & Jardin',
        slug: 'home',
        icon: 'home',
        description: 'Everything for your home and garden',
        description_fr: 'Tout pour votre maison et jardin'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Automotive',
        name_fr: 'Automobile',
        slug: 'automotive',
        icon: 'car',
        description: 'Car parts and automotive accessories',
        description_fr: 'Pièces auto et accessoires automobiles'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Food & Drinks',
        name_fr: 'Alimentation',
        slug: 'food',
        icon: 'coffee',
        description: 'Fresh food and beverages',
        description_fr: 'Aliments frais et boissons'
      }
    ];

    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories);

    if (categoriesError) throw categoriesError;
    console.log('✅ Categories created');

    // Products with multiple images
    console.log('📦 Creating products...');
    const products = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        name: 'iPhone 15 Pro Max',
        name_fr: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.',
        description_fr: 'Dernier iPhone avec design en titane, puce A17 Pro et système de caméra avancé avec zoom téléphoto 5x.',
        price: 850000,
        image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 25,
        featured: true,
        sku: 'IPH15PM-256-TIT',
        weight: 0.221,
        dimensions: '159.9 × 76.7 × 8.25 mm',
        tags: ['smartphone', 'apple', 'premium', 'camera']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        name: 'Nike Air Jordan 1 Retro',
        name_fr: 'Nike Air Jordan 1 Retro',
        description: 'Iconic basketball sneakers with premium leather construction and classic colorway.',
        description_fr: 'Baskets de basketball iconiques avec construction en cuir premium et coloris classique.',
        price: 125000,
        image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440002',
        stock: 15,
        featured: true,
        sku: 'AJ1-RET-BRW-42',
        weight: 0.6,
        dimensions: 'EU 42',
        tags: ['sneakers', 'nike', 'basketball', 'retro']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'Nespresso Vertuo Next',
        name_fr: 'Nespresso Vertuo Next',
        description: 'Premium coffee machine with centrifusion technology for perfect coffee extraction.',
        description_fr: 'Machine à café premium avec technologie centrifusion pour une extraction parfaite.',
        price: 185000,
        image_url: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440003',
        stock: 8,
        featured: true,
        sku: 'NESP-VN-BLK',
        weight: 4.2,
        dimensions: '37 × 14 × 32 cm',
        tags: ['coffee', 'nespresso', 'machine', 'premium']
      }
    ];

    const { error: productsError } = await supabase
      .from('products')
      .upsert(products);

    if (productsError) throw productsError;
    console.log('✅ Products created');

    // Product images for gallery
    console.log('🖼️ Adding product images...');
    const productImages = [
      // iPhone images
      { product_id: '660e8400-e29b-41d4-a716-446655440001', image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440001', image_url: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      { product_id: '660e8400-e29b-41d4-a716-446655440001', image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 2 },
      
      // Nike images
      { product_id: '660e8400-e29b-41d4-a716-446655440002', image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440002', image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      { product_id: '660e8400-e29b-41d4-a716-446655440002', image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 2 },
      
      // Coffee machine images
      { product_id: '660e8400-e29b-41d4-a716-446655440003', image_url: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440003', image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      { product_id: '660e8400-e29b-41d4-a716-446655440003', image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 2 }
    ];

    const { error: imagesError } = await supabase
      .from('product_images')
      .upsert(productImages);

    if (imagesError) throw imagesError;
    console.log('✅ Product images added');

    console.log('\n🎉 Production database seeded successfully!');
    console.log('\n📋 Admin Login Information:');
    console.log('   Email: admin@cameroonmart.cm');
    console.log('   Role: Admin (full access)');
    console.log('\n🛑 STOP & CHECK: Seed complete - you should see success messages above');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your Supabase connection');
    console.log('   2. Verify your .env keys are correct');
    console.log('   3. Ensure database tables exist');
    process.exit(1);
  }
};

seed().catch(console.error);