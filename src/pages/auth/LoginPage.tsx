import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuthStore();
  const { language } = useAppStore();
  const t = useTranslation(language);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(formData.email, formData.password);
      toast.success(
        language === 'fr' 
          ? 'Connexion réussie!'
          : 'Login successful!'
      );
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(
        language === 'fr' 
          ? 'Erreur de connexion. Vérifiez vos identifiants.'
          : 'Login failed. Please check your credentials.'
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CameroonMart</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Bienvenue' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Sign in to access your account'
            }
          </p>
        </div>
        
        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder={language === 'fr' ? 'Votre mot de passe' : 'Your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                {language === 'fr' ? 'Créer un compte de test:' : 'Create a test account:'}
              </h4>
              <div className="text-sm text-blue-700">
                <p>{language === 'fr' 
                  ? 'Utilisez n\'importe quel email et mot de passe pour créer un compte de test.'
                  : 'Use any email and password to create a test account.'
                }</p>
                <p className="mt-1"><strong>Admin:</strong> admin@cameroonmart.cm sera automatiquement admin</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {language === 'fr' ? 'Se connecter' : 'Sign In'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <Link 
                to="/auth/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot your password?'}
              </Link>
            </div>
          </form>
        </motion.div>
        
        {/* Sign Up Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            {language === 'fr' 
              ? 'Nouveau client ? '
              : 'New customer? '
            }
            <Link 
              to="/auth/signup"
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              {language === 'fr' ? 'Créer un compte' : 'Create an account'}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};