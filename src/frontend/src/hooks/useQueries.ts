import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, Category, CartItem, Order, UserProfile, Vendor, Review, UserRole__1, City, AnalyticsData } from '../backend';
import { OutletStatus, ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Role Queries - Using new three-role system (admin/vendor/customer)
export function useGetCallerRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole__1>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsVendor() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['isVendor'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isVendor();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useAssignAdminRole() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // The backend automatically assigns admin role to the first user
      // This mutation just triggers a refetch to update the UI
      if (!identity) throw new Error('Not authenticated');
      
      // Wait a moment to allow backend to process
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: async () => {
      // Invalidate and refetch role queries without touching actor
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['callerRole'] }),
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] }),
      ]);
      
      // Force refetch to ensure data is fresh
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['callerRole'] }),
        queryClient.refetchQueries({ queryKey: ['isAdmin'] }),
      ]);
    },
    onError: (error) => {
      console.error('Admin role check error:', error);
    },
  });
}

// Product Queries - Customer-facing uses getCustomerProducts
export function useGetProducts(sortBy: string = 'name') {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', sortBy],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Product }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
    },
  });
}

// Category Queries
export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

// Cart Queries
export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        return await actor.getCart();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Wishlist Queries
export function useGetWishlist() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        return await actor.getWishlist();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Order Queries
export function useGetCustomerOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['customerOrders'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        return await actor.getCustomerOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersByCity'] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['callerVendor'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    },
  });
}

// Vendor Queries
export function useGetVendorProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['vendorProducts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVendorProducts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVendorOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['vendorOrders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVendorOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerVendor() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Vendor | null>({
    queryKey: ['callerVendor'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerVendor();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useUpdateOutletProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      outletName,
      mobile,
      area,
      outletPhoto,
      city,
      gst,
    }: {
      name: string;
      outletName: string;
      mobile: string;
      area: string;
      outletPhoto: ExternalBlob;
      city: City;
      gst: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOutletProfile(name, outletName, mobile, area, outletPhoto, city, gst);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVendor'] });
    },
  });
}

// Admin Queries
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersByCity(city: City) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['ordersByCity', city],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getOrdersByCity(city);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllVendors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAnalyticsData();
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useApproveVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveVendor(vendorPrincipal);
    },
    onMutate: async (vendorPrincipal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['vendors'] });

      // Snapshot previous value
      const previousVendors = queryClient.getQueryData<Vendor[]>(['vendors']);

      // Optimistically update to the new value
      if (previousVendors) {
        queryClient.setQueryData<Vendor[]>(['vendors'], (old) =>
          old?.map((v) =>
            v.principal.toString() === vendorPrincipal.toString()
              ? { ...v, verified: true }
              : v
          ) || []
        );
      }

      return { previousVendors };
    },
    onError: (err, vendorPrincipal, context) => {
      // Rollback on error
      if (context?.previousVendors) {
        queryClient.setQueryData(['vendors'], context.previousVendors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useRejectVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectVendor(vendorPrincipal);
    },
    onMutate: async (vendorPrincipal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['vendors'] });

      // Snapshot previous value
      const previousVendors = queryClient.getQueryData<Vendor[]>(['vendors']);

      // Optimistically remove vendor from list
      if (previousVendors) {
        queryClient.setQueryData<Vendor[]>(['vendors'], (old) =>
          old?.filter((v) => v.principal.toString() !== vendorPrincipal.toString()) || []
        );
      }

      return { previousVendors };
    },
    onError: (err, vendorPrincipal, context) => {
      // Rollback on error
      if (context?.previousVendors) {
        queryClient.setQueryData(['vendors'], context.previousVendors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useSetVendorOutletStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorPrincipal, status }: { vendorPrincipal: Principal; status: OutletStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setVendorOutletStatus(vendorPrincipal, status);
    },
    onMutate: async ({ vendorPrincipal, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['vendors'] });

      // Snapshot previous value
      const previousVendors = queryClient.getQueryData<Vendor[]>(['vendors']);

      // Optimistically update outlet status
      if (previousVendors) {
        queryClient.setQueryData<Vendor[]>(['vendors'], (old) =>
          old?.map((v) =>
            v.principal.toString() === vendorPrincipal.toString()
              ? { ...v, outletStatus: status }
              : v
          ) || []
        );
      }

      return { previousVendors };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousVendors) {
        queryClient.setQueryData(['vendors'], context.previousVendors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useMarkVendorAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markVendorAsPaid(vendorPrincipal);
    },
    onMutate: async (vendorPrincipal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['vendors'] });

      // Snapshot previous value
      const previousVendors = queryClient.getQueryData<Vendor[]>(['vendors']);

      // Optimistically update wallet and outlet status
      if (previousVendors) {
        queryClient.setQueryData<Vendor[]>(['vendors'], (old) =>
          old?.map((v) =>
            v.principal.toString() === vendorPrincipal.toString()
              ? { ...v, walletDue: BigInt(0), outletStatus: OutletStatus.enabled }
              : v
          ) || []
        );
      }

      return { previousVendors };
    },
    onError: (err, vendorPrincipal, context) => {
      // Rollback on error
      if (context?.previousVendors) {
        queryClient.setQueryData(['vendors'], context.previousVendors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['callerVendor'] });
    },
  });
}

export function useGetVendorDocuments(vendorPrincipal: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob[]>({
    queryKey: ['vendorDocuments', vendorPrincipal.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVendorDocuments(vendorPrincipal);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && vendorPrincipal.toString() !== Principal.anonymous().toString(),
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorPrincipal, vendor }: { vendorPrincipal: Principal; vendor: Vendor }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateVendor(vendorPrincipal, vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['callerVendor'] });
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, review }: { productId: string; review: Review }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(productId, review);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersByCity'] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['callerVendor'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
