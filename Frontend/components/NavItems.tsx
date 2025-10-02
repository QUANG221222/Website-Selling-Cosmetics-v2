'use client';
import { NAV_ITEMS } from "@/lib/constans"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = () => {
  const pathname = usePathname();

  const isActive = (path : string) => {
    if ( path === '/') return pathname === '/';

    return pathname.startsWith(path)
  }
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map(({ href, label}) => (
        <li key={href}>
          <Link href={href} className={`sm:block sm:w-full sm:text-left sm:py-2 font-inter transition-colors hover:text-brand-deep-pink ${
            isActive(href) ? 'text-brand-deep-pink font-medium'  : 'text-foreground'
          }`}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems