export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  approvalStatus?: string;
}

export interface Review {
  id: number;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

export interface RatingBucket {
  stars: number;
  count: number;
  percent: number;
}

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  color?: string;
  size?: string;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'shipping';
  value: number;
  description: string;
}

export interface Address {
  id: number;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: number;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: number;
  number: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentSummary: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface CatalogQuery {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  totalPages: number;
}
