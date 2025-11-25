"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import { BarChart3, Users, ShoppingCart, Package, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./admin.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { logoutAdminApi, selectCurrentAdmin } from "@/lib/redux/admin/adminSlice";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const layout = ({children} : {children: React.ReactNode}) => {
    const menuItems = [
    { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "account", href: "/account", label: "Account", icon: Users },
    { id: "orders", href: "/order", label: "Order", icon: ShoppingCart },
    { id: "products", href: "/cosmetic", label: "Cosmetic", icon: Package },
    { id: "settings", href: "/setting", label: "Setting", icon: Settings },
  ];
  const pathname = usePathname()
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const currentAdmin = useSelector(selectCurrentAdmin);

  //Redirect if not logged in 
    useEffect(() => {
        if (!currentAdmin) {
            router.push('/admin/login');
        }
    }, [currentAdmin, router])

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await dispatch(logoutAdminApi());
            router.push('/admin/login');
        }
    }

    const getInitials = (name: string) => {
        return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Don't render if not logged in
    if (!currentAdmin) {
        return null;
    }

  return (
     <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border p-4 space-y-4">
            {/* Admin Info */}
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(currentAdmin?.data?.adminName || 'AD')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {currentAdmin?.data?.adminName || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentAdmin?.data?.email || ''}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="font-semibold">
                  {menuItems.find(item => item.id === pathname)?.label || "Dashboard"}
                </h1>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default layout
