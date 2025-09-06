export const translations = {
  en: {
    // Navigation
    home: 'Home',
    catalog: 'Shop',
    cart: 'Cart',
    orders: 'My Orders',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    
    // Home page
    heroTitle: 'Discover Amazing Products',
    heroSubtitle: 'Shop the best selection in Cameroon with fast delivery',
    shopNow: 'Shop Now',
    featured: 'Featured Products',
    categories: 'Categories',
    
    // Product
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    price: 'Price',
    description: 'Description',
    
    // Cart
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    quantity: 'Quantity',
    total: 'Total',
    remove: 'Remove',
    
    // Checkout
    shippingInfo: 'Shipping Information',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    mobileMoney: 'Mobile Money',
    placeOrder: 'Place Order',
    
    // Orders
    orderHistory: 'Order History',
    orderNumber: 'Order #',
    orderDate: 'Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    myOrders: 'My Orders',
    
    // Status
    processing: 'Processing',
    dispatched: 'Dispatched',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Footer
    quickLinks: 'Quick Links',
    support: 'Support',
    company: 'Company',
    followUs: 'Follow Us',
    
    // Common
    search: 'Search products...',
    filter: 'Filter',
    sort: 'Sort',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    region: 'Region'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    catalog: 'Boutique',
    cart: 'Panier',
    orders: 'Mes Commandes',
    admin: 'Admin',
    login: 'Connexion',
    logout: 'Déconnexion',
    
    // Home page
    heroTitle: 'Découvrez des Produits Incroyables',
    heroSubtitle: 'Achetez la meilleure sélection au Cameroun avec livraison rapide',
    shopNow: 'Acheter Maintenant',
    featured: 'Produits Vedettes',
    categories: 'Catégories',
    
    // Product
    addToCart: 'Ajouter au Panier',
    outOfStock: 'Rupture de Stock',
    price: 'Prix',
    description: 'Description',
    
    // Cart
    cartEmpty: 'Votre panier est vide',
    continueShopping: 'Continuer les Achats',
    checkout: 'Commander',
    quantity: 'Quantité',
    total: 'Total',
    remove: 'Supprimer',
    
    // Checkout
    shippingInfo: 'Informations de Livraison',
    paymentMethod: 'Mode de Paiement',
    cashOnDelivery: 'Paiement à la Livraison',
    mobileMoney: 'Mobile Money',
    placeOrder: 'Passer la Commande',
    
    // Orders
    orderHistory: 'Historique des Commandes',
    orderNumber: 'Commande #',
    orderDate: 'Date',
    orderStatus: 'Statut',
    orderTotal: 'Total',
    myOrders: 'Mes Commandes',
    
    // Status
    processing: 'En Cours',
    dispatched: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    
    // Footer
    quickLinks: 'Liens Rapides',
    support: 'Support',
    company: 'Entreprise',
    followUs: 'Suivez-nous',
    
    // Common
    search: 'Rechercher des produits...',
    filter: 'Filtrer',
    sort: 'Trier',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès !',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    region: 'Région'
  }
};

export const useTranslation = (language: 'en' | 'fr') => {
  return (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };
};