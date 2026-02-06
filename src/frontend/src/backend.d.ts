import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface VendorDashboardStats {
    totalSalesAmount: bigint;
    outletStatus: OutletStatus;
    outletName: string;
    walletDue: bigint;
}
export type Time = bigint;
export interface Category {
    id: string;
    name: string;
    image: ExternalBlob;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: bigint;
    customer: Principal;
    vendor: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Vendor {
    principal: Principal;
    verified: boolean;
    outletStatus: OutletStatus;
    name: string;
    outletName: string;
    walletDue: bigint;
}
export interface Review {
    comment: string;
    rating: bigint;
    reviewer: Principal;
}
export interface Product {
    id: string;
    active: boolean;
    name: string;
    ratings: Array<Review>;
    description: string;
    stock: bigint;
    vendor: Principal;
    discount?: bigint;
    category: string;
    price: bigint;
    images: Array<ExternalBlob>;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum OutletStatus {
    disabled = "disabled",
    enabled = "enabled"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: Category): Promise<void>;
    addItemToCart(productId: string, quantity: bigint): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addReview(productId: string, review: Review): Promise<void>;
    addToWishlist(productId: string): Promise<void>;
    addVendor(vendorPrincipal: Principal, vendor: Vendor): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrder(order: Order): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAnalytics(): Promise<{
        totalProducts: bigint;
        totalOrders: bigint;
        totalRevenue: bigint;
        totalVendors: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCategories(): Promise<Array<Category>>;
    getCategory(id: string): Promise<Category>;
    getCustomerOrders(): Promise<Array<Order>>;
    getOrder(orderId: string): Promise<Order>;
    getProduct(id: string): Promise<Product>;
    getProducts(sortBy: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendor(vendorPrincipal: Principal): Promise<Vendor | null>;
    getVendorDashboardStats(): Promise<VendorDashboardStats>;
    getVendorOrders(): Promise<Array<Order>>;
    getVendorProducts(): Promise<Array<Product>>;
    getVendors(): Promise<Array<Vendor>>;
    getWishlist(): Promise<Array<string>>;
    isCallerAdmin(): Promise<boolean>;
    isVendor(): Promise<boolean>;
    payCompany(): Promise<void>;
    removeCartItem(productId: string): Promise<void>;
    removeFromWishlist(productId: string): Promise<void>;
    removeVendor(vendorPrincipal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartQuantity(productId: string, quantity: bigint): Promise<void>;
    updateCategory(id: string, category: Category): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, product: Product): Promise<void>;
    updateVendor(vendorPrincipal: Principal, vendor: Vendor): Promise<void>;
}
