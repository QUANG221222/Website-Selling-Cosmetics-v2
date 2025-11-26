# Website-Selling-Cosmetics-v2

Hệ thống website bán mỹ phẩm hiện đại với kiến trúc fullstack, sử dụng Node.js/Express cho Backend và Next.js cho Frontend.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng](#tính-năng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy dự án](#chạy-dự-án)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [License](#license)

## 🎯 Tổng quan

Website bán mỹ phẩm với các chức năng đầy đủ từ quản lý sản phẩm, giỏ hàng, đơn hàng đến quản lý người dùng và địa chỉ giao hàng.

## 🛠 Công nghệ sử dụng

### Backend

- **Node.js** & **Express.js** - Framework server
- **TypeScript** - Ngôn ngữ lập trình
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Joi** - Validation
- **Bcrypt** - Mã hóa mật khẩu
- **Express-session** - Quản lý session
- **Cloudinary** - Lưu trữ hình ảnh
- **Brevo (Sendinblue)** - Gửi email

### Frontend

- **Next.js 15** - React Framework
- **TypeScript** - Ngôn ngữ lập trình
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons

## ✨ Tính năng

### Người dùng (Customer)

- ✅ Đăng ký tài khoản với xác thực email
- ✅ Đăng nhập/Đăng xuất
- ✅ Xem danh sách sản phẩm mỹ phẩm (có phân trang)
- ✅ Tìm kiếm sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Cập nhật/Xóa sản phẩm trong giỏ hàng
- ✅ Quản lý địa chỉ giao hàng (thêm, sửa, xóa, đặt mặc định)
- ✅ Đặt hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Xem chi tiết đơn hàng

### Quản trị viên (Admin)

- ✅ Đăng ký tài khoản admin (với secret key)
- ✅ Đăng nhập với xác thực email
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Upload ảnh sản phẩm lên Cloudinary
- ✅ Quản lý đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Quản lý người dùng
- ✅ Xem thống kê

### Chức năng khác

- ✅ Session-based authentication
- ✅ Email verification
- ✅ Phân trang cho tất cả danh sách
- ✅ Validation dữ liệu với Joi
- ✅ Error handling toàn diện
- ✅ Quản lý tồn kho tự động

## 📦 Cài đặt

### Yêu cầu

- Node.js >= 18.x
- MongoDB >= 6.x
- Yarn hoặc npm
- pnpm (cho Frontend)

### Clone repository

```bash
git clone https://github.com/yourusername/Website-Selling-Cosmetics-v2.git
cd Website-Selling-Cosmetics-v2
```

### Cài đặt Backend

```bash
cd Backend
yarn install
# hoặc
npm install
```

### Cài đặt Frontend

```bash
cd Frontend
pnpm install
```

## ⚙️ Cấu hình

### Backend Environment Variables

Tạo file `.env` trong thư mục `Backend/` với nội dung:

```env
# Server
PORT=8017
BUILD_MODE=development
HOST_NAME=localhost

# Database
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name

# Session
SESSION_SECRET=your_session_secret_key

# Admin
ADMIN_CREATION_SECRET_KEY=your_admin_secret_key

# Email (Brevo)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_sender_email
SENDER_NAME=Beautify

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Domain
WEBSITE_DOMAIN=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8017
```

### Frontend Environment Variables

Tạo file `.env.local` trong thư mục `Frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8017
```

## 🚀 Chạy dự án

### Development Mode

**Backend:**

```bash
cd Backend
yarn dev
# Server sẽ chạy tại http://localhost:8017
```

**Frontend:**

```bash
cd Frontend
pnpm dev
# App sẽ chạy tại http://localhost:3000
```

### Production Mode

**Backend:**

```bash
cd Backend
yarn build
yarn start
```

**Frontend:**

```bash
cd Frontend
pnpm build
pnpm start
```

## 📁 Cấu trúc dự án

```
Website-Selling-Cosmetics-v2/
├── Backend/
│   ├── src/
│   │   ├── configs/          # Cấu hình (DB, Cloudinary, etc.)
│   │   ├── controllers/      # Controllers xử lý request
│   │   ├── models/          # Models MongoDB
│   │   ├── providers/       # Third-party providers (Brevo)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities & helpers
│   │   ├── validations/     # Joi validation schemas
│   │   └── server.ts        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Libraries & utilities
│   ├── public/             # Static files
│   ├── types/              # TypeScript types
│   ├── middleware.ts       # Next.js middleware
│   ├── next.config.ts
│   └── package.json
│
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication

- `POST /v1/users/register` - Đăng ký tài khoản
- `POST /v1/users/verify` - Xác thực email
- `POST /v1/users/login` - Đăng nhập
- `POST /v1/users/logout` - Đăng xuất
- `GET /v1/users/current` - Lấy thông tin user hiện tại

#### Admin Authentication

- `POST /v1/admin/register` - Đăng ký admin (cần secret key)
- `POST /v1/admin/verify` - Xác thực email admin
- `POST /v1/admin/login` - Đăng nhập admin

### Cosmetics Endpoints

- `GET /v1/cosmetics` - Lấy danh sách mỹ phẩm (có phân trang)
- `GET /v1/cosmetics/:id` - Lấy chi tiết mỹ phẩm
- `POST /v1/cosmetics` - Tạo mỹ phẩm mới (Admin only)
- `PUT /v1/cosmetics/:id` - Cập nhật mỹ phẩm (Admin only)
- `DELETE /v1/cosmetics/:id` - Xóa mỹ phẩm (Admin only)

### Cart Endpoints

- `GET /v1/cart` - Lấy giỏ hàng của user
- `POST /v1/cart` - Tạo giỏ hàng mới
- `POST /v1/cart/add` - Thêm sản phẩm vào giỏ
- `PUT /v1/cart/update` - Cập nhật số lượng
- `DELETE /v1/cart/:cosmeticId` - Xóa sản phẩm khỏi giỏ
- `DELETE /v1/cart/clear` - Xóa toàn bộ giỏ hàng

### Order Endpoints

- `GET /v1/orders` - Lấy danh sách đơn hàng
- `GET /v1/orders/user` - Lấy đơn hàng của user (có phân trang)
- `GET /v1/orders/:id` - Lấy chi tiết đơn hàng
- `POST /v1/orders` - Tạo đơn hàng mới
- `PUT /v1/orders/:id` - Cập nhật đơn hàng (Admin only)
- `DELETE /v1/orders/:id` - Xóa đơn hàng

### Address Endpoints

- `GET /v1/addresses` - Lấy danh sách địa chỉ
- `GET /v1/addresses/default` - Lấy địa chỉ mặc định
- `GET /v1/addresses/:index` - Lấy địa chỉ theo index
- `POST /v1/addresses` - Tạo địa chỉ mới
- `PUT /v1/addresses/:index` - Cập nhật địa chỉ
- `PUT /v1/addresses/:index/default` - Đặt địa chỉ mặc định
- `DELETE /v1/addresses/:index` - Xóa địa chỉ

### User Management (Admin only)

- `GET /v1/users` - Lấy danh sách users (có phân trang)
- `GET /v1/users/:id` - Lấy thông tin user
- `DELETE /v1/users/:id` - Xóa user

## 🔐 Security Features

- Password hashing với bcrypt
- Session-based authentication
- Email verification
- Input validation với Joi
- Role-based access control (Admin/Customer)
- Secret key cho admin creation
- CORS protection
- Environment variables cho sensitive data

## 📝 Validation Rules

### User Registration

- Username: 3-30 ký tự, chỉ chữ cái, số và dấu gạch dưới
- Email: Format chuẩn email
- Password: 8-256 ký tự, ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt

### Product Creation

- Name: 2-100 ký tự
- Description: 10-1000 ký tự
- Quantity: Số nguyên >= 0
- Price: >= 1000
- Rating: 0-5

### Order Creation

- Receiver name: 2-50 ký tự
- Phone: 10-11 số
- Address: 10-200 ký tự
- Items: Ít nhất 1 sản phẩm

### Address

- Name: 2-100 ký tự
- Phone: Format số điện thoại Việt Nam
- Address detail: 10-500 ký tự

## 🎨 UI Components (Frontend)

### Layout Components

- **Header** - Navigation bar với search
- **Footer** - Thông tin công ty
- **SearchBar** - Tìm kiếm sản phẩm

### UI Components (Shadcn/ui)

- Button
- Input
- Card
- Dialog
- Dropdown Menu
- Form
- Table
- ... và nhiều components khác

## 🔄 Data Flow

1. **User Registration Flow:**

   - User đăng ký → Server tạo account → Gửi email verification → User xác thực → Account active

2. **Shopping Flow:**

   - Browse products → Add to cart → Update quantity → Checkout → Create order → Update inventory

3. **Order Processing:**
   - Order created (pending) → Admin updates (processing) → Payment confirmed (completed)

## 🐛 Troubleshooting

### Backend không khởi động được

- Kiểm tra MongoDB connection string
- Đảm bảo tất cả environment variables đã được set
- Kiểm tra port 8017 có bị chiếm không

### Frontend không kết nối được API

- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
- Đảm bảo Backend đang chạy
- Kiểm tra CORS settings

### Email không gửi được

- Kiểm tra Brevo API key
- Verify sender email trong Brevo dashboard

### Upload ảnh thất bại

- Kiểm tra Cloudinary credentials
- Đảm bảo file size < 10MB

## 📄 License

MIT License - xem file [LICENSE](Backend/LICENSE) để biết thêm chi tiết.

## 👥 Contributors

- Your Name - Initial work

## 📞 Contact

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team
- Shadcn/ui
- MongoDB
- Cloudinary
- Brevo
