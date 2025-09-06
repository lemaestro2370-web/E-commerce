import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Globe, Palette, Bell, Zap, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { language, theme, setTheme, dataSaver, toggleDataSaver } = useAppStore();
  const t = useTranslation(language);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    preferences: {
      language: user?.preferences?.language || 'en',
      theme: user?.preferences?.theme || 'emerald',
      notifications: user?.preferences?.notifications ?? true,
      data_saver: user?.preferences?.data_saver ?? false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setTheme(formData.preferences.theme);
      toast.success(
        language === 'fr' 
          ? 'Profil mis à jour avec succès!'
          : 'Profile updated successfully!'
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de la mise à jour'
          : 'Error updating profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Connexion requise' : 'Login Required'}
          </h2>
        </div>
      </div>
    );
  }

  const themes = [
    { value: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
    { value: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { value: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { value: 'red', name: 'Red', color: 'bg-red-500' },
    { value: 'pink', name: 'Pink', color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Mon Profil' : 'My Profile'}
          </h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Gérez vos informations personnelles et préférences'
              : 'Manage your personal information and preferences'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? 'Prénom' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? 'Nom' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {language === 'fr' ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline h-4 w-4 mr-1" />
                    {language === 'fr' ? 'Langue' : 'Language'}
                  </label>
                  <select
                    name="preferences.language"
                    value={formData.preferences.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Palette className="inline h-4 w-4 mr-1" />
                    {language === 'fr' ? 'Thème' : 'Theme'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((themeOption) => (
                      <label
                        key={themeOption.value}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.preferences.theme === themeOption.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferences.theme"
                          value={themeOption.value}
                          checked={formData.preferences.theme === themeOption.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full ${themeOption.color}`}></div>
                        <span className="text-sm font-medium">{themeOption.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'Notifications' : 'Notifications'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'fr' ? 'Mode Économie de Données' : 'Data Saver Mode'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.data_saver"
                        checked={formData.preferences.data_saver}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'fr' ? 'Sauvegarder' : 'Save Changes'}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Account Info */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'fr' ? 'Informations du Compte' : 'Account Information'}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'fr' ? 'Rôle:' : 'Role:'}</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'manager'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'User'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'fr' ? 'Membre depuis:' : 'Member since:'}</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                  </span>
                </div>
              </div>
            </motion.div>

            {user.role === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6"
              >
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  {language === 'fr' ? 'Accès Administrateur' : 'Admin Access'}
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  {language === 'fr' 
                    ? 'Vous avez un accès complet à toutes les fonctionnalités administratives.'
                    : 'You have full access to all administrative features.'
                  }
                </p>
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
                  {language === 'fr' ? 'Tableau de Bord Admin' : 'Admin Dashboard'}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};