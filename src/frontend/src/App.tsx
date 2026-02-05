import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryListingPage from './pages/CategoryListingPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import WishlistPage from './pages/customer/WishlistPage';
import OrdersPage from './pages/customer/OrdersPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorProductsPage from './pages/vendor/VendorProductsPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminVendorsPage from './pages/admin/AdminVendorsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import RequireRole from './components/auth/RequireRole';
import CustomerLoginPage from './pages/onboarding/CustomerLoginPage';
import VendorLoginPage from './pages/onboarding/VendorLoginPage';
import VendorListPage from './pages/onboarding/VendorListPage';
import VendorShopPage from './pages/onboarding/VendorShopPage';
import OutletDetailsPage from './pages/onboarding/OutletDetailsPage';
import SimpleVendorDashboardPage from './pages/onboarding/SimpleVendorDashboardPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesPage,
});

const categoryListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories/$categoryId',
  component: CategoryListingPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <RequireRole requiredRole="user">
      <CustomerProfilePage />
    </RequireRole>
  ),
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: () => (
    <RequireRole requiredRole="user">
      <WishlistPage />
    </RequireRole>
  ),
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: () => (
    <RequireRole requiredRole="user">
      <OrdersPage />
    </RequireRole>
  ),
});

const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor',
  component: () => (
    <RequireRole requiredRole="vendor">
      <VendorDashboardPage />
    </RequireRole>
  ),
});

const vendorProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor/products',
  component: () => (
    <RequireRole requiredRole="vendor">
      <VendorProductsPage />
    </RequireRole>
  ),
});

const vendorOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor/orders',
  component: () => (
    <RequireRole requiredRole="vendor">
      <VendorOrdersPage />
    </RequireRole>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireRole requiredRole="admin">
      <AdminDashboardPage />
    </RequireRole>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <RequireRole requiredRole="admin">
      <AdminProductsPage />
    </RequireRole>
  ),
});

const adminVendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/vendors',
  component: () => (
    <RequireRole requiredRole="admin">
      <AdminVendorsPage />
    </RequireRole>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <RequireRole requiredRole="admin">
      <AdminOrdersPage />
    </RequireRole>
  ),
});

const customerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-login',
  component: CustomerLoginPage,
});

const vendorLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor-login',
  component: VendorLoginPage,
});

const vendorListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor-list',
  component: VendorListPage,
});

const vendorShopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor-shop/$vendorId',
  component: VendorShopPage,
});

const outletDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/outlet-details',
  component: OutletDetailsPage,
});

const simpleVendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor-dashboard',
  component: SimpleVendorDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoriesRoute,
  categoryListingRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  aboutRoute,
  contactRoute,
  profileRoute,
  wishlistRoute,
  ordersRoute,
  vendorDashboardRoute,
  vendorProductsRoute,
  vendorOrdersRoute,
  adminDashboardRoute,
  adminProductsRoute,
  adminVendorsRoute,
  adminOrdersRoute,
  customerLoginRoute,
  vendorLoginRoute,
  vendorListRoute,
  vendorShopRoute,
  outletDetailsRoute,
  simpleVendorDashboardRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
