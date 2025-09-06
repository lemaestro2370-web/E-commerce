import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced database functions with real-time capabilities
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*)
      `)
      .eq('id', id)
      .eq('active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('featured', true)
      .eq('active', true)
      .limit(8);
    
    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('active', true);
    
    if (error) throw error;
    return data || [];
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,name_fr.ilike.%${query}%,description_fr.ilike.%${query}%`);
    
    if (error) throw error;
    return data || [];
  },

  // Admin functions
  async create(productData: any) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, productData: any) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(categoryData: any) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, categoryData: any) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const orderService = {
  async create(orderData: any) {
    // Ensure user_id is properly set
    const finalOrderData = {
      ...orderData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert(finalOrderData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const userService = {
  async createOrUpdate(userData: any) {
    // First try to get existing user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single();
    
    // If user exists and is admin, preserve admin role
    if (existingUser && existingUser.role === 'admin') {
      userData.role = 'admin';
    }
    
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateRole(id: string, role: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const subscribeToProducts = (callback: (payload: any) => void) => {
  return supabase
    .channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .subscribe();
};

export const subscribeToOrders = (callback: (payload: any) => void) => {
  return supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe();
};

// Delivery fee calculation based on Cameroon regions
export const deliveryService = {
  calculateDeliveryFee(region: string, city: string, paymentMethod: string): number {
    const regionFees = {
      'centre': { base: 2500, cities: { 'yaounde': 1500 } },
      'littoral': { base: 2500, cities: { 'douala': 1500 } },
      'ouest': { base: 3500, cities: { 'bafoussam': 3000 } },
      'nord-ouest': { base: 4000, cities: { 'bamenda': 3500 } },
      'sud-ouest': { base: 4000, cities: { 'buea': 3500, 'limbe': 3500 } },
      'adamaoua': { base: 5000, cities: { 'ngaoundere': 4500 } },
      'est': { base: 5500, cities: { 'bertoua': 5000 } },
      'extreme-nord': { base: 6000, cities: { 'maroua': 5500 } },
      'nord': { base: 5500, cities: { 'garoua': 5000 } },
      'sud': { base: 4500, cities: { 'ebolowa': 4000 } }
    };

    const regionData = regionFees[region.toLowerCase()] || { base: 3000, cities: {} };
    const cityFee = regionData.cities[city.toLowerCase()] || regionData.base;
    
    // Add COD fee if cash on delivery
    const codFee = paymentMethod === 'cod' ? 500 : 0;
    
    return cityFee + codFee;
  },

  getEstimatedDeliveryTime(region: string): string {
    const deliveryTimes = {
      'centre': '1-2 days',
      'littoral': '1-2 days',
      'ouest': '2-3 days',
      'nord-ouest': '3-4 days',
      'sud-ouest': '3-4 days',
      'adamaoua': '4-5 days',
      'est': '4-6 days',
      'extreme-nord': '5-7 days',
      'nord': '4-6 days',
      'sud': '3-4 days'
    };
    
    return deliveryTimes[region.toLowerCase()] || '3-5 days';
  }
};