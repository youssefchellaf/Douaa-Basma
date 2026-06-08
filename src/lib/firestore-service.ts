import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { PRODUCTS, APP_COUPONS } from "../data/products.ts";

// Load configuration gracefully
const configPath = path.resolve("./firebase-applet-config.json");
let db: any = null;
let auth: any = null;

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (config && config.apiKey) {
      const firebaseApp = initializeApp(config);
      db = getFirestore(firebaseApp, config.firestoreDatabaseId);
      auth = getAuth(firebaseApp);
      console.log("Firebase initialized successfully from config file.");
    }
  } catch (error) {
    console.error("Failed to parse firebase-applet-config.json. Defaulting to standalone local mode.", error);
  }
} else {
  console.log("firebase-applet-config.json not found. Operating in local storage mode.");
}

export { db, auth };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
  const defaultSettings = getLocalFallback("site_settings.json") || {
    logoUrl: "https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd",
    heroBannerUrl: "",
    heroBannerMobileUrl: "",
    faviconUrl: "https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd",
    heroTitle: "مذاق طبيعي…",
    heroSubTitle: "بلمسة حب",
    heroDescription: "نحضر لكم أفخر وأجود العصائر الطبيعية الباردة والتحليات المنزلية الأصيلة، بمكونات طازجة مختارة بعناية وبمعايير تليق بكرم الضيافة ورفاهية أهليكم",
    promoBadgeText: "مشروع نسائي منزلي فاخر 100%",
    storeName: "Douaa & Basma",
    storeDescription: "أرقى مشروع محلي مغربي لتقديم العصائر و التحليات المنزلية. و نسعى دائماً لترك بصمة من المتعة والفرح بمناسباتكم الخاصة والعامة.",
    aboutTitle: "من نحن - Douaa & Basma",
    aboutHeroText: "مرحبًا بكم في عالم النكهات الفاخرة والطبيعية 100%",
    aboutMainText: "Douaa & Basma هو مشروع نسائي مغربي شغوف ومتخصص في تحضير العصائر الطبيعية والتحليات المنزلية الراقية. نقدم لكم تشكيلة مختارة من المنتجات المعدة بمكونات طازجة منتقاة حبة بحبة، لنصنع تجربة فريدة تمزج بين الفخامة والأصالة المغربية.",
    whatsappNumber: "212705908383",
    whatsappMessageTemplate: "طلب جديد من متجر Douaa & Basma",
    instagramUrl: "https://instagram.com/douaabasma_1",
    facebookUrl: "https://m.facebook.com/douaabasma01/",
    footerCredits: "جميع الحقوق محفوظة لعلامة",
    aboutPath: "/about-us",
    deliveryPath: "/delivery",
    contactPath: "/contact-us",
    trackPath: "/track",
    adminPath: "/admin",
    homePath: "/"
  };

  try {
    if (db) {
      const docRef = doc(db, "settings", "site");
      let snapshot;
      try {
        snapshot = await getDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "settings/site");
        throw err;
      }
      if (snapshot.exists()) {
        return snapshot.data();
      } else {
        console.log("Seeding site settings to newly provisioned Firestore database...");
        try {
          await setDoc(docRef, defaultSettings);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, "settings/site");
          throw err;
        }
        return defaultSettings;
      }
    }
  } catch (error) {
    console.error("Error reading site settings from Firestore:", error);
  }
  
  // Return local fallback with premium defaults matching the Moroccan project Douaa & Basma
  return defaultSettings;
}

export async function saveSiteSettings(settings: any): Promise<boolean> {
  try {
    if (db) {
      const docRef = doc(db, "settings", "site");
      try {
        await setDoc(docRef, settings);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, "settings/site");
        throw err;
      }
      return true;
    }
  } catch (error) {
    console.error("Error saving site settings to Firestore:", error);
  }
  
  // Write locally as backup
  try {
    fs.writeFileSync(path.join(DATA_DIR, "site_settings.json"), JSON.stringify(settings, null, 2), "utf-8");
    return true;
  } catch (_) {}
  return false;
}

// 2. Products Operations
export async function getProducts(): Promise<any[]> {
  try {
    if (db) {
      // Check seeded flag
      const seedDocRef = doc(db, "settings", "status");
      let seedSnapshot;
      try {
        seedSnapshot = await getDoc(seedDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "settings/status");
        throw err;
      }
      const isSeeded = seedSnapshot.exists() && seedSnapshot.data()?.productsSeeded;

      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, "products"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "products");
        throw err;
      }
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });

      if (list.length > 0) {
        // Sort by id
        return list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
      } else if (!isSeeded) {
        // Seed products into newly provisioned Firestore database
        const defaultProducts = getLocalFallback("products.json") || PRODUCTS || [];
        if (defaultProducts.length > 0) {
          console.log("Seeding default products to Firestore database...");
          for (const product of defaultProducts) {
            if (!product || !product.id) continue;
            const docRef = doc(db, "products", String(product.id));
            try {
              await setDoc(docRef, product);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
              throw err;
            }
          }
        }
        try {
          await setDoc(seedDocRef, { productsSeeded: true }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, "settings/status");
          throw err;
        }
        return defaultProducts;
      } else {
        // Purposively empty by administrator
        return [];
      }
    }
  } catch (error) {
    console.error("Error reading products from Firestore:", error);
  }

  // Seeding check for local file mode
  const localList = getLocalFallback("products.json");
  if (localList) {
    return localList;
  }

  return PRODUCTS || [];
}

export async function saveProducts(products: any[]): Promise<boolean> {
  try {
    if (db) {
      // Mark seeded status so it never auto-seeds again
      const seedDocRef = doc(db, "settings", "status");
      try {
        await setDoc(seedDocRef, { productsSeeded: true }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, "settings/status");
        throw err;
      }

      // 1. Fetch current document IDs from the "products" collection in Firestore
      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, "products"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "products");
        throw err;
      }
      const existingIds = new Set<string>();
      querySnapshot.forEach((doc) => {
        existingIds.add(doc.id);
      });

      // 2. Determine active IDs in the updated list
      const activeIds = new Set(products.map(p => String(p.id)));

      // 3. Delete any documents that are no longer present in the updated list
      for (const id of existingIds) {
        if (!activeIds.has(id)) {
          const docRef = doc(db, "products", id);
          try {
            await deleteDoc(docRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
            throw err;
          }
        }
      }

      // 4. Update or recreate the active products
      for (const product of products) {
        if (!product || !product.id) continue;
        const docRef = doc(db, "products", String(product.id));
        try {
          await setDoc(docRef, product);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
          throw err;
        }
      }
      return true;
    }
  } catch (error) {
    console.error("Error saving products to Firestore:", error);
  }
  
  try {
    fs.writeFileSync(path.join(DATA_DIR, "products.json"), JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (_) {}
  return false;
}

// 3. Coupons Operations
export async function getCoupons(): Promise<any[]> {
  try {
    if (db) {
      // Check seeded flag
      const seedDocRef = doc(db, "settings", "status");
      let seedSnapshot;
      try {
        seedSnapshot = await getDoc(seedDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "settings/status");
        throw err;
      }
      const isSeeded = seedSnapshot.exists() && seedSnapshot.data()?.couponsSeeded;

      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, "coupons"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "coupons");
        throw err;
      }
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });

      if (list.length > 0) {
        return list;
      } else if (!isSeeded) {
        // Seed default coupons to database
        const defaultCoupons = getLocalFallback("coupons.json") || APP_COUPONS || [];
        if (defaultCoupons.length > 0) {
          console.log("Seeding default coupons to Firestore database...");
          for (const coupon of defaultCoupons) {
            if (!coupon || !coupon.code) continue;
            const docRef = doc(db, "coupons", String(coupon.code).toUpperCase().trim());
            try {
              await setDoc(docRef, coupon);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.code}`);
              throw err;
            }
          }
        }
        try {
          await setDoc(seedDocRef, { couponsSeeded: true }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, "settings/status");
          throw err;
        }
        return defaultCoupons;
      } else {
        // Purposively empty by administrator
        return [];
      }
    }
  } catch (error) {
    console.error("Error reading coupons from Firestore:", error);
  }

  const localCoupons = getLocalFallback("coupons.json");
  if (localCoupons) {
    return localCoupons;
  }

  return APP_COUPONS || [];
}

export async function saveCoupons(coupons: any[]): Promise<boolean> {
  try {
    if (db) {
      // Mark seeded status so it never auto-seeds again
      const seedDocRef = doc(db, "settings", "status");
      try {
        await setDoc(seedDocRef, { couponsSeeded: true }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, "settings/status");
        throw err;
      }

      // 1. Fetch current coupon codes from Firestore
      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, "coupons"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "coupons");
        throw err;
      }
      const existingCodes = new Set<string>();
      querySnapshot.forEach((doc) => {
        existingCodes.add(doc.id);
      });

      // 2. Determine active coupon codes in updated list
      const activeCodes = new Set(coupons.map(c => String(c.code).toUpperCase().trim()));

      // 3. Delete any coupons no longer present in the updated list
      for (const code of existingCodes) {
        if (!activeCodes.has(code)) {
          const docRef = doc(db, "coupons", code);
          try {
            await deleteDoc(docRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `coupons/${code}`);
            throw err;
          }
        }
      }

      // 4. Update or recreate the active coupons
      for (const coupon of coupons) {
        if (!coupon || !coupon.code) continue;
        const docRef = doc(db, "coupons", String(coupon.code).toUpperCase().trim());
        try {
          await setDoc(docRef, coupon);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.code}`);
          throw err;
        }
      }
      return true;
    }
  } catch (error) {
    console.error("Error saving coupons to Firestore:", error);
  }
  
  try {
    fs.writeFileSync(path.join(DATA_DIR, "coupons.json"), JSON.stringify(coupons, null, 2), "utf-8");
    return true;
  } catch (_) {}
  return false;
}

// 4. Orders Operations
export async function getOrders(): Promise<any[]> {
  try {
    if (db) {
      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, "orders"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "orders");
        throw err;
      }
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      if (list.length > 0) {
        // Sort by date or id descending
        return list.sort((a, b) => b.id.localeCompare(a.id));
      }
    }
  } catch (error) {
    console.error("Error reading orders from Firestore:", error);
  }

  return getLocalFallback("orders.json") || [];
}

export async function saveOrders(orders: any[]): Promise<boolean> {
  try {
    if (db) {
      for (const order of orders) {
        if (!order || !order.id) continue;
        const docRef = doc(db, "orders", String(order.id));
        try {
          await setDoc(docRef, order);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `orders/${order.id}`);
          throw err;
        }
      }
      return true;
    }
  } catch (error) {
    console.error("Error saving orders to Firestore:", error);
  }
  
  try {
    fs.writeFileSync(path.join(DATA_DIR, "orders.json"), JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch (_) {}
  return false;
}
