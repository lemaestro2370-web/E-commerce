import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const setup = async () => {
  console.log('🚀 Setting up CameroonMart E-Commerce App...\n');

  // Check if .env exists
  const envPath = '.env';
  const envExamplePath = '.env.example';
  
  try {
    readFileSync(envPath, 'utf8');
    console.log('✅ .env file already exists');
  } catch (error) {
    try {
      const envExample = readFileSync(envExamplePath, 'utf8');
      writeFileSync(envPath, envExample);
      console.log('📋 Created .env file from .env.example');
      console.log('\n⚠️  IMPORTANT: Please update .env with your actual keys:');
      console.log('   1. Get Clerk keys from: https://dashboard.clerk.com/');
      console.log('   2. Get Supabase keys from: https://supabase.com/dashboard/\n');
    } catch (err) {
      console.log('❌ Could not create .env file');
    }
  }

  console.log('✅ Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Update .env with your API keys');
  console.log('   2. Run: npm run seed (to populate demo data)');
  console.log('   3. Run: npm run dev (to start the app)');
  console.log('\n🛑 STOP & CHECK #1: Setup should be complete with no errors');
};

setup().catch(console.error);