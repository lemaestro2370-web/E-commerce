export interface Product {
  id: string;
  name: string;
  name_fr: string;
  description: string;
  description_fr: string;
  price: number;
  image_url: string;
  category_id: string;
  stock: number;
  featured: boolean;
  active: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface Category {
  id: string;
  name: string;
  name_fr: string;
  slug: string;
  icon: string;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'mobile_money';
  shipping_address: ShippingAddress;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_name_fr: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postal_code?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferences?: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  language: 'en' | 'fr';
  theme: string;
  notifications: boolean;
  data_saver: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
}

export type Language = 'en' | 'fr';

export interface AppState {
  language: Language;
  cart: CartItem[];
  dataSaver: boolean;
  theme: string;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDataSaver: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}