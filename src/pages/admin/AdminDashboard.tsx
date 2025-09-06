import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye,
  Settings,
  BarChart3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/layout/Footer';
import { productService, orderService, userService } from '../../lib/supabase';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { language } = useAppStore();
  const t = useTranslation(language);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [products, orders, users] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
          userService.getAll()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const lowStockProducts = products.filter(p => p.stock <= 5);
        const recentOrders = orders.slice(0, 5);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          recentOrders,
          lowStockProducts
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'fr' ? 'Tableau de Bord Admin' : 'Admin Dashboard'}
              </h1>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? `Bienvenue, ${user?.first_name || 'Admin'}`
                  : `Welcome back, ${user?.first_name || 'Admin'}`
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/admin/products">
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Produits' : 'Products'}
                </Button>
              </Link>
              <Link to="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Nouveau Produit' : 'New Product'}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Total Produits' : 'Total Products'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Total Commandes' : 'Total Orders'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Total Utilisateurs' : 'Total Users'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Revenus Total' : 'Total Revenue'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'fr' ? 'Commandes Récentes' : 'Recent Orders'}
              </h3>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Voir Tout' : 'View All'}
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {language === 'fr' ? 'Aucune commande récente' : 'No recent orders'}
                </p>
              )}
            </div>
          </motion.div>

          {/* Low Stock Products */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'fr' ? 'Stock Faible' : 'Low Stock'}
              </h3>
              <Link to="/admin/products">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Gérer' : 'Manage'}
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {product.stock} {language === 'fr' ? 'restant' : 'left'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {language === 'fr' ? 'Tous les produits sont bien stockés' : 'All products are well stocked'}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'fr' ? 'Actions Rapides' : 'Quick Actions'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/products/new">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">
                    {language === 'fr' ? 'Ajouter Produit' : 'Add Product'}
                  </p>
                  <p className="text-sm text-emerald-700">
                    {language === 'fr' ? 'Nouveau produit' : 'Create new product'}
                  </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/admin/orders">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    {language === 'fr' ? 'Voir Commandes' : 'View Orders'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {language === 'fr' ? 'Gérer commandes' : 'Manage orders'}
                  </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/admin/users">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">
                    {language === 'fr' ? 'Utilisateurs' : 'Users'}
                  </p>
                  <p className="text-sm text-purple-700">
                    {language === 'fr' ? 'Gérer utilisateurs' : 'Manage users'}
                  </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/admin/analytics">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">
                    {language === 'fr' ? 'Analytiques' : 'Analytics'}
                  </p>
                  <p className="text-sm text-orange-700">
                    {language === 'fr' ? 'Voir rapports' : 'View reports'}
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer variant="admin" />
    </div>
  );
};