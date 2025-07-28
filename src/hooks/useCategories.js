import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { useToast } from "./use-toast";

// Query keys for React Query
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), filters],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

// Hook to get all categories
export const useCategories = (filters = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a single category by ID
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast({
        title: "✅ تم إنشاء الفئة بنجاح!",
        description: `تم إضافة فئة "${data.name}" إلى قاعدة البيانات بنجاح.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في إنشاء الفئة",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء إنشاء الفئة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook to update a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      toast({
        title: "🔄 تم تحديث الفئة بنجاح!",
        description: `تم تحديث فئة "${data.name}" بنجاح في قاعدة البيانات.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في تحديث الفئة",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء تحديث الفئة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: (data, categoryId) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(categoryId) });
      toast({
        title: "🗑️ تم حذف الفئة بنجاح!",
        description: `تم حذف الفئة من قاعدة البيانات بنجاح.`,
        variant: "default",
        duration: 4000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في حذف الفئة",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء حذف الفئة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
};
