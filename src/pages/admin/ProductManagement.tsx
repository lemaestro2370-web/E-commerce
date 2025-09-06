import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Product, Category } from '../../types';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/layout/Footer';
import { productService, categoryService, userService } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const ProductManagement: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = useTranslation(language);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate('/auth/login');
        return;
      }

      try {
        if (!user || !['admin', 'manager'].includes(user.role)) {
          navigate('/');
          return;
        }
        
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, navigate]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce produit ?' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success(language === 'fr' ? 'Produit supprimé' : 'Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'fr' ? 'Gestion des Produits' : 'Product Management'}
            </h1>
            <p className="text-gray-600">
              {language === 'fr' 
                ? `Gérez ${filteredProducts.length} produits`
                : `Manage ${filteredProducts.length} products`
              }
            </p>
          </div>
          <Link to="/admin/products/new">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                {language === 'fr' ? 'Nouveau Produit' : 'New Product'}
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher des produits...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{language === 'fr' ? 'Toutes catégories' : 'All categories'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === 'fr' ? category.name_fr || category.name : category.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Produit' : 'Product'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Catégorie' : 'Category'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Prix' : 'Price'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Stock' : 'Stock'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Statut' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'fr' ? 'Actions' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => {
                  const productName = language === 'fr' ? product.name_fr || product.name : product.name;
                  const category = categories.find(c => c.id === product.category_id);
                  const categoryName = category ? (language === 'fr' ? category.name_fr || category.name : category.name) : 'N/A';

                  return (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                            <img
                              src={product.image_url}
                              alt={productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{productName}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.active ? (language === 'fr' ? 'Actif' : 'Active') : (language === 'fr' ? 'Inactif' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`/product/${product.id}`}>
                            <motion.button 
                              className="text-gray-400 hover:text-gray-600"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                          </Link>
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <motion.button 
                              className="text-emerald-600 hover:text-emerald-900"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                          </Link>
                          <motion.button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <Footer variant="admin" />
    </div>
  );
};