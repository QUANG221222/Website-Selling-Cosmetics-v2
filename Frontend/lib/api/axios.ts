import axios, { AxiosError, AxiosInstance } from "axios";
import { logoutUserApi } from "../redux/user/userSlice";
import { logoutAdminApi } from "../redux/admin/adminSlice";
import { toast } from "sonner";

let axiosReduxStore: any;
let isLoggingOut = false;

export const injectStore = (mainStore: any) => {
  axiosReduxStore = mainStore;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10 * 60 * 200, 
});

const PUBLIC_PATHS = ["/", "/product", "/cart", "/users/login", "/users/register", "/admin/login"];

const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith("/product/")
  );
};

const getRedirectUrl = (state: any): string => {
  const isAdmin = 
    state?.admin?.currentAdmin?.role === "admin" || 
    state?.admin?.isLoggedIn;
  return isAdmin ? "/admin/login" : "/users/login";
};

const handleLogout = async () => {
  if (isLoggingOut || !axiosReduxStore) return;
  
  isLoggingOut = true;

  try {
    const state = axiosReduxStore.getState?.() || {};
    const isAdmin = 
      state?.admin?.currentAdmin?.role === "admin" || 
      state?.admin?.isLoggedIn;

    // Dispatch logout action
    await axiosReduxStore.dispatch(
      isAdmin ? logoutAdminApi() : logoutUserApi()
    );

    // Clear storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root");
      sessionStorage.clear();
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut = false;
  }
};

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as any;

    // Handle 401 Unauthorized
    if (status === 401) {

      if (config?.headers?.["X-Skip-Auth-Redirect"]) {
        return Promise.reject(error);
      }

      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

       if (!isPublicPath(currentPath)) {
        const state = axiosReduxStore?.getState?.() || {};
        const redirectUrl = getRedirectUrl(state);

        // Show toast only once
        if (!isLoggingOut) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        }

        // Logout and redirect
        await handleLogout();
        
        if (typeof window !== "undefined") {
          // Use replace to prevent back button issues
          window.location.replace(redirectUrl);
        }
      }

      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests
    if (status === 429) {
      const retryAfter = error.response?.headers?.["retry-after"];
      const message = retryAfter 
        ? `Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter}s`
        : "Quá nhiều yêu cầu. Vui lòng thử lại sau";
      
      if (!config?.headers?.["X-No-Toast"]) {
        toast.error(message);
      }
      return Promise.reject(error);
    }

    // Handle other errors (400, 403, 404, 500, etc.)
    if (status && !config?.headers?.["X-No-Toast"]) {
      const data = error.response?.data as any;
      const errorMessage = data?.message || data?.error || error.message || "Đã xảy ra lỗi";
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
