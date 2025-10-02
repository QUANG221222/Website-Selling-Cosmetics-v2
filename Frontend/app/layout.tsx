import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globals.css";


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
        {children}
      </body>
    </html>
  );
}
