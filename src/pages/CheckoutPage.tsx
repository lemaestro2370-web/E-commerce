import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Phone, Calculator, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice, getImageUrl } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { orderService, deliveryService } from '../lib/supabase';
import toast from 'react-hot-toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language, cart, getCartTotal, clearCart, dataSaver } = useAppStore();
  const t = useTranslation(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    paymentMethod: 'cod'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Calculate delivery fee when region, city, or payment method changes
    if (['region', 'city', 'paymentMethod'].includes(e.target.name)) {
      if (newFormData.region && newFormData.city) {
        const fee = deliveryService.calculateDeliveryFee(
          newFormData.region, 
          newFormData.city, 
          newFormData.paymentMethod
        );
        setDeliveryFee(fee);
        setEstimatedDelivery(deliveryService.getEstimatedDeliveryTime(newFormData.region));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === 'fr' ? 'Veuillez vous connecter' : 'Please login first');
      navigate('/auth/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        user_id: user.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_name_fr: item.product.name_fr || item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image_url: item.product.image_url
        })),
        total: getCartTotal() + deliveryFee,
        status: 'processing',
        payment_method: formData.paymentMethod,
        shipping_address: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          region: formData.region
        },
        delivery_fee: deliveryFee,
        estimated_delivery: estimatedDelivery
      };
      
      await orderService.create(orderData);
      
      clearCart();
      toast.success(
        language === 'fr' 
          ? 'Commande passée avec succès!'
          : 'Order placed successfully!'
      );
      
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de la création de la commande'
          : 'Error creating order'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('checkout')}</h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Complétez votre commande en quelques étapes simples'
              : 'Complete your order in a few simple steps'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('shippingInfo')}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('name')} *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+237 6XX XXX XXX"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('address')} *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('city')} *
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('region')} *
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select Region</option>
                      <option value="centre">Centre</option>
                      <option value="littoral">Littoral</option>
                      <option value="ouest">Ouest</option>
                      <option value="nord-ouest">Nord-Ouest</option>
                      <option value="sud-ouest">Sud-Ouest</option>
                      <option value="adamaoua">Adamaoua</option>
                      <option value="est">Est</option>
                      <option value="extreme-nord">Extrême-Nord</option>
                      <option value="nord">Nord</option>
                      <option value="sud">Sud</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('paymentMethod')}</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t('cashOnDelivery')}</div>
                      <div className="text-sm text-gray-600">
                        {language === 'fr' 
                          ? 'Payez à la réception de votre commande'
                          : 'Pay when you receive your order'
                        }
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={formData.paymentMethod === 'mobile_money'}
                      onChange={handleInputChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t('mobileMoney')}</div>
                      <div className="text-sm text-gray-600">
                        {language === 'fr' 
                          ? 'Orange Money, MTN Mobile Money'
                          : 'Orange Money, MTN Mobile Money'
                        }
                      </div>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'mobile_money' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {language === 'fr' 
                        ? 'Vous recevrez un SMS avec les instructions de paiement après confirmation.'
                        : 'You will receive SMS instructions for payment after confirmation.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Votre commande' : 'Your Order'}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const productName = language === 'fr' 
                      ? item.product.name_fr || item.product.name 
                      : item.product.name;

                    return (
                      <div key={item.product.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(item.product.image_url, dataSaver)}
                            alt={productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'fr' ? 'Sous-total' : 'Subtotal'}
                      </span>
                      <span className="font-medium">{formatPrice(getCartTotal())}</span>
                    </div>
                    
                    {deliveryFee > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            {language === 'fr' ? 'Livraison' : 'Delivery'}
                          </span>
                          <span className="font-medium">{formatPrice(deliveryFee)}</span>
                        </div>
                        
                        {formData.paymentMethod === 'cod' && (
                          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            {language === 'fr' 
                              ? '+500 XAF frais de paiement à la livraison'
                              : '+500 XAF cash on delivery fee'
                            }
                          </div>
                        )}
                        
                        {estimatedDelivery && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {language === 'fr' ? 'Livraison estimée:' : 'Estimated delivery:'} {estimatedDelivery}
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                        <span className="text-lg font-bold text-emerald-600">
                          {formatPrice(getCartTotal() + deliveryFee)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Calculator */}
                  {formData.region && formData.city && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {language === 'fr' ? 'Calcul de livraison' : 'Delivery Calculation'}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        <p>{formData.city}, {formData.region}</p>
                        <p>{language === 'fr' ? 'Frais:' : 'Fee:'} {formatPrice(deliveryFee)}</p>
                        <p>{language === 'fr' ? 'Délai:' : 'Time:'} {estimatedDelivery}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isSubmitting}
                      disabled={!formData.name || !formData.phone || !formData.address || !formData.city || !formData.region}
                    >
                      {t('placeOrder')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer variant="checkout" />
    </div>
  );
};