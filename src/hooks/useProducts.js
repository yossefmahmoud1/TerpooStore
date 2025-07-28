import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useToast } from "./use-toast";

// Query keys for React Query
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
};

// Hook to get all products
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a single product by ID
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast({
        title: "✅ تم إضافة المنتج بنجاح!",
        description: `تم إضافة "${data.name}" إلى قاعدة البيانات بنجاح.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في إضافة المنتج",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook to update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      toast({
        title: "🔄 تم تحديث المنتج بنجاح!",
        description: `تم تحديث "${data.name}" بنجاح في قاعدة البيانات.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في تحديث المنتج",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast({
        title: "🗑️ تم حذف المنتج بنجاح!",
        description: "تم حذف المنتج من قاعدة البيانات بنجاح.",
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في حذف المنتج",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook to increment purchase count
export const useIncrementPurchaseCount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: productService.incrementPurchaseCount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: ["most-requested-products"] });
    },
    onError: (error) => {
      console.error("Failed to increment purchase count:", error);
    },
  });
};

// Hook to get most requested products
export const useMostRequestedProducts = () => {
  return useQuery({
    queryKey: ["most-requested-products"],
    queryFn: () => productService.getMostRequestedProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
