import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner'
import ReduxProvider from "./ReduxProvider";
export const metadata: Metadata = {
  title: 'Beautify - Mỹ Phẩm Tự Nhiên',
  description: 'Cửa hàng mỹ phẩm an toàn, chất lượng từ thiên nhiên.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position="top-right" richColors expand={true}/>
      </body>
    </html>
  );
}
