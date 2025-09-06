import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Order } from '../types';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

// Demo order data (same as OrdersPage)
const demoOrders: Order[] = [
  {
    id: '1',
    user_id: 'user_demo',
    items: [
      {
        product_id: '1',
        product_name: 'Samsung Galaxy A54',
        product_name_fr: 'Samsung Galaxy A54',
        quantity: 1,
        price: 245000
      }
    ],
    total: 245000,
    status: 'delivered',
    payment_method: 'cod',
    shipping_address: {
      name: 'John Doe',
      phone: '+237 6XX XXX XXX',
      address: '123 Main Street, Bonanjo',
      city: 'Douala',
      region: 'Littoral'
    },
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-18T14:20:00Z'
  },
  {
    id: '2',
    user_id: 'user_demo',
    items: [
      {
        product_id: '2',
        product_name: 'Nike Air Max Sneakers',
        product_name_fr: 'Baskets Nike Air Max',
        quantity: 1,
        price: 85000
      },
      {
        product_id: '4',
        product_name: 'Wireless Headphones',
        product_name_fr: 'Écouteurs Sans Fil',
        quantity: 1,
        price: 45000
      }
    ],
    total: 130000,
    status: 'dispatched',
    payment_method: 'mobile_money',
    shipping_address: {
      name: 'John Doe',
      phone: '+237 6XX XXX XXX',
      address: '123 Main Street, Bonanjo',
      city: 'Douala',
      region: 'Littoral'
    },
    created_at: '2025-01-20T09:15:00Z',
    updated_at: '2025-01-21T16:45:00Z'
  }
];

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { language } = useAppStore();
  const t = useTranslation(language);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundOrder = demoOrders.find(o => o.id === id);
      setOrder(foundOrder || null);
      setLoading(false);
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Commande non trouvée' : 'Order not found'}
          </h2>
          <Link to="/orders">
            <Button>{language === 'fr' ? 'Retour aux commandes' : 'Back to Orders'}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {!user ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Connexion requise' : 'Login Required'}
            </h2>
            <Link to="/auth/login">
              <Button>{t('login')}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/orders"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{language === 'fr' ? 'Retour aux commandes' : 'Back to orders'}</span>
          </Link>

          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('orderNumber')}{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  {language === 'fr' ? 'Commandé le' : 'Ordered on'} {formatDate(order.created_at, language)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600 mb-1">
                  {formatPrice(order.total)}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                  <Package className="h-4 w-4 mr-2" />
                  {order.status === 'processing' && (language === 'fr' ? 'En cours' : 'Processing')}
                  {order.status === 'dispatched' && (language === 'fr' ? 'Expédiée' : 'Dispatched')}
                  {order.status === 'delivered' && (language === 'fr' ? 'Livrée' : 'Delivered')}
                  {order.status === 'cancelled' && (language === 'fr' ? 'Annulée' : 'Cancelled')}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Articles commandés' : 'Order Items'}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => {
                    const itemName = language === 'fr' 
                      ? item.product_name_fr || item.product_name 
                      : item.product_name;

                    return (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{itemName}</h4>
                          <p className="text-sm text-gray-600">
                            {language === 'fr' ? 'Quantité' : 'Quantity'}: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} {language === 'fr' ? 'chacun' : 'each'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Suivi de commande' : 'Order Tracking'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {language === 'fr' ? 'Commande reçue' : 'Order received'}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(order.created_at, language)}</p>
                    </div>
                  </div>
                  
                  {(order.status === 'dispatched' || order.status === 'delivered') && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {language === 'fr' ? 'Commande expédiée' : 'Order dispatched'}
                        </p>
                        <p className="text-sm text-gray-600">{formatDate(order.updated_at, language)}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {language === 'fr' ? 'Commande livrée' : 'Order delivered'}
                        </p>
                        <p className="text-sm text-gray-600">{formatDate(order.updated_at, language)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Info Sidebar */}
            <div className="space-y-6">
              {/* Payment Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'fr' ? 'Paiement' : 'Payment'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'fr' ? 'Méthode' : 'Method'}:
                    </span>
                    <span className="font-medium">
                      {order.payment_method === 'cod' 
                        ? (language === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery')
                        : 'Mobile Money'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('total')}:</span>
                    <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'fr' ? 'Livraison' : 'Shipping'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                  <p className="text-gray-600">{order.shipping_address.phone}</p>
                  <p className="text-gray-600">{order.shipping_address.address}</p>
                  <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.region}</p>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Besoin d\'aide ?' : 'Need Help?'}
                </h3>
                <div className="space-y-3">
                  <a href="tel:+2376XXXXXXX" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+237 6XX XXX XXX</span>
                  </a>
                  <a href="mailto:support@cameroonmart.cm" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">support@cameroonmart.cm</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};