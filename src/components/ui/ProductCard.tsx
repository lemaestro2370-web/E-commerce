import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/translations';
import { formatPrice, getImageUrl } from '../../lib/utils';
import { Button } from './Button';

import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, addToCart, dataSaver } = useAppStore();
  const t = useTranslation(language);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Show success toast with product name
    const productName = language === 'fr' ? product.name_fr || product.name : product.name;
    toast.success(
      language === 'fr' 
        ? `${productName} ajouté au panier!`
        : `${productName} added to cart!`,
      {
        duration: 2000,
        icon: '🛒',
      }
    );
  };

  const productName = language === 'fr' ? product.name_fr || product.name : product.name;
  const productDescription = language === 'fr' ? product.description_fr || product.description : product.description;

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-emerald-200">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={getImageUrl(product.image_url, dataSaver)}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 inline mr-1" />
              Featured
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {productName}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {productDescription}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : t('outOfStock')}
              </span>
            </div>
            
            {product.stock > 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {t('addToCart')}
              </Button>
            ) : (
              <Button size="sm" disabled>
                {t('outOfStock')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};