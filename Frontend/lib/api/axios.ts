import axios, { AxiosError, AxiosInstance } from "axios";
import { logoutUserApi } from "../redux/user/userSlice";
import { logoutAdminApi } from "../redux/admin/adminSlice";
import { toast } from "sonner";

//Inject store to import redux store in non-component
let axiosReduxStore: any;

export const injectStore = (mainStore: any) => {
  axiosReduxStore = mainStore;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10 * 60 * 1000, // 10 minutes
});

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.log(
      "❌ Axios interceptor - ERROR:",
      error.response?.status,
      error.response?.data
    ); // Debug

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const config = error.config as any;

      // Check if this is a "silent" auth check (like fetchCurrentUser on page load)
      // Don't redirect or show toast for these
      if (config?.headers?.["X-Skip-Auth-Redirect"]) {
        return Promise.reject(error);
      }

      // Check current path - don't redirect if already on public pages
      const publicPaths = ["/", "/product", "/users/login", "/users/register"];
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isPublicPage = publicPaths.some(
        (path) => currentPath === path || currentPath.startsWith("/product/")
      );

      // Only show toast and redirect if user is trying to access protected resources
      if (!isPublicPage) {
        // Clear user data in Redux store
        if (axiosReduxStore) {
          const state =
            typeof axiosReduxStore.getState === "function"
              ? axiosReduxStore.getState()
              : {};
          const role =
            state?.user?.currentUser?.role ||
            state?.auth?.user?.role ||
            state?.admin?.currentAdmin?.role ||
            null;
          const isAdmin = role === "admin" || !!state?.admin?.isLoggedIn;

          toast.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn để tiếp tục!");
          try {
            if (isAdmin) {
              axiosReduxStore.dispatch(logoutAdminApi());
            } else {
              axiosReduxStore.dispatch(logoutUserApi());
            }
          } catch (e) {
            axiosReduxStore.dispatch(logoutUserApi());
          }
        }

        // Redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("persist:root");
          sessionStorage.clear();
          setTimeout(() => {
            window.location.href = "/users/login";
          }, 2000);
        }
      }
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      toast.error("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    // Handle other errors (400, 403, 404, 500, etc.)
    if (error.response?.status && error.response.status !== 401) {
      let errorMessage = error.message;

      if (error.response?.data) {
        const data = error.response.data as any;
        errorMessage = data.message || data.error || errorMessage;
      }

      // Only show toast for errors that aren't handled elsewhere
      if (errorMessage && !error.config?.headers?.["X-No-Toast"]) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
