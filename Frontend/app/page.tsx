"use client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HomePage from "@/components/layout/Homepage";
import UserAccount from "@/app/(shop)/profile/page";
import ProductPage from "@/app/(shop)/product/page";
import ShoppingCart from "@/app/(shop)/cart/page";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/constans";
import { usePathname } from "next/navigation";

const tabContent: Record<string, React.ReactNode> = {
  "/": <HomePage />,
  "/profile": <UserAccount />,
  "/product": <ProductPage />,
  "/cart": <ShoppingCart />,
  // Thêm các route khác nếu có
};

export default function Home() {
  const pathname = usePathname();
  const currentTab =
    NAV_ITEMS.find((tab) => tab.href === pathname) || NAV_ITEMS[0];
  const [selectedTab, setSelectedTab] = useState(currentTab);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [pathname]);

  return (
    <>
      <Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main style={{ minHeight: 80 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.href}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "relative" }}
          >
            {tabContent[selectedTab.href] || <div>Không có nội dung</div>}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
