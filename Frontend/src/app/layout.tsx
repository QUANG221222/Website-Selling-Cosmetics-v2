import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { Toaster } from '../components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BeautyShop - Mỹ phẩm cao cấp',
  description: 'Khám phá bộ sưu tập mỹ phẩm cao cấp với thiết kế hiện đại và chất lượng tốt nhất',
  keywords: ['mỹ phẩm', 'beauty', 'cosmetics', 'skincare', 'makeup'],
  authors: [{ name: 'BeautyShop Team' }],
  openGraph: {
    title: 'BeautyShop - Mỹ phẩm cao cấp',
    description: 'Khám phá bộ sưu tập mỹ phẩm cao cấp với thiết kế hiện đại và chất lượng tốt nhất',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}