import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Shirt, Home as HomeIcon, Car, Coffee, Gamepad2, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, Category } from '../types';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { ProductCard } from '../components/ui/ProductCard';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { productService, categoryService } from '../lib/supabase';
import { getImageUrl } from '../lib/utils';

export const HomePage: React.FC = () => {
  const { language, theme } = useAppStore();
  const t = useTranslation(language);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll()
        ]);
        
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
        setStats({
          products: productsData.length,
          orders: 1250, // This would come from analytics
          users: 5600   // This would come from analytics
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryIcons = {
    electronics: Smartphone,
    fashion: Shirt,
    home: HomeIcon,
    automotive: Car,
    food: Coffee,
    entertainment: Gamepad2
  };

  const themeColors = {
    emerald: 'from-emerald-600 via-emerald-700 to-emerald-800',
    blue: 'from-blue-600 via-blue-700 to-blue-800',
    purple: 'from-purple-600 via-purple-700 to-purple-800',
    orange: 'from-orange-600 via-orange-700 to-orange-800',
    red: 'from-red-600 via-red-700 to-red-800',
    pink: 'from-pink-600 via-pink-700 to-pink-800'
  };

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
      {/* Hero Section with Dynamic Theme */}
      <section className={`relative bg-gradient-to-br ${themeColors[theme as keyof typeof themeColors] || themeColors.emerald} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 100, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            
            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center space-x-8 mb-8 text-white/80"
            >
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span className="text-sm">{stats.products}+ {language === 'fr' ? 'Produits' : 'Products'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">{stats.orders}+ {language === 'fr' ? 'Commandes' : 'Orders'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">{stats.users}+ {language === 'fr' ? 'Clients' : 'Customers'}</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/catalog">
                <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-50 shadow-xl">
                  {t('shopNow')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 shadow-xl"
              >
                {language === 'fr' ? 'En Savoir Plus' : 'Learn More'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Innovation Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Pourquoi Choisir CameroonMart ?' : 'Why Choose CameroonMart?'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Découvrez nos fonctionnalités innovantes qui rendent vos achats plus intelligents"
                : "Discover our innovative features that make your shopping smarter"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Innovation 1: AI-Powered Recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'IA Recommandations' : 'AI Recommendations'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Notre IA apprend vos préférences pour vous suggérer les meilleurs produits'
                  : 'Our AI learns your preferences to suggest the best products for you'
                }
              </p>
            </motion.div>

            {/* Innovation 2: Social Shopping */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Achats Sociaux' : 'Social Shopping'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Partagez vos achats, créez des listes de groupe et achetez ensemble'
                  : 'Share your purchases, create group lists, and shop together'
                }
              </p>
            </motion.div>

            {/* Innovation 3: AR Try-On */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Essayage AR' : 'AR Try-On'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Essayez virtuellement les produits avant d\'acheter avec la réalité augmentée'
                  : 'Virtually try products before buying with augmented reality'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI-Powered Recommendations Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Recommandations Intelligentes' : 'Smart Recommendations'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Notre IA apprend de vos préférences pour vous suggérer les produits parfaits"
                : "Our AI learns from your preferences to suggest perfect products for you"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'fr' ? 'Apprentissage Adaptatif' : 'Adaptive Learning'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'fr' 
                  ? 'Plus vous utilisez l\'app, plus nos recommandations deviennent précises'
                  : 'The more you use the app, the more accurate our recommendations become'
                }
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'fr' ? 'Tendances Sociales' : 'Social Trends'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'fr' 
                  ? 'Découvrez ce que vos amis et votre communauté achètent'
                  : 'Discover what your friends and community are buying'
                }
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'fr' ? 'Prédictions Précises' : 'Accurate Predictions'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'fr' 
                  ? 'Anticipez vos besoins avant même que vous les réalisiez'
                  : 'Anticipate your needs before you even realize them'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Gagnez en Achetant' : 'Earn While You Shop'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Collectez des points, débloquez des badges et obtenez des récompenses exclusives"
                : "Collect points, unlock badges, and get exclusive rewards"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: language === 'fr' ? 'Champion' : 'Champion', desc: language === 'fr' ? '10+ commandes' : '10+ orders' },
              { icon: '⭐', title: language === 'fr' ? 'VIP' : 'VIP', desc: language === 'fr' ? '50+ commandes' : '50+ orders' },
              { icon: '💎', title: language === 'fr' ? 'Diamant' : 'Diamond', desc: language === 'fr' ? '100+ commandes' : '100+ orders' },
              { icon: '👑', title: language === 'fr' ? 'Légende' : 'Legend', desc: language === 'fr' ? '500+ commandes' : '500+ orders' }
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200"
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('categories')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Explorez nos catégories soigneusement sélectionnées pour tous vos besoins"
                : "Explore our carefully curated categories for all your needs"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || HomeIcon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/catalog?category=${category.id}`} className="group">
                    <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200 group-hover:border-emerald-300">
                      <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {language === 'fr' ? category.name_fr || category.name : category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('featured')}</h2>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? "Nos meilleures offres sélectionnées spécialement pour vous"
                  : "Our best deals handpicked just for you"
                }
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/catalog">
                <Button variant="outline">
                  {language === 'fr' ? 'Voir Tout' : 'View All'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {language === 'fr' 
                  ? 'Aucun produit vedette pour le moment'
                  : 'No featured products at the moment'
                }
              </p>
              <Link to="/catalog">
                <Button>{language === 'fr' ? 'Voir tous les produits' : 'View all products'}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Rejoignez Notre Communauté' : 'Join Our Community'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Des milliers de Camerounais nous font confiance pour leurs achats en ligne"
                : "Thousands of Cameroonians trust us for their online shopping"
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.users.toLocaleString()}+</div>
              <p className="text-gray-600">{language === 'fr' ? 'Clients Satisfaits' : 'Happy Customers'}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.orders.toLocaleString()}+</div>
              <p className="text-gray-600">{language === 'fr' ? 'Commandes Livrées' : 'Orders Delivered'}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 bg-white rounded-xl shadow-sm"
            >
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.9★</div>
              <p className="text-gray-600">{language === 'fr' ? 'Note Moyenne' : 'Average Rating'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {language === 'fr' 
                ? "Prêt à Commencer vos Achats ?"
                : "Ready to Start Shopping?"
              }
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              {language === 'fr' 
                ? "Rejoignez des milliers de clients satisfaits à travers le Cameroun"
                : "Join thousands of satisfied customers across Cameroon"
              }
            </p>
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 shadow-xl">
                {t('shopNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer variant="home" />
    </div>
  );
};