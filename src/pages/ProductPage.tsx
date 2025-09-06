// src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Product, ProductImage } from '../types';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../lib/translations';
import { formatPrice, getImageUrl } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { productService } from '../lib/supabase';
import toast from 'react-hot-toast';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { language, addToCart, dataSaver } = useAppStore();
  const t = useTranslation(language);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getById(id);

        // If service returns null/undefined
        if (!productData) {
          setProduct(null);
          setImages([]);
          return;
        }

        setProduct(productData);

        // Build image array safely
        const extraImages: ProductImage[] = (productData as any).product_images || [];
        const allImages = [
          productData.image_url,
          ...extraImages.map((img: ProductImage) => img?.image_url).filter(Boolean),
        ].filter(Boolean) as string[];

        // Always have at least one image (fallback to placeholder if needed)
        setImages(allImages.length > 0 ? allImages : ['/placeholder.png']);

        // Handle QuickBuy
        const quickBuyQuantity = searchParams.get('quickbuy');
        if (quickBuyQuantity) {
          const q = parseInt(quickBuyQuantity, 10);
          setQuantity(Number.isFinite(q) && q > 0 ? q : 1);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, searchParams]);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Produit non trouvé' : 'Product not found'}
          </h2>
        </div>
      </div>
    );
  }

  const productName = language === 'fr' ? product.name_fr || product.name : product.name;
  const productDescription =
    language === 'fr' ? product.description_fr || product.description : product.description;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(
      language === 'fr'
        ? `${quantity} ${productName} ajouté au panier`
        : `${quantity} ${productName} added to cart`,
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: productDescription,
          url: window.location.href,
        });
      } catch {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % (images.length || 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + (images.length || 1)) % (images.length || 1));

  const generateQRCode = () => setShowQRCode(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{language === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={getImageUrl(images[currentImageIndex], dataSaver)}
                  alt={`${productName} - View ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                {images.length > 1 && (
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className="bg-black/70 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  title="360° View"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={getImageUrl(image, dataSaver)}
                      alt={`${productName} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
                  {product.sku && <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsWishlisted((v) => !v)}
                    className={`p-2 transition-colors ${
                      isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={generateQRCode}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span
                  className={`px-3 py-1 rounded-full ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} ${language === 'fr' ? 'en stock' : 'in stock'}` : t('outOfStock')}
                </span>
                {product.featured && (
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                    {language === 'fr' ? 'Vedette' : 'Featured'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed">{productDescription}</p>
            </div>

            {(product.weight || product.dimensions || (product.tags && product.tags.length > 0)) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {language === 'fr' ? 'Spécifications' : 'Specifications'}
                </h4>
                <div className="space-y-2 text-sm">
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'fr' ? 'Poids:' : 'Weight:'}</span>
                      <span className="font-medium">{product.weight}kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'fr' ? 'Dimensions:' : 'Dimensions:'}</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <span className="text-gray-600 block mb-1">{language === 'fr' ? 'Tags:' : 'Tags:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {language === 'fr' ? 'Avantages CameroonMart' : 'CameroonMart Benefits'}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{language === 'fr' ? 'Livraison rapide' : 'Fast delivery'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{language === 'fr' ? 'Garantie qualité' : 'Quality guarantee'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{language === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{language === 'fr' ? 'Support 24/7' : '24/7 support'}</span>
                </div>
              </div>
            </div>

            {/* Quantity / Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">{t('quantity')}:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <motion.button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <motion.button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stock}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-gray-500">
                  {language === 'fr' ? 'Maximum' : 'Max'}: {product.stock}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleAddToCart} disabled={product.stock === 0} size="lg" className="w-full">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock > 0 ? t('addToCart') : t('outOfStock')}
                  </Button>
                </motion.div>
                <Link to="/cart" className="sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="lg" className="w-full">
                      {language === 'fr' ? 'Voir le Panier' : 'View Cart'}
                    </Button>
                  </motion.div>
                </Link>
              </div>

              <motion.div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-medium">
                    {language === 'fr' ? 'Total pour' : 'Total for'} {quantity}{' '}
                    {language === 'fr' ? 'article(s)' : 'item(s)'}:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'fr' ? 'Partager ce produit' : 'Share this product'}
                </h3>
                <div className="flex justify-center space-x-4 mb-4">
                  <FacebookShareButton url={window.location.href} quote={productName}>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      f
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={window.location.href} title={productName}>
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
                      T
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={window.location.href} title={productName}>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                      W
                    </div>
                  </WhatsappShareButton>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(language === 'fr' ? 'Lien copié!' : 'Link copied!');
                    setShowShareModal(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  {language === 'fr' ? 'Copier le lien' : 'Copy link'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowQRCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'fr' ? 'Code QR du produit' : 'Product QR Code'}
                </h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode value={window.location.href} size={200} />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'fr' ? 'Scannez pour partager ce produit' : 'Scan to share this product'}
                </p>
                <Button onClick={() => setShowQRCode(false)} variant="outline" className="w-full">
                  {language === 'fr' ? 'Fermer' : 'Close'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};
