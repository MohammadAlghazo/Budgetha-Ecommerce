export interface Category {
  id: string;
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

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  stockQuantity: number;
  price?: number;
  rentalPricePerDay?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
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
  imageDetails?: ProductImage[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  approvalStatus?: string;
  isAvailableForRent?: boolean;
  rentalPricePerDay?: number;
  variants: ProductVariant[];
}

export interface ProductImage {
  url: string;
  publicId?: string | null;
}

export interface Review {
  id: string | number;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  isAuthor?: boolean;
}

export interface RatingBucket {
  stars: number;
  count: number;
  percent: number;
}

export interface CartItem {
  id?: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  color?: string;
  size?: string;
  type?: 'Purchase' | 'Rental';
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalPricePerDay?: number;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'shipping';
  value: number;
  description: string;
  maxDiscountAmount?: number;
}

export interface Address {
  id: number | string;
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

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Failed';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  type?: 'Purchase' | 'Rental';
  rentalStartDate?: string;
  rentalEndDate?: string;
}

export interface Order {
  id: string;
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
