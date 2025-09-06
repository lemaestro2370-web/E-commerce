import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Globe, Zap, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';
import { Button } from './Button';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { language, setLanguage, getCartCount, dataSaver, toggleDataSaver } = useAppStore();
  const t = useTranslation(language);
  const cartCount = getCartCount();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(
        language === 'fr' 
          ? 'Déconnexion réussie'
          : 'Signed out successfully'
      );
    } catch (error) {
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de la déconnexion'
          : 'Error signing out'
      );
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const cn = (...classes: (string | undefined | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CameroonMart</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-emerald-600',
                isActive('/') ? 'text-emerald-600' : 'text-gray-700'
              )}
            >
              {t('home')}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-emerald-600',
                  isActive('/dashboard') ? 'text-emerald-600' : 'text-gray-700'
                )}
              >
                {language === 'fr' ? 'Tableau de Bord' : 'Dashboard'}
              </Link>
            )}
            <Link
              to="/catalog"
              className={cn(
                'text-sm font-medium transition-colors hover:text-emerald-600',
                isActive('/catalog') ? 'text-emerald-600' : 'text-gray-700'
              )}
            >
              {t('catalog')}
            </Link>
            {user && (
            <Link
              to="/orders"
              className={cn(
                'text-sm font-medium transition-colors hover:text-emerald-600',
                isActive('/orders') ? 'text-emerald-600' : 'text-gray-700'
              )}
            >
              {t('myOrders')}
            </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Data Saver Toggle */}
            <button
              onClick={toggleDataSaver}
              className={cn(
                'p-2 rounded-lg transition-colors',
                dataSaver ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
              )}
              title={dataSaver ? 'Data saver enabled' : 'Enable data saver'}
            >
              <Zap className="h-5 w-5" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {!user ? (
              <Link to="/auth/login">
                <Button size="sm">{t('login')}</Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.first_name || user.email.split('@')[0]}
                  </span>
                  {user.role === 'admin' && (
                    <Link to="/admin">
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        Admin
                      </span>
                    </Link>
                  )}
                  {user.role === 'manager' && (
                    <Link to="/admin">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        Manager
                      </span>
                    </Link>
                  )}
                  {user.role === 'manager' && (
                    <Link to="/admin">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        Manager
                      </span>
                    </Link>
                  )}
                </div>
                <Link to="/profile">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={language === 'fr' ? 'Profil' : 'Profile'}
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </Link>
                <Link to="/profile">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={language === 'fr' ? 'Profil' : 'Profile'}
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={language === 'fr' ? 'Se déconnecter' : 'Sign out'}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};