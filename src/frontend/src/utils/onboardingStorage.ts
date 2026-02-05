interface CustomerLoginData {
  name: string;
  mobile: string;
  city: string;
  area: string;
  pinCode: string;
}

interface VendorLoginData {
  name: string;
  mobile: string;
  city: string;
  area: string;
  pinCode: string;
}

interface OutletDetailsData {
  outletName: string;
  outletMobile: string;
  aadharNumber: string;
  gst: string;
  photoPreviewUrl: string;
}

const CUSTOMER_LOGIN_KEY = 'onboarding_customer_login';
const VENDOR_LOGIN_KEY = 'onboarding_vendor_login';
const OUTLET_DETAILS_KEY = 'onboarding_outlet_details';

export function saveCustomerLoginData(data: CustomerLoginData): void {
  try {
    sessionStorage.setItem(CUSTOMER_LOGIN_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save customer login data:', error);
  }
}

export function getCustomerLoginData(): CustomerLoginData | null {
  try {
    const data = sessionStorage.getItem(CUSTOMER_LOGIN_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get customer login data:', error);
    return null;
  }
}

export function saveVendorLoginData(data: VendorLoginData): void {
  try {
    sessionStorage.setItem(VENDOR_LOGIN_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save vendor login data:', error);
  }
}

export function getVendorLoginData(): VendorLoginData | null {
  try {
    const data = sessionStorage.getItem(VENDOR_LOGIN_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get vendor login data:', error);
    return null;
  }
}

export function saveOutletDetailsData(data: OutletDetailsData): void {
  try {
    sessionStorage.setItem(OUTLET_DETAILS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save outlet details data:', error);
  }
}

export function getOutletDetailsData(): OutletDetailsData | null {
  try {
    const data = sessionStorage.getItem(OUTLET_DETAILS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get outlet details data:', error);
    return null;
  }
}

export function clearOnboardingData(): void {
  try {
    sessionStorage.removeItem(CUSTOMER_LOGIN_KEY);
    sessionStorage.removeItem(VENDOR_LOGIN_KEY);
    sessionStorage.removeItem(OUTLET_DETAILS_KEY);
  } catch (error) {
    console.error('Failed to clear onboarding data:', error);
  }
}
