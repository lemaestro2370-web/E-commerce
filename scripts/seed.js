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
        active: true,
        active: true,
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
        active: true,
        active: true,
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
        active: true,
        active: true,
        sku: 'NESP-VN-BLK',
        weight: 4.2,
        dimensions: '37 × 14 × 32 cm',
        tags: ['coffee', 'nespresso', 'machine', 'premium']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        name: 'Samsung Galaxy S24 Ultra',
        name_fr: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android smartphone with S Pen, 200MP camera, and AI-powered features.',
        description_fr: 'Smartphone Android phare avec S Pen, caméra 200MP et fonctionnalités IA.',
        price: 750000,
        image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 20,
        featured: true,
        active: true,
        sku: 'SGS24U-512-BLK',
        weight: 0.232,
        dimensions: '162.3 × 79.0 × 8.6 mm',
        tags: ['smartphone', 'samsung', 'android', 's-pen', 'camera']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        name: 'MacBook Pro 14" M3',
        name_fr: 'MacBook Pro 14" M3',
        description: 'Professional laptop with M3 chip, Liquid Retina XDR display, and all-day battery life.',
        description_fr: 'Ordinateur portable professionnel avec puce M3, écran Liquid Retina XDR et autonomie toute la journée.',
        price: 1250000,
        image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 12,
        featured: true,
        active: true,
        sku: 'MBP14-M3-512-SG',
        weight: 1.6,
        dimensions: '31.26 × 22.12 × 1.55 cm',
        tags: ['laptop', 'apple', 'macbook', 'professional', 'm3']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        name: 'Adidas Ultraboost 22',
        name_fr: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with Boost midsole technology and Primeknit upper.',
        description_fr: 'Chaussures de course premium avec technologie Boost et tige Primeknit.',
        price: 95000,
        image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440002',
        stock: 30,
        featured: false,
        active: true,
        sku: 'UB22-BLK-42',
        weight: 0.32,
        dimensions: 'EU 42',
        tags: ['running', 'adidas', 'boost', 'primeknit']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440007',
        name: 'Sony WH-1000XM5',
        name_fr: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life.',
        description_fr: 'Casque sans fil à réduction de bruit leader avec 30 heures d\'autonomie.',
        price: 185000,
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 18,
        featured: false,
        active: true,
        sku: 'WH1000XM5-BLK',
        weight: 0.25,
        dimensions: '26.4 × 19.5 × 8.0 cm',
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440008',
        name: 'Dyson V15 Detect',
        name_fr: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser dust detection and intelligent suction.',
        description_fr: 'Aspirateur sans fil avec détection laser de poussière et aspiration intelligente.',
        price: 425000,
        image_url: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440003',
        stock: 8,
        featured: false,
        active: true,
        sku: 'DV15D-YEL',
        weight: 3.1,
        dimensions: '125.4 × 25.0 × 26.1 cm',
        tags: ['vacuum', 'dyson', 'cordless', 'laser-detect']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440009',
        name: 'Tesla Model Y Accessories Kit',
        name_fr: 'Kit d\'Accessoires Tesla Model Y',
        description: 'Complete accessories kit for Tesla Model Y including floor mats, organizers, and charging cables.',
        description_fr: 'Kit d\'accessoires complet pour Tesla Model Y incluant tapis, organisateurs et câbles de charge.',
        price: 85000,
        image_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440004',
        stock: 15,
        featured: false,
        active: true,
        sku: 'TSLA-MY-ACC-KIT',
        weight: 2.5,
        dimensions: '50 × 30 × 20 cm',
        tags: ['tesla', 'accessories', 'electric-car', 'model-y']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440010',
        name: 'Cameroon Coffee Premium Blend',
        name_fr: 'Mélange Premium Café du Cameroun',
        description: 'Premium Arabica coffee beans from the highlands of Cameroon, roasted to perfection.',
        description_fr: 'Grains de café Arabica premium des hauts plateaux du Cameroun, torréfiés à la perfection.',
        price: 15000,
        image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440005',
        stock: 50,
        featured: true,
        active: true,
        sku: 'CAM-COFFEE-PREM-1KG',
        weight: 1.0,
        dimensions: '20 × 15 × 8 cm',
        tags: ['coffee', 'cameroon', 'arabica', 'premium', 'local']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        name: 'Samsung Galaxy S24 Ultra',
        name_fr: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android smartphone with S Pen, 200MP camera, and AI-powered features.',
        description_fr: 'Smartphone Android phare avec S Pen, caméra 200MP et fonctionnalités IA.',
        price: 750000,
        image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 20,
        featured: true,
        active: true,
        sku: 'SGS24U-512-BLK',
        weight: 0.232,
        dimensions: '162.3 × 79.0 × 8.6 mm',
        tags: ['smartphone', 'samsung', 'android', 's-pen', 'camera']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        name: 'MacBook Pro 14" M3',
        name_fr: 'MacBook Pro 14" M3',
        description: 'Professional laptop with M3 chip, Liquid Retina XDR display, and all-day battery life.',
        description_fr: 'Ordinateur portable professionnel avec puce M3, écran Liquid Retina XDR et autonomie toute la journée.',
        price: 1250000,
        image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 12,
        featured: true,
        active: true,
        sku: 'MBP14-M3-512-SG',
        weight: 1.6,
        dimensions: '31.26 × 22.12 × 1.55 cm',
        tags: ['laptop', 'apple', 'macbook', 'professional', 'm3']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        name: 'Adidas Ultraboost 22',
        name_fr: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with Boost midsole technology and Primeknit upper.',
        description_fr: 'Chaussures de course premium avec technologie Boost et tige Primeknit.',
        price: 95000,
        image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440002',
        stock: 30,
        featured: false,
        active: true,
        sku: 'UB22-BLK-42',
        weight: 0.32,
        dimensions: 'EU 42',
        tags: ['running', 'adidas', 'boost', 'primeknit']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440007',
        name: 'Sony WH-1000XM5',
        name_fr: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life.',
        description_fr: 'Casque sans fil à réduction de bruit leader avec 30 heures d\'autonomie.',
        price: 185000,
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        stock: 18,
        featured: false,
        active: true,
        sku: 'WH1000XM5-BLK',
        weight: 0.25,
        dimensions: '26.4 × 19.5 × 8.0 cm',
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440008',
        name: 'Dyson V15 Detect',
        name_fr: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser dust detection and intelligent suction.',
        description_fr: 'Aspirateur sans fil avec détection laser de poussière et aspiration intelligente.',
        price: 425000,
        image_url: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440003',
        stock: 8,
        featured: false,
        active: true,
        sku: 'DV15D-YEL',
        weight: 3.1,
        dimensions: '125.4 × 25.0 × 26.1 cm',
        tags: ['vacuum', 'dyson', 'cordless', 'laser-detect']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440009',
        name: 'Tesla Model Y Accessories Kit',
        name_fr: 'Kit d\'Accessoires Tesla Model Y',
        description: 'Complete accessories kit for Tesla Model Y including floor mats, organizers, and charging cables.',
        description_fr: 'Kit d\'accessoires complet pour Tesla Model Y incluant tapis, organisateurs et câbles de charge.',
        price: 85000,
        image_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440004',
        stock: 15,
        featured: false,
        active: true,
        sku: 'TSLA-MY-ACC-KIT',
        weight: 2.5,
        dimensions: '50 × 30 × 20 cm',
        tags: ['tesla', 'accessories', 'electric-car', 'model-y']
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440010',
        name: 'Cameroon Coffee Premium Blend',
        name_fr: 'Mélange Premium Café du Cameroun',
        description: 'Premium Arabica coffee beans from the highlands of Cameroon, roasted to perfection.',
        description_fr: 'Grains de café Arabica premium des hauts plateaux du Cameroun, torréfiés à la perfection.',
        price: 15000,
        image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800',
        category_id: '550e8400-e29b-41d4-a716-446655440005',
        stock: 50,
        featured: true,
        active: true,
        sku: 'CAM-COFFEE-PREM-1KG',
        weight: 1.0,
        dimensions: '20 × 15 × 8 cm',
        tags: ['coffee', 'cameroon', 'arabica', 'premium', 'local']
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
      { product_id: '660e8400-e29b-41d4-a716-446655440003', image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 2 },
      
      // Samsung Galaxy images
      { product_id: '660e8400-e29b-41d4-a716-446655440004', image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440004', image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // MacBook images
      { product_id: '660e8400-e29b-41d4-a716-446655440005', image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440005', image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Adidas images
      { product_id: '660e8400-e29b-41d4-a716-446655440006', image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440006', image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Sony headphones images
      { product_id: '660e8400-e29b-41d4-a716-446655440007', image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440007', image_url: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Dyson images
      { product_id: '660e8400-e29b-41d4-a716-446655440008', image_url: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      
      // Tesla accessories images
      { product_id: '660e8400-e29b-41d4-a716-446655440009', image_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      
      // Coffee images
      { product_id: '660e8400-e29b-41d4-a716-446655440010', image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440010', image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 }
      
      // Samsung Galaxy images
      { product_id: '660e8400-e29b-41d4-a716-446655440004', image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440004', image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // MacBook images
      { product_id: '660e8400-e29b-41d4-a716-446655440005', image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440005', image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Adidas images
      { product_id: '660e8400-e29b-41d4-a716-446655440006', image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440006', image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Sony headphones images
      { product_id: '660e8400-e29b-41d4-a716-446655440007', image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440007', image_url: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 },
      
      // Dyson images
      { product_id: '660e8400-e29b-41d4-a716-446655440008', image_url: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      
      // Tesla accessories images
      { product_id: '660e8400-e29b-41d4-a716-446655440009', image_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      
      // Coffee images
      { product_id: '660e8400-e29b-41d4-a716-446655440010', image_url: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 0 },
      { product_id: '660e8400-e29b-41d4-a716-446655440010', image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', sort_order: 1 }
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