import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, Category } from '../types';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { ProductCard } from '../components/ui/ProductCard';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { productService, categoryService } from '../lib/supabase';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useAppStore();
  const t = useTranslation(language);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          selectedCategory ? productService.getByCategory(selectedCategory) : productService.getAll(),
          categoryService.getAll()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading catalog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.name_fr && product.name_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description_fr && product.description_fr.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return b.featured ? 1 : -1;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const searchResults = await productService.search(searchTerm);
        setProducts(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
    
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryFilter = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('catalog')}</h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? `Découvrez ${filteredProducts.length} produits incroyables`
              : `Discover ${filteredProducts.length} amazing products`
            }
          </p>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{language === 'fr' ? 'Toutes catégories' : 'All categories'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === 'fr' ? category.name_fr || category.name : category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">{language === 'fr' ? 'Plus récent' : 'Newest'}</option>
              <option value="featured">{language === 'fr' ? 'Vedettes' : 'Featured'}</option>
              <option value="price-low">{language === 'fr' ? 'Prix croissant' : 'Price: Low to High'}</option>
              <option value="price-high">{language === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}</option>
              <option value="name">{language === 'fr' ? 'Nom A-Z' : 'Name A-Z'}</option>
            </select>

            {/* View Mode */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'fr' ? 'Filtres avancés:' : 'Advanced filters:'}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Prix:' : 'Price:'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="5000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">
                  {(priceRange.max / 1000).toFixed(0)}k XAF
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'fr' 
                ? 'Essayez de modifier vos filtres ou votre recherche'
                : 'Try adjusting your filters or search terms'
              }
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPriceRange({ min: 0, max: 1000000 });
              setSearchParams({});
            }}>
              {language === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};