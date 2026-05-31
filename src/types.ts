export type CategoryId = 'all' | 'juices' | 'desserts' | 'specials';

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
  rating: number;
  isFeatured?: boolean;
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
  status: 'pending' | 'preparing' | 'on_way' | 'delivered';
  date: string;
  couponApplied?: string;
  discountAmount?: number;
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
