export type CategoryId = 'all' | 'juices' | 'desserts' | 'specials' | 'events';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  arabicName: string;
  description: string;
  price: number;
  image: string;
  category: CategoryId;
  size?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  rating?: number;
  prepTime: string; // e.g. "5-10 دقائق"
  ingredients: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string; // e.g. "DB-12345"
  fullName: string;
  phone: string;
  address: string;
  notes: string;
  deliveryArea: string;
  deliveryCost: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'new' | 'pending' | 'preparing' | 'on_way' | 'delivered' | 'cancelled';
  date: string;
  couponApplied?: string;
  discountAmount?: number;
  whatsappUrl?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
  minOrder?: number;
}

export interface Testimonial {
  id: number;
  name: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SiteSettings {
  logoUrl: string;
  heroBannerUrl: string;
  heroBannerMobileUrl?: string;
  faviconUrl: string;
  heroTitle: string;
  heroSubTitle: string;
  heroDescription: string;
  promoBadgeText: string;
  storeName: string;
  storeDescription: string;
  aboutTitle: string;
  aboutHeroText: string;
  aboutMainText: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  instagramUrl: string;
  facebookUrl: string;
  footerCredits: string;
  // Customizable paths/routes
  aboutPath?: string;
  deliveryPath?: string;
  contactPath?: string;
  trackPath?: string;
  adminPath?: string;
  homePath?: string;

}

