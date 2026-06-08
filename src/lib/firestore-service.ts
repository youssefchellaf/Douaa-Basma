import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration
const configPath = path.resolve("./firebase-applet-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Initialize Firebase client-side SDK on the server-side to allow rules-based standard gRPC calls
const firebaseApp = initializeApp(config);
export const db = getFirestore(firebaseApp, config.firestoreDatabaseId);

// Core default paths
const DATA_DIR = path.resolve("./data");

function getLocalFallback(filename: string): any {
  const filePath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (e) {
      console.error(`Error reading fallback local file ${filename}:`, e);
    }
  }
  return null;
}

// 1. Site Settings Operations
export async function getSiteSettings(): Promise<any> {
  try {
    const docRef = doc(db, "settings", "site");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
  } catch (error) {
    console.error("Error reading site settings from Firestore:", error);
  }
  
  // Return local fallback
  return getLocalFallback("site_settings.json") || {
    phoneNumber: "966500000000",
    address: "المنطقة الشرقية، المملكة العربية السعودية",
    workingHours: "من 4:00 عصراً إلى 11:30 مساءً",
    facebookUrl: "",
    instagramUrl: "https://instagram.com",
    whatsappNumber: "966500000000"
  };
}

export async function saveSiteSettings(settings: any): Promise<boolean> {
  try {
    const docRef = doc(db, "settings", "site");
    await setDoc(docRef, settings);
    return true;
  } catch (error) {
    console.error("Error saving site settings to Firestore:", error);
    // Write locally as backup
    try {
      fs.writeFileSync(path.join(DATA_DIR, "site_settings.json"), JSON.stringify(settings, null, 2), "utf-8");
    } catch (_) {}
    return false;
  }
}

// 2. Products Operations
export async function getProducts(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    if (list.length > 0) {
      // Sort by id
      return list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
    }
  } catch (error) {
    console.error("Error reading products from Firestore:", error);
  }

  // Seeding check
  const localList = getLocalFallback("products.json");
  if (localList && localList.length > 0) {
    return localList;
  }

  return [];
}

export async function saveProducts(products: any[]): Promise<boolean> {
  try {
    // Overwriting the collection. In Firestore, we set each item by its ID.
    // First, clear old ones or batch update.
    for (const product of products) {
      if (!product || !product.id) continue;
      const docRef = doc(db, "products", String(product.id));
      await setDoc(docRef, product);
    }
    return true;
  } catch (error) {
    console.error("Error saving products to Firestore:", error);
    try {
      fs.writeFileSync(path.join(DATA_DIR, "products.json"), JSON.stringify(products, null, 2), "utf-8");
    } catch (_) {}
    return false;
  }
}

// 3. Coupons Operations
export async function getCoupons(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    if (list.length > 0) {
      return list;
    }
  } catch (error) {
    console.error("Error reading coupons from Firestore:", error);
  }

  return getLocalFallback("coupons.json") || [];
}

export async function saveCoupons(coupons: any[]): Promise<boolean> {
  try {
    for (const coupon of coupons) {
      if (!coupon || !coupon.code) continue;
      const docRef = doc(db, "coupons", String(coupon.code).toUpperCase().trim());
      await setDoc(docRef, coupon);
    }
    return true;
  } catch (error) {
    console.error("Error saving coupons to Firestore:", error);
    try {
      fs.writeFileSync(path.join(DATA_DIR, "coupons.json"), JSON.stringify(coupons, null, 2), "utf-8");
    } catch (_) {}
    return false;
  }
}

// 4. Orders Operations
export async function getOrders(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    if (list.length > 0) {
      // Sort by date or id descending
      return list.sort((a, b) => b.id.localeCompare(a.id));
    }
  } catch (error) {
    console.error("Error reading orders from Firestore:", error);
  }

  return getLocalFallback("orders.json") || [];
}

export async function saveOrders(orders: any[]): Promise<boolean> {
  try {
    for (const order of orders) {
      if (!order || !order.id) continue;
      const docRef = doc(db, "orders", String(order.id));
      await setDoc(docRef, order);
    }
    return true;
  } catch (error) {
    console.error("Error saving orders to Firestore:", error);
    try {
      fs.writeFileSync(path.join(DATA_DIR, "orders.json"), JSON.stringify(orders, null, 2), "utf-8");
    } catch (_) {}
    return false;
  }
}
