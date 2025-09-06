import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, ShoppingBag, Filter, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Order } from '../types';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { orderService } from '../lib/supabase';

const OrderStatusIcon: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const iconClass = "h-5 w-5";
  
  switch (status) {
    case 'processing':
      return <Clock className={`${iconClass} text-yellow-500`} />;
    case 'dispatched':
      return <Truck className={`${iconClass} text-blue-500`} />;
    case 'delivered':
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case 'cancelled':
      return <XCircle className={`${iconClass} text-red-500`} />;
    default:
      return <Package className={`${iconClass} text-gray-500`} />;
  }
};

const OrderStatusBadge: React.FC<{ status: Order['status'], language: 'en' | 'fr' }> = ({ status, language }) => {
  const statusText = {
    processing: language === 'fr' ? 'En cours' : 'Processing',
    dispatched: language === 'fr' ? 'Expédiée' : 'Dispatched',
    delivered: language === 'fr' ? 'Livrée' : 'Delivered',
    cancelled: language === 'fr' ? 'Annulée' : 'Cancelled'
  };

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dispatched: 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}>
      <OrderStatusIcon status={status} />
      <span className="ml-2">{statusText[status]}</span>
    </span>
  );
};

export const OrdersPage: React.FC = () => {
  const { language } = useAppStore();
  const t = useTranslation(language);
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const ordersData = await orderService.getByUserId(user.id);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || new Date(order.created_at) >= new Date(dateFilter);
    return matchesStatus && matchesDate;
  });

  const LoginPrompt = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center px-4"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <Package className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {language === 'fr' ? 'Connexion requise' : 'Login Required'}
        </h2>
        <p className="text-gray-600 mb-8">
          {language === 'fr' 
            ? 'Connectez-vous pour voir vos commandes et suivre vos livraisons'
            : 'Sign in to view your orders and track your deliveries'
          }
        </p>
        <Link to="/auth/login">
          <Button size="lg">
            {t('login')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );

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
      {!user ? (
        <LoginPrompt />
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('orderHistory')}</h1>
                <p className="text-gray-600">
                  {language === 'fr' 
                    ? `Gérez et suivez toutes vos commandes (${filteredOrders.length} commandes)`
                    : `Manage and track all your orders (${filteredOrders.length} orders)`
                  }
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="bg-white rounded-lg px-3 py-2 border">
                  <span className="text-gray-600">{language === 'fr' ? 'Total dépensé:' : 'Total spent:'}</span>
                  <span className="font-bold text-emerald-600 ml-1">
                    {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Advanced Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'fr' ? 'Filtrer par:' : 'Filter by:'}
                </span>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">{language === 'fr' ? 'Tous les statuts' : 'All statuses'}</option>
                <option value="processing">{language === 'fr' ? 'En cours' : 'Processing'}</option>
                <option value="dispatched">{language === 'fr' ? 'Expédiée' : 'Dispatched'}</option>
                <option value="delivered">{language === 'fr' ? 'Livrée' : 'Delivered'}</option>
                <option value="cancelled">{language === 'fr' ? 'Annulée' : 'Cancelled'}</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </motion.div>

          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucune commande' : 'No orders yet'}
              </h3>
              <p className="text-gray-600 mb-8">
                {language === 'fr' 
                  ? 'Commencez vos achats pour voir vos commandes ici'
                  : 'Start shopping to see your orders here'
                }
              </p>
              <Link to="/catalog">
                <Button size="lg">
                  {language === 'fr' ? 'Commencer les achats' : 'Start Shopping'}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t('orderNumber')}{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.created_at, language)}</span>
                          </div>
                        </div>
                        <OrderStatusBadge status={order.status} language={language} />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            {formatPrice(order.total)}
                          </p>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <CreditCard className="h-4 w-4" />
                            <span>
                              {order.payment_method === 'cod' 
                                ? (language === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery')
                                : 'Mobile Money'
                              }
                            </span>
                          </div>
                        </div>
                        <Link to={`/orders/${order.id}`}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              {language === 'fr' ? 'Détails' : 'Details'}
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item, itemIndex) => {
                        const itemName = language === 'fr' 
                          ? item.product_name_fr || item.product_name 
                          : item.product_name;

                        return (
                          <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              {item.image_url && (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image_url}
                                    alt={itemName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{itemName}</p>
                                <p className="text-xs text-gray-600">
                                  {language === 'fr' ? 'Qté' : 'Qty'}: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                      
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          {language === 'fr' 
                            ? `+${order.items.length - 2} autres articles`
                            : `+${order.items.length - 2} more items`
                          }
                        </p>
                      )}
                    </div>

                    {/* Delivery Address Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">
                        {language === 'fr' ? 'Livraison à:' : 'Delivering to:'}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{order.shipping_address.name}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.region}</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={`/orders/${order.id}`} className="flex-1">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="w-full">
                            {language === 'fr' ? 'Voir les détails complets' : 'View full details'}
                          </Button>
                        </motion.div>
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="flex-1">
                            {language === 'fr' ? 'Recommander' : 'Reorder'}
                          </Button>
                        </motion.div>
                      )}
                      
                      {order.status === 'processing' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};