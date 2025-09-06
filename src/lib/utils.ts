import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF'
  }).format(price);
}

export function formatDate(date: string, locale: 'en' | 'fr' = 'en'): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function generateQuickBuyLink(productId: string, quantity: number = 1): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/product/${productId}?quickbuy=${quantity}`;
}

export function getImageUrl(url: string, dataSaver: boolean = false): string {
  if (!url) return '';
  
  // If data saver is enabled, add compression parameters
  if (dataSaver && url.includes('pexels.com')) {
    return `${url}?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`;
  }
  
  return url;
}