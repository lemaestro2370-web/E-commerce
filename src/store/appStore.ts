import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, CartItem, Product, Language } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      cart: [],
      dataSaver: false,
      theme: 'emerald', // Default theme

      setLanguage: (lang: Language) => 
        set({ language: lang }),

      setTheme: (theme: string) =>
        set({ theme }),

      addToCart: (product: Product, quantity = 1) => 
        set((state) => {
          const existingItem = state.cart.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            cart: [...state.cart, { product, quantity }]
          };
        }),

      removeFromCart: (productId: string) =>
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        })),

      updateCartQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          cart: quantity <= 0 
            ? state.cart.filter(item => item.product.id !== productId)
            : state.cart.map(item =>
                item.product.id === productId
                  ? { ...item, quantity }
                  : item
              )
        })),

      clearCart: () => set({ cart: [] }),

      toggleDataSaver: () => 
        set((state) => ({ dataSaver: !state.dataSaver })),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cameroon-ecommerce-storage',
      partialize: (state) => ({
        language: state.language,
        cart: state.cart,
        dataSaver: state.dataSaver,
        theme: state.theme
      })
    }
  )
);