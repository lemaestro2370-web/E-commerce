import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Shield, Truck, CreditCard } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';

interface FooterProps {
  variant?: 'home' | 'checkout' | 'admin' | 'default';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const { language } = useAppStore();
  const t = useTranslation(language);

  if (variant === 'checkout') {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">Secure Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">Safe Payments</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              © 2025 CameroonMart. Your trusted online marketplace.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'admin') {
    return (
      <footer className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              CameroonMart Admin v1.0.0
            </p>
            <p className="text-sm text-gray-400">
              Built with ❤️ for Cameroon
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-xl font-bold">CameroonMart</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {language === 'fr' 
                ? "Votre marketplace de confiance au Cameroun. Découvrez des produits de qualité avec livraison rapide dans tout le pays."
                : "Your trusted marketplace in Cameroon. Discover quality products with fast delivery across the country."
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  {t('catalog')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  {t('orders')}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'À Propos' : 'About Us'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'fr' ? 'Contact' : 'Contact'}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@cameroonmart.cm</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Douala, Cameroon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2025 CameroonMart. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          
          {variant === 'home' && (
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">
                {language === 'fr' ? 'Modes de paiement:' : 'Payment methods:'}
              </span>
              <div className="flex space-x-2">
                <div className="bg-gray-800 px-2 py-1 rounded text-xs">COD</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-xs">Mobile Money</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};