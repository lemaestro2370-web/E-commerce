import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  Clock, 
  TrendingUp, 
  Star,
  Eye,
  Plus,
  ArrowRight,
  Gift,
  Award,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/ui/ProductCard';
import { productService, orderService } from '../lib/supabase';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { language } = useAppStore();
  const t = useTranslation(language);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    recentOrders: [],
    recommendedProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const [orders, products] = await Promise.all([
          orderService.getByUserId(user.id),
          productService.getFeatured()
        ]);

        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        
        setStats({
          totalOrders: orders.length,
          totalSpent,
          wishlistItems: 0, // This would come from wishlist service
          recentOrders: orders.slice(0, 3),
          recommendedProducts: products.slice(0, 4)
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {language === 'fr' 
                    ? `Bienvenue, ${user?.first_name || 'Cher Client'}!`
                    : `Welcome back, ${user?.first_name || 'Dear Customer'}!`
                  }
                </h1>
                <p className="text-emerald-100">
                  {language === 'fr' 
                    ? 'Découvrez vos dernières activités et recommandations personnalisées'
                    : 'Discover your latest activities and personalized recommendations'
                  }
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Total Commandes' : 'Total Orders'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
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
                  {language === 'fr' ? 'Total Dépensé' : 'Total Spent'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
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
                  {language === 'fr' ? 'Liste de Souhaits' : 'Wishlist Items'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'fr' ? 'Commandes Récentes' : 'Recent Orders'}
                </h3>
                <Link to="/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Voir Tout' : 'View All'}
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {language === 'fr' ? 'Aucune commande récente' : 'No recent orders'}
                    </p>
                    <Link to="/catalog" className="mt-4 inline-block">
                      <Button size="sm">
                        {language === 'fr' ? 'Commencer les Achats' : 'Start Shopping'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recommended Products */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'fr' ? 'Recommandé pour Vous' : 'Recommended for You'}
                </h3>
                <Link to="/catalog">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Voir Plus' : 'See More'}
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'fr' ? 'Actions Rapides' : 'Quick Actions'}
              </h3>
              
              <div className="space-y-3">
                <Link to="/catalog">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <Package className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900">
                        {language === 'fr' ? 'Parcourir Produits' : 'Browse Products'}
                      </p>
                      <p className="text-sm text-emerald-700">
                        {language === 'fr' ? 'Découvrir nouveautés' : 'Discover new items'}
                      </p>
                    </div>
                  </motion.div>
                </Link>

                <Link to="/orders">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {language === 'fr' ? 'Suivre Commandes' : 'Track Orders'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {language === 'fr' ? 'Voir statut livraison' : 'Check delivery status'}
                      </p>
                    </div>
                  </motion.div>
                </Link>

                <Link to="/profile">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <Target className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">
                        {language === 'fr' ? 'Mon Profil' : 'My Profile'}
                      </p>
                      <p className="text-sm text-purple-700">
                        {language === 'fr' ? 'Gérer préférences' : 'Manage preferences'}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">
                  {language === 'fr' ? 'Réalisations' : 'Achievements'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-yellow-900">
                      {language === 'fr' ? 'Premier Achat' : 'First Purchase'}
                    </span>
                  </div>
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    {stats.totalOrders > 0 ? '✓' : '○'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-yellow-900">
                      {language === 'fr' ? 'Client Fidèle' : 'Loyal Customer'}
                    </span>
                  </div>
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    {stats.totalOrders >= 5 ? '✓' : `${stats.totalOrders}/5`}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};