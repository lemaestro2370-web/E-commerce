import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice, getImageUrl } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

export const CartPage: React.FC = () => {
  const { 
    language, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    dataSaver 
  } = useAppStore();
  const t = useTranslation(language);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cartEmpty')}</h2>
            <p className="text-gray-600 mb-8">
              {language === 'fr' 
                ? "Découvrez nos produits incroyables et commencez vos achats"
                : "Discover our amazing products and start shopping"
              }
            </p>
            <Link to="/catalog">
              <Button size="lg">
                {t('continueShopping')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('cart')}</h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? `${cart.length} article${cart.length > 1 ? 's' : ''} dans votre panier`
              : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const productName = language === 'fr' 
                ? item.product.name_fr || item.product.name 
                : item.product.name;

              return (
                <div key={item.product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.product.image_url, dataSaver)}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {productName}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatPrice(item.product.price)} {language === 'fr' ? 'chacun' : 'each'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {t('total')}: <span className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'fr' ? 'Résumé de la commande' : 'Order Summary'}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === 'fr' ? 'Sous-total' : 'Subtotal'}
                  </span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === 'fr' ? 'Livraison' : 'Shipping'}
                  </span>
                  <span className="font-medium text-emerald-600">
                    {language === 'fr' ? 'Gratuite' : 'Free'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    {t('checkout')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/catalog" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    {t('continueShopping')}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>{language === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>{language === 'fr' ? 'Livraison rapide' : 'Fast delivery'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>{language === 'fr' ? 'Garantie qualité' : 'Quality guarantee'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};