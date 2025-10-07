import { User, Cosmetic, Order, OrderItem, Payment  } from "@/lib/types/index"

export const mockUsers: User[] = [
  {
    _id: "1",
    email: "nguyen.van.a@gmail.com",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    role: "customer",
    isActive: true,
    phone: "0901234567",
    gender: "male",
    dob: new Date("1990-05-15"),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    createdAt: new Date("2024-01-15")
  },
  {
    _id: "2",
    email: "tran.thi.b@gmail.com",
    username: "tranthib",
    fullName: "Trần Thị B",
    role: "customer",
    isActive: true,
    phone: "0987654321",
    gender: "female",
    dob: new Date("1995-08-20"),
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150",
    createdAt: new Date("2024-02-10")
  },
  {
    _id: "3",
    email: "admin@cosmetics.com",
    username: "admin",
    fullName: "Admin User",
    role: "admin",
    isActive: true,
    phone: "0912345678",
    gender: "female",
    createdAt: new Date("2023-12-01")
  },
  {
    _id: "4",
    email: "le.van.c@gmail.com",
    username: "levanc",
    fullName: "Lê Văn C",
    role: "customer",
    isActive: false,
    phone: "0934567890",
    gender: "male",
    dob: new Date("1988-12-03"),
    createdAt: new Date("2024-03-05")
  },
  {
    _id: "5",
    email: "pham.thi.d@gmail.com",
    username: "phamthid",
    fullName: "Phạm Thị D",
    role: "customer",
    isActive: true,
    phone: "0945678901",
    gender: "female",
    dob: new Date("1992-07-18"),
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    createdAt: new Date("2024-01-28")
  }
];

export const mockCosmetics: Cosmetic[] = [
  {
    _id: "c1",
    brand: "L'Oréal",
    nameCosmetic: "Revitalift Anti-Aging Serum",
    description: "Serum chống lão hóa với Vitamin C và Retinol",
    classify: "skincare",
    image: "https://images.unsplash.com/photo-1613803745799-ba6c10aace85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1OTY3MzY5OXww&ixlib=rb-4.1.0&q=80&w=300",
    quantity: 50,
    originalPrice: 850000,
    discountPrice: 720000,
    rating: 4.5,
    isNew: true,
    isSaleOff: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-10-01")
  },
  {
    _id: "c2",
    brand: "Maybelline",
    nameCosmetic: "SuperStay Matte Ink Lipstick",
    description: "Son lì lâu trôi với công thức không khô môi",
    classify: "makeup",
    image: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk3NDg3NzB8MA&ixlib=rb-4.1.0&q=80&w=300",
    quantity: 120,
    originalPrice: 280000,
    discountPrice: 280000,
    rating: 4.2,
    isNew: false,
    isSaleOff: false,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-09-20")
  },
  {
    _id: "c3",
    brand: "Neutrogena",
    nameCosmetic: "Hydrating Foaming Cleanser",
    description: "Sữa rửa mặt dưỡng ẩm cho da khô và nhạy cảm",
    classify: "skincare",
    image: "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBiZWF1dHklMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk2OTc0Mzl8MA&ixlib=rb-4.1.0&q=80&w=300",
    quantity: 80,
    originalPrice: 320000,
    discountPrice: 270000,
    rating: 4.1,
    isNew: false,
    isSaleOff: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-09-15")
  },
  {
    _id: "c4",
    brand: "MAC",
    nameCosmetic: "Studio Fix Foundation",
    description: "Kem nền che phủ hoàn hảo cho mọi loại da",
    classify: "makeup",
    image: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk3NDg3NzB8MA&ixlib=rb-4.1.0&q=80&w=300",
    quantity: 25,
    originalPrice: 1200000,
    discountPrice: 1200000,
    rating: 4.7,
    isNew: true,
    isSaleOff: false,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-10-01")
  },
  {
    _id: "c5",
    brand: "The Ordinary",
    nameCosmetic: "Niacinamide 10% + Zinc 1%",
    description: "Tinh chất trị mụn và se khít lỗ chân lông",
    classify: "skincare",
    image: "https://images.unsplash.com/photo-1613803745799-ba6c10aace85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1OTY3MzY5OXww&ixlib=rb-4.1.0&q=80&w=300",
    quantity: 0,
    originalPrice: 180000,
    discountPrice: 160000,
    rating: 4.3,
    isNew: false,
    isSaleOff: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-09-30")
  }
];

export const mockOrders: Order[] = [
  {
    _id: "o1",
    userId: "1",
    receiverName: "Nguyễn Văn A",
    receiverPhone: "0901234567",
    receiverAddress: "123 Đường ABC, Quận 1, TP.HCM",
    totalPrice: 1000000,
    status: "completed",
    items: [
      {
        cosmetic: mockCosmetics[0],
        quantity: 1,
        price: 720000,
        subtotal: 720000
      },
      {
        cosmetic: mockCosmetics[1],
        quantity: 1,
        price: 280000,
        subtotal: 280000
      }
    ],
    payment: {
      status: "paid",
      method: "Credit Card",
      amount: 1000000,
      paidAt: new Date("2024-10-01")
    },
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01")
  },
  {
    _id: "o2",
    userId: "2",
    receiverName: "Trần Thị B",
    receiverPhone: "0987654321",
    receiverAddress: "456 Đường XYZ, Quận 3, TP.HCM",
    totalPrice: 590000,
    status: "processing",
    items: [
      {
        cosmetic: mockCosmetics[2],
        quantity: 2,
        price: 270000,
        subtotal: 540000
      }
    ],
    payment: {
      status: "paid",
      method: "Bank Transfer",
      amount: 590000,
      paidAt: new Date("2024-10-02")
    },
    createdAt: new Date("2024-10-02"),
    updatedAt: new Date("2024-10-03")
  },
  {
    _id: "o3",
    userId: "5",
    receiverName: "Phạm Thị D",
    receiverPhone: "0945678901",
    receiverAddress: "789 Đường DEF, Quận 7, TP.HCM",
    totalPrice: 1200000,
    status: "pending",
    items: [
      {
        cosmetic: mockCosmetics[3],
        quantity: 1,
        price: 1200000,
        subtotal: 1200000
      }
    ],
    payment: {
      status: "unpaid",
      method: "COD",
      amount: 1200000
    },
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05")
  },
  {
    _id: "o4",
    userId: "1",
    receiverName: "Nguyễn Văn A",
    receiverPhone: "0901234567",
    receiverAddress: "123 Đường ABC, Quận 1, TP.HCM",
    totalPrice: 320000,
    status: "cancelled",
    items: [
      {
        cosmetic: mockCosmetics[4],
        quantity: 2,
        price: 160000,
        subtotal: 320000
      }
    ],
    payment: {
      status: "failed",
      method: "Credit Card",
      amount: 320000
    },
    createdAt: new Date("2024-10-03"),
    updatedAt: new Date("2024-10-04")
  }
];

// Revenue data for dashboard
export const revenueData = [
  { month: "Jan", revenue: 45000000, orders: 120 },
  { month: "Feb", revenue: 52000000, orders: 140 },
  { month: "Mar", revenue: 48000000, orders: 130 },
  { month: "Apr", revenue: 61000000, orders: 165 },
  { month: "May", revenue: 55000000, orders: 150 },
  { month: "Jun", revenue: 67000000, orders: 180 },
  { month: "Jul", revenue: 58000000, orders: 155 },
  { month: "Aug", revenue: 72000000, orders: 195 },
  { month: "Sep", revenue: 65000000, orders: 175 },
  { month: "Oct", revenue: 78000000, orders: 210 },
  { month: "Dec", revenue: 78000000, orders: 230 },
  
];

export const categoryStats = [
  { category: "Skincare", revenue: 320000000, percentage: 65 },
  { category: "Makeup", revenue: 150000000, percentage: 30 },
  { category: "Fragrance", revenue: 25000000, percentage: 5 }
];