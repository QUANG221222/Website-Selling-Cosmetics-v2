"use client";
import { NAV_ITEMS } from "@/lib/constans";
import { motion } from "motion/react";

type NavItemsProps = {
  selectedTab: (typeof NAV_ITEMS)[0];
  setSelectedTab: (tab: (typeof NAV_ITEMS)[0]) => void;
};

const NavItems = ({ selectedTab, setSelectedTab }: NavItemsProps) => {
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium relative">
      {NAV_ITEMS.map((item) => (
        <li
          key={item.href}
          className="relative"
          style={{ position: "relative" }}
        >
          <button
            type="button"
            onClick={() => setSelectedTab(item)}
            className={`block w-full text-left py-2 font-inter transition-colors hover:text-brand-deep-pink cursor-pointer bg-transparent outline-none border-none ${
              selectedTab?.href === item.href
                ? "text-brand-deep-pink font-medium"
                : "text-foreground"
            }`}
            style={{ position: "relative" }}
          >
            {item.label}
            {selectedTab?.href === item.href && (
              <motion.div
                layoutId="nav-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-brand-deep-pink rounded"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
