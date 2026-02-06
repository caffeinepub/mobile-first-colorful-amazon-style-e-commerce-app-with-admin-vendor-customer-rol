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
export type Time = bigint;
export interface Discount {
    code: string;
    vendor?: Principal;
    percentage: bigint;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
    price: bigint;
}
export interface Category {
    id: string;
    name: string;
    image: ExternalBlob;
}
export interface AnalyticsData {
    totalOrders: bigint;
    totalCommission: bigint;
    totalSales: bigint;
    totalVendors: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: bigint;
    customer: Principal;
    city: City;
    commissionApplied: boolean;
    vendor: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface PublicVendorProfile {
    principal: Principal;
    verified: boolean;
    outletStatus: OutletStatus;
    area: string;
    city: City;
    name: string;
    storeCategory: StoreCategory;
    outletPhoto: ExternalBlob;
    outletName: string;
    mobile: string;
}
export interface VendorApplication {
    gst?: string;
    principal: Principal;
    documents: Array<ExternalBlob>;
    area: string;
    city: City;
    name: string;
    storeCategory: StoreCategory;
    aadhaar: string;
    outletPhoto: ExternalBlob;
    outletName: string;
    timestamp: Time;
    mobile: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Vendor {
    gst?: string;
    principal: Principal;
    verified: boolean;
    documents: Array<ExternalBlob>;
    outletStatus: OutletStatus;
    area: string;
    city: City;
    name: string;
    storeCategory: StoreCategory;
    aadhaar: string;
    outletPhoto: ExternalBlob;
    outletName: string;
    mobile: string;
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
export enum City {
    other = "other",
    unnao = "unnao",
    kanpur = "kanpur"
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
export enum StoreCategory {
    cosmeticStore = "cosmeticStore",
    groceryStore = "groceryStore",
    clothStore = "clothStore"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserRole__1 {
    admin = "admin",
    customer = "customer",
    vendor = "vendor"
}
export interface backendInterface {
    addCategory(category: Category): Promise<void>;
    addDiscount(discount: Discount): Promise<void>;
    addOrUpdateVendor(vendorPrincipal: Principal, vendor: Vendor): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addReview(productId: string, review: Review): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    addToWishlist(productId: string): Promise<void>;
    applyAsVendor(application: VendorApplication): Promise<void>;
    approveVendor(vendorPrincipal: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrder(order: Order): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getAnalyticsData(): Promise<AnalyticsData>;
    getCallerRole(): Promise<UserRole__1>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerVendor(): Promise<Vendor | null>;
    getCart(): Promise<Array<CartItem>>;
    getCustomerOrders(): Promise<Array<Order>>;
    getCustomerProducts(): Promise<Array<Product>>;
    getDiscounts(): Promise<Array<Discount>>;
    getOrdersByCity(city: City): Promise<Array<Order>>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<Order>>;
    getOutletProfile(): Promise<Vendor>;
    getOutletsByCity(city: City): Promise<Array<PublicVendorProfile>>;
    getOutletsByName(name: string): Promise<Array<PublicVendorProfile>>;
    getOutletsByStoreCategory(category: StoreCategory): Promise<Array<PublicVendorProfile>>;
    getProduct(productId: string): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendorApplications(): Promise<Array<VendorApplication>>;
    getVendorDocuments(vendorPrincipal: Principal): Promise<Array<ExternalBlob>>;
    getVendorOrders(): Promise<Array<Order>>;
    getVendorProducts(): Promise<Array<Product>>;
    getWishlist(): Promise<Array<string>>;
    isCallerAdmin(): Promise<boolean>;
    isVendor(): Promise<boolean>;
    markVendorAsPaid(vendorPrincipal: Principal): Promise<void>;
    rejectVendor(vendorPrincipal: Principal): Promise<void>;
    removeFromCart(productId: string): Promise<void>;
    removeFromWishlist(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setVendorOutletStatus(vendorPrincipal: Principal, status: OutletStatus): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateOutletProfile(name: string, outletName: string, mobile: string, area: string, outletPhoto: ExternalBlob, city: City, gst: string | null, storeCategory: StoreCategory): Promise<void>;
    updateProduct(productId: string, product: Product): Promise<void>;
}
