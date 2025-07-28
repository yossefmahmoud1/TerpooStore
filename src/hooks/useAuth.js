import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useToast } from "./use-toast";

// Hook for admin login
export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: authService.adminLogin,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast({
        title: "🎉 تم تسجيل الدخول بنجاح!",
        description: `مرحباً ${data.user.username}! تم تسجيل دخولك بنجاح إلى لوحة التحكم.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في تسجيل الدخول",
        description:
          error.message === "Invalid credentials"
            ? "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى."
            : "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook for admin logout
export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: authService.adminLogout,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("adminToken");

      // Clear all queries
      queryClient.clear();

      toast({
        title: "👋 تم تسجيل الخروج بنجاح!",
        description: "تم تسجيل خروجك من لوحة التحكم بنجاح.",
        variant: "default",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "⚠️ تحذير",
        description: "حدث خطأ أثناء تسجيل الخروج، لكن تم مسح بيانات الجلسة.",
        variant: "destructive",
        duration: 4000,
      });

      // Still clear local data even if API call fails
      localStorage.removeItem("adminToken");
      queryClient.clear();
    },
  });
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem("adminToken"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if token is invalid
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook to verify token
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["verifyToken"],
    queryFn: authService.verifyToken,
    enabled: !!localStorage.getItem("adminToken"),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if token is invalid
      if (error?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        return false;
      }
      return failureCount < 2;
    },
  });
};
