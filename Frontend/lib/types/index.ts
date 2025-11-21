export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  phone?: string;
  gender?: string;
  dob?: Date;
  avatar?: string;
  createdAt: Date;
}

export interface Cosmetic {
  _id: string;
  brand: string;
  nameCosmetic: string;
  description?: string;
  classify: string;
  image?: string;
  quantity: number;
  originalPrice: number;
  discountPrice: number;
  rating?: number;
  isNew?: boolean;
  isSaleOff?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  addressDetail: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface CartItem {
  cosmeticId?: string; // Backend returns this
  cosmetic?: Cosmetic; // Populated cosmetic object (optional)
  quantity: number;
  price?: number;
  subtotal: number;
  isSelected?: boolean;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  cosmetic: Cosmetic;
  quantity: number;
  price: number;
  subtotal: number;
  cosmeticName: string;
  cosmeticImage: string;
}

export interface Payment {
  status: "unpaid" | "paid" | "failed";
  method?: string;
  amount: number;
  paidAt?: Date;
}

export interface Order {
  _id: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  orderNotes?: string;
  totalAmount: number;
  totalItems: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  payment: Payment;
  createdAt: Date;
  updatedAt: Date;
}

// interface IOrder {
//   _id?: ObjectId
//   userId: ObjectId
//   receiverName: string
//   receiverPhone: string
//   receiverAddress: string
//   items: IOrderItem[]
//   totalAmount: number
//   totalItems: number
//   status: 'pending' | 'processing' | 'completed' | 'cancelled'
//   payment: IOrderPayment
//   createdAt: Date
//   updatedAt: Date | null
//   _destroy: boolean
// }

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
