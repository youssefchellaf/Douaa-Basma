import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, ArrowUpDown, ShoppingCart, Trash2, X, Plus, Minus, CheckCircle, 
  MessageSquare, Instagram, Facebook, Heart, ChevronLeft, Award, Sparkles, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, Phone, MessageCircle
} from 'lucide-react';

import { Product, CartItem, Order, Coupon, SiteSettings } from './types';
import { PRODUCTS, CATEGORIES, TESTIMONIALS, DELIVERY_ZONES, APP_COUPONS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Tracking } from './components/Tracking';
import { Admin } from './components/Admin';
import { InfoPages } from './components/InfoPages';

const getProductsLookup = (): Product[] => {
  try {
    const saved = localStorage.getItem('db_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const validated = parsed.filter(p => p && typeof p === 'object' && p.id);
        if (validated.length > 0) return validated;
      }
    }
  } catch (e) {
    console.error("Error loading lookup products:", e);
  }
  return PRODUCTS;
};

export default function App() {
  // --- STATE SYSTEM ---
  const [currentView, setCurrentView] = useState<string>('home');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const defaults = {
      logoUrl: "https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd",
      heroBannerUrl: "", // fallback to imported/def
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
      const saved = localStorage.getItem('db_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
    } catch (e) {
      console.error("Error loading db_site_settings:", e);
    }
    return defaults;
  });

  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    const updated = {
      ...newSettings,
      // Fallback path definitions if cleared
      aboutPath: newSettings.aboutPath || "/about-us",
      deliveryPath: newSettings.deliveryPath || "/delivery",
      contactPath: newSettings.contactPath || "/contact-us",
      trackPath: newSettings.trackPath || "/track",
      adminPath: newSettings.adminPath || "/admin",
      homePath: newSettings.homePath || "/"
    };

    // dynamically update the URL path in the history if the active view's path is updated
    let targetPath = '';
    if (currentView === 'about') targetPath = updated.aboutPath;
    else if (currentView === 'delivery') targetPath = updated.deliveryPath;
    else if (currentView === 'contact') targetPath = updated.contactPath;
    else if (currentView === 'track') targetPath = updated.trackPath;
    else if (currentView === 'admin') targetPath = updated.adminPath;
    else if (currentView === 'home') targetPath = updated.homePath;

    if (targetPath) {
      if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
      }
      try {
        const finalUrl = '#' + targetPath;
        if (window.location.hash !== finalUrl) {
          window.history.replaceState(null, '', finalUrl);
        }
      } catch (e) {
        console.error("Failed to update history state:", e);
      }
    }

    setSiteSettings(updated);
    saveToLocalStorage('db_site_settings', JSON.stringify(updated));
  };

  const handleSetView = (view: string) => {
    setCurrentView(view);
    setIsSidebarCartOpen(false);

    let targetPath = '';
    if (view === 'about') targetPath = siteSettings.aboutPath || '/about-us';
    else if (view === 'delivery') targetPath = siteSettings.deliveryPath || '/delivery';
    else if (view === 'contact') targetPath = siteSettings.contactPath || '/contact-us';
    else if (view === 'track') targetPath = siteSettings.trackPath || '/track';
    else if (view === 'admin') targetPath = siteSettings.adminPath || '/admin';
    else targetPath = siteSettings.homePath || '/';

    // Format targetPath correctly
    if (targetPath && !targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    try {
      const finalUrl = '#' + targetPath;
      if (window.location.hash !== finalUrl) {
        window.history.pushState(null, '', finalUrl);
      }
    } catch (e) {
      console.error("Failed to update history state:", e);
    }
  };

  // Listen to browser forward/back buttons and handle URL logic
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      const checkPath = (configuredPath: string | undefined, defaultVal: string) => {
        const val = configuredPath || defaultVal;
        
        // Clean paths: remove # and leading/trailing slashes
        const cleanConf = val.replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();
        const cleanPath = path.replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();
        const cleanHash = hash.replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();

        return cleanPath === cleanConf || cleanHash === cleanConf;
      };

      if (checkPath(siteSettings.aboutPath, 'about-us')) {
        setCurrentView('about');
      } else if (checkPath(siteSettings.deliveryPath, 'delivery')) {
        setCurrentView('delivery');
      } else if (checkPath(siteSettings.contactPath, 'contact-us')) {
        setCurrentView('contact');
      } else if (checkPath(siteSettings.trackPath, 'track')) {
        setCurrentView('track');
      } else if (checkPath(siteSettings.adminPath, 'admin')) {
        setCurrentView('admin');
        setIsAdminUnlocked(true);
        localStorage.setItem('db_admin_unlocked', 'true');
      } else {
        const cleanPath = path.replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();
        const cleanHash = hash.replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();
        const cleanHome = (siteSettings.homePath || '/').replace(/^#\/?|^[/#]+/, '').replace(/\/+$/, '').trim().toLowerCase();

        if (cleanPath === '' || cleanHash === '' || cleanPath === cleanHome || cleanHash === cleanHome) {
          setCurrentView('home');
        }
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [siteSettings]);

  useEffect(() => {
    if (siteSettings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings.faviconUrl]);

  useEffect(() => {
    if (siteSettings.storeName) {
      document.title = siteSettings.storeName;
    }
  }, [siteSettings.storeName]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [isSidebarCartOpen, setIsSidebarCartOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState<boolean>(false);

  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('db_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validated = parsed.filter(p => p && typeof p === 'object' && p.id && p.arabicName && p.price && p.image);
          const seenIds = new Set();
          const uniqueValidated = validated.filter(p => {
            if (seenIds.has(p.id)) return false;
            seenIds.add(p.id);
            return true;
          });
          if (uniqueValidated.length > 0) return uniqueValidated;
        }
      }
      return PRODUCTS;
    } catch (e) {
      console.error("Error reading db_products from localStorage:", e);
      return PRODUCTS;
    }
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('db_admin_unlocked') === 'true';
  });

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    localStorage.setItem('db_admin_unlocked', 'true');
    triggerToast('🎉 تم تفعيل لوحة التحكم السرية للمدير بنجاح! يمكنك تصفحها الآن من قائمة التنقل بالأعلى.', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('db_admin_unlocked');
    handleSetView('home');
  };

  const [footerClicks, setFooterClicks] = useState(0);
  const handleFooterSecretClick = () => {
    const nextClicks = footerClicks + 1;
    if (nextClicks >= 5) {
      handleUnlockAdmin();
      setFooterClicks(0);
    } else {
      setFooterClicks(nextClicks);
    }
    setTimeout(() => {
      setFooterClicks(0);
    }, 4000);
  };

  // Live Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const saveToLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn(`LocalStorage quota full when setting ${key}. Performing cleanup...`);
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && !k.startsWith('db_')) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => {
            localStorage.removeItem(k);
          });
          
          localStorage.setItem(key, value);
          console.log(`Saved ${key} successfully after cleanup.`);
          return;
        } catch (retryError) {
          console.error(`Cleanup did not resolve quota issue for ${key}:`, retryError);
        }
        
        // Emergency fallback for site settings: clear heavy base64 banners to salvage settings text
        if (key === 'db_site_settings') {
          try {
            const parsed = JSON.parse(value);
            if (parsed.heroBannerUrl && parsed.heroBannerUrl.startsWith('data:')) {
              parsed.heroBannerUrl = "";
            }
            if (parsed.heroBannerMobileUrl && parsed.heroBannerMobileUrl.startsWith('data:')) {
              parsed.heroBannerMobileUrl = "";
            }
            localStorage.setItem(key, JSON.stringify(parsed));
            triggerToast('⚠️ الذاكرة ممتلئة. تم حفظ الإعدادات بنجاح، ولكن تم إيقاف صور البانر الكبيرة لتفادي مشكلة المساحة. يرجى استخدام صور أصغر.', 'info');
            return;
          } catch (emergencyErr) {
            console.error("Emergency settings save failed:", emergencyErr);
          }
        }
        triggerToast('⚠️ عذراً، لم نتمكن من حفظ البيانات لامتلاء ذاكرة التخزين المحلية.', 'info');
      } else {
        console.error(`Failed to execute setItem for key "${key}":`, e);
      }
    }
  };

  // Perform a cleanup of external/stale localStorage keys on startup to ensure maximum quota
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && !k.startsWith('db_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => {
        localStorage.removeItem(k);
      });
    } catch (e) {
      console.error("Startup cache cleanup failed:", e);
    }
  }, []);

  // Local storage lists for persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('db_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const lookup = getProductsLookup();
          const restored = parsed.map((item: any) => {
            if (!item || typeof item !== 'object') return null;
            let prod: Product | null = null;
            const prodId = item.productId || (item.product && item.product.id);
            if (prodId) {
              prod = lookup.find(p => p.id === prodId) || PRODUCTS.find(p => p.id === prodId) || null;
            }
            if (!prod) return null;
            return {
              product: prod,
              quantity: typeof item.quantity === 'number' ? item.quantity : 1
            };
          }).filter((item): item is CartItem => item !== null);

          // Deduplicate by product ID
          const seenProductIds = new Set();
          const uniqueCartItems = restored.filter((item) => {
            if (seenProductIds.has(item.product.id)) {
              return false;
            }
            seenProductIds.add(item.product.id);
            return true;
          });
          return uniqueCartItems;
        }
      }
      return [];
    } catch (e) {
      console.error("Error reading db_cart from localStorage:", e);
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const defaultOrders: Order[] = [
      {
        id: "DB-74839",
        fullName: "أمينة المنصوري",
        phone: "0612345678",
        address: "إقامة الأندلس، شقة 5، طنجة",
        notes: "يرجى تقرير السكر في عصير برتقال طبيعي",
        deliveryArea: "وسط المدينة",
        deliveryCost: 5,
        items: [
          {product: PRODUCTS[0], quantity: 2}, // Zaza
          {product: PRODUCTS[8], quantity: 1}  // Flan
        ],
        subtotal: 65,
        total: 70,
        status: "delivered",
        date: "2026-05-20 18:30"
      },
      {
        id: "DB-49204",
        fullName: "ياسين التازي",
        phone: "0765432109",
        address: "حي كنديسة، فيلا 22، الفنيدق",
        notes: "زيادة اللوز على فلان كراميل",
        deliveryArea: "المناطق المجاورة",
        deliveryCost: 10,
        items: [
          {product: PRODUCTS[1], quantity: 2}, // Avocado
          {product: PRODUCTS[4], quantity: 1}  // Dragon
        ],
        subtotal: 75,
        total: 85,
        status: "preparing",
        date: "2026-05-21 02:15"
      }
    ];

    try {
      const saved = localStorage.getItem('db_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const lookup = getProductsLookup();
          const restored = parsed.map((order: any) => {
            if (!order || typeof order !== 'object' || !order.id || !Array.isArray(order.items)) return null;
            const restoredItems = order.items.map((item: any) => {
              if (!item || typeof item !== 'object') return null;
              let prod: Product | null = null;
              const prodId = item.productId || (item.product && item.product.id);
              if (prodId) {
                const found = lookup.find(p => p.id === prodId) || PRODUCTS.find(p => p.id === prodId);
                if (found) {
                  prod = {
                    ...found,
                    ...(item.product ? {
                      price: item.product.price,
                      arabicName: item.product.arabicName,
                      name: item.product.name
                    } : {})
                  };
                } else if (item.product) {
                  prod = item.product;
                  if (!prod.image) {
                    prod.image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60";
                  }
                }
              }
              if (!prod) return null;
              return {
                product: prod,
                quantity: typeof item.quantity === 'number' ? item.quantity : 1
              };
            }).filter((item: any): item is CartItem => item !== null);

            return {
              ...order,
              items: restoredItems
            };
          }).filter((order: any): order is Order => order !== null);

          // Deduplicate by order ID
          const seenOrderIds = new Set();
          const uniqueOrders = restored.filter((order) => {
            if (seenOrderIds.has(order.id)) {
              return false;
            }
            seenOrderIds.add(order.id);
            return true;
          });
          return uniqueOrders;
        }
      }
    } catch (e) {
      console.error("Error reading db_orders from localStorage:", e);
    }
    
    return defaultOrders;
  });

  const [myPlacedOrderIds, setMyPlacedOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('db_my_placed_order_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error reading db_my_placed_order_ids from localStorage:", e);
      return [];
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('db_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => c && typeof c === 'object' && c.code && typeof c.discountPercent === 'number');
        }
      }
      return APP_COUPONS;
    } catch (e) {
      console.error("Error reading db_coupons from localStorage:", e);
      return APP_COUPONS;
    }
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // --- PERSISTENCE SYNCS ---
  useEffect(() => {
    // Stripping heavy base64 product images when saving cart to avoid localStorage quota issues
    const minimizedCart = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    saveToLocalStorage('db_cart', JSON.stringify(minimizedCart));
  }, [cartItems]);

  useEffect(() => {
    // Stripping heavy base64 product images when saving orders to avoid localStorage quota issues
    const minimizedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        productId: item.product.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          arabicName: item.product.arabicName,
          price: item.product.price,
          image: "", // Remove massive image data url, will be resolved from lookup cache on load
          category: item.product.category,
          rating: item.product.rating,
          prepTime: item.product.prepTime,
          ingredients: item.product.ingredients || []
        },
        quantity: item.quantity
      }))
    }));
    saveToLocalStorage('db_orders', JSON.stringify(minimizedOrders));
  }, [orders]);

  useEffect(() => {
    saveToLocalStorage('db_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    saveToLocalStorage('db_my_placed_order_ids', JSON.stringify(myPlacedOrderIds));
  }, [myPlacedOrderIds]);

  useEffect(() => {
    saveToLocalStorage('db_products', JSON.stringify(productsList));
  }, [productsList]);

  // Scroll to the top of the page on view/page transition (safely handled)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn("Failed to scrollTo top gracefully:", err);
    }
  }, [currentView]);

  // --- ACTIONS SYSTEM ---

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast(`تم زيادة كمية ${product.arabicName} بالسلة!`, 'success');
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      triggerToast(`تم إضافة كوب ${product.arabicName} الفاخر للسلة!`, 'success');
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleAddToCartWithCustomization = (product: Product, quantity: number, instructions: string) => {
    // Modify product representation slightly if instructions added for unique indexing
    const modifiedProduct = { ...product };
    if (instructions.trim()) {
      modifiedProduct.description = `${product.description} \n [تعليمات إضافية: ${instructions}]`;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { product: modifiedProduct, quantity }];
    });
    triggerToast(`تم إضافة ${quantity} حبات من ${product.arabicName} بنجاح!`, 'success');
  };

  const handleRemoveFromCart = (productId: number) => {
    const item = cartItems.find((i) => i.product.id === productId);
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      triggerToast(`تم إزالة ${item.product.arabicName} من السلة.`, 'info');
    }
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    triggerToast(`تم تحديث حالة الطلب ${orderId} إلى مرحلة جديدة.`, 'success');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
    triggerToast(`تم إلغاء الطلب ${orderId} بنجاح. ❌`, 'info');
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    triggerToast(`تم حذف الطلب ${orderId} نهائياً. 🗑️`, 'success');
  };

  const handleClearAllOrders = () => {
    setOrders([]);
    triggerToast(`تم حذف جميع الطلبيات السابقة بالكامل بنجاح. 🧹`, 'success');
  };

  // PLACING REAL ORDER (WHATSAPP DEEP-LINK INTERACTION WITH EXCELLENT DESIGN CONVERSIONS)
  const handlePlaceOrder = (orderData: {
    fullName: string;
    phone: string;
    address: string;
    notes: string;
    deliveryArea: string;
    couponApplied?: string;
    discountAmount: number;
  }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const selectedZoneDetail = DELIVERY_ZONES.find((z) => z.id === selectedZone);
    const rawDeliveryCost = selectedZoneDetail ? selectedZoneDetail.cost : 0;
    const isFreeDelivery = subtotal >= 100;
    const deliveryCost = isFreeDelivery ? 0 : rawDeliveryCost;
    const total = subtotal + deliveryCost - orderData.discountAmount;

    // Generate random Order ID
    const randomId = `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    // Auto-prepend the selected district/area name to the residential address
    let formattedAddress = orderData.address;
    if (orderData.deliveryArea && !orderData.address.includes(orderData.deliveryArea)) {
      formattedAddress = orderData.address.trim() ? `${orderData.deliveryArea}، ${orderData.address}` : orderData.deliveryArea;
    }

    // Format WhatsApp invoice text
    const storeWhatsAppNumber = siteSettings.whatsappNumber;
    
    let whatsappText = `*${siteSettings.whatsappMessageTemplate}*\n\n`;
    whatsappText += `*رقم التتبع للطلب:* \`#${randomId}\`\n`;
    whatsappText += `*الاسم الكامل:* ${orderData.fullName}\n`;
    whatsappText += `*الهاتف:* ${orderData.phone}\n`;
    whatsappText += `*العنوان السكني:* ${formattedAddress}\n`;
    whatsappText += `*منطقة الاستلام:* ${orderData.deliveryArea}\n`;
    if (orderData.notes) {
      whatsappText += `*ملاحظات خاصة:* _${orderData.notes}_\n`;
    }
    whatsappText += `\n*المنتجات المطلوبة:*\n`;

    cartItems.forEach((item) => {
      whatsappText += `• ${item.product.arabicName} *x${item.quantity}* (${item.product.price * item.quantity} DH)\n`;
      // check if customizable instructions are there in product details
      if (item.product.description.includes('[تعليمات إضافية:')) {
        const customLine = item.product.description.split('[تعليمات إضافية:')[1]?.replace(']', '');
        if (customLine) {
          whatsappText += `  └ _ملاحظة: ${customLine.trim()}_\n`;
        }
      }
    });

    whatsappText += `\n*تفاصيل المجموع الفوري:*\n`;
    whatsappText += `- المجموع الفرعي: ${subtotal} DH\n`;
    if (orderData.discountAmount > 0) {
      whatsappText += `- خصم كوبون [${orderData.couponApplied}]: -${orderData.discountAmount} DH\n`;
    }
    whatsappText += `- كلفة التوصيل: ${isFreeDelivery ? 'توصيل مجاني' : `${deliveryCost} DH`}\n`;
    whatsappText += `*المجموع الإجمالي لتأديته عند الاستلام:* *${total} DH*\n\n`;
    whatsappText += `شكرًا جزيلاً لاختياركم *${siteSettings.storeName}* ! طري ومصنوع بكل حب وعناية منزلية فخمة`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodedText}`;

    const newOrder: Order = {
      id: randomId,
      fullName: orderData.fullName,
      phone: orderData.phone,
      address: formattedAddress,
      notes: orderData.notes,
      deliveryArea: orderData.deliveryArea,
      deliveryCost,
      items: [...cartItems],
      subtotal,
      total,
      status: 'new',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      couponApplied: orderData.couponApplied,
      discountAmount: orderData.discountAmount,
      whatsappUrl,
    };

    // Save order in state lists (pre-pended so latest is always visible)
    setOrders((prev) => [newOrder, ...prev]);
    setMyPlacedOrderIds((prev) => [randomId, ...prev]);

    triggerToast(`تـم تسجيل طلبيتك بنجاح برقم التتبع #${randomId}! تم حفظ الطلب ومتابعته في لوحة التحكم.`, 'success');

    // Clear cart and switch view to the live order tracking page
    setCartItems([]);
    setOrderNotes('');
    handleSetView('track');
  };

  // --- FILTERING AND SORTING Logic ---
  const filteredProducts = productsList.filter((product) => {
    if (!product) return false;
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const arabicName = product.arabicName || '';
    const name = product.name || '';
    const query = searchQuery || '';
    const matchesSearch =
      arabicName.toLowerCase().includes(query.toLowerCase()) ||
      name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a?.price || 0;
    const priceB = b?.price || 0;
    const ratingA = a?.rating || 0;
    const ratingB = b?.rating || 0;
    if (sortOption === 'priceAsc') return priceA - priceB;
    if (sortOption === 'priceDesc') return priceB - priceA;
    if (sortOption === 'rating') return ratingB - ratingA;
    return 0; // default initial layout
  });

  const renderTestimonialsSection = () => {
    return (
      <div className="bg-brand-purple/10 relative overflow-hidden py-16 dark:bg-neutral-950/60 font-sans">
        <div className="absolute inset-0 arabesque-pattern opacity-6 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-align-start relative z-10 w-full">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider text-brand-gold uppercase block mb-1">شاهد عظمة وثقة عشاقنا</span>
            <h2 className="text-2xl md:text-3xl font-display font-black text-royal-purple flex items-center justify-center gap-1">
              ماذا يقول زبائننا المخلصون؟
            </h2>
            <div className="w-24 h-0.5 bg-brand-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-center">
            {(showAllTestimonials ? TESTIMONIALS : TESTIMONIALS.slice(0, 3)).map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                key={t.id}
                className="bg-white/80 dark:bg-neutral-900/80 p-6 md:p-8 rounded-3xl border border-brand-gold/15 hover:shadow-xl transition-shadow relative"
              >
                <span className="text-brand-gold text-2xl font-serif absolute top-3.5 left-4">“</span>
                <div className="flex items-center gap-1 text-xs font-bold text-brand-gold mb-3" style={{ direction: 'rtl' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                
                <p className="text-sm text-gray-700 italic leading-relaxed min-h-24">
                  {t.comment}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                  <span className="font-bold text-royal-purple block text-sm">{t.name}</span>
                  <span className="text-xs text-gray-400">{t.city} {t.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllTestimonials(!showAllTestimonials)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white font-black rounded-2xl shadow-md shadow-brand-purple/10 active:scale-95 transition-all text-xs cursor-pointer"
            >
              {showAllTestimonials ? (
                <>
                  <span>مشاهدة أقل</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>مشاهدة المزيد من التقييمات</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedZoneCost = DELIVERY_ZONES.find((z) => z.id === selectedZone)?.cost ?? 0;

  return (
    <div className={`min-h-screen flex flex-col justify-between ${darkMode ? 'dark bg-neutral-900 text-white' : 'bg-brand-cream text-neutral-800'}`}>
      
      {/* Toast Alert popup overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className={`fixed top-24 left-4 right-4 md:left-auto md:right-8 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
              toastType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-brand-purple-soft border-brand-purple/20 text-brand-purple'
            }`}
          >
            <CheckCircle className={`w-5.5 h-5.5 ${toastType === 'success' ? 'text-emerald-500' : 'text-brand-purple-light'}`} />
            <span className="text-xs md:text-sm font-bold leading-normal">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION (Always Visible) */}
      <Header
        currentView={currentView}
        onSetView={(view) => {
          handleSetView(view);
          setIsSidebarCartOpen(false); // Autoclose drawer on actions
        }}
        cartItems={cartItems}
        cartCount={totalCartCount}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenCart={() => setIsSidebarCartOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        onUnlockAdmin={handleUnlockAdmin}
        siteSettings={siteSettings}
      />

      {/* SIDEBAR CART DRAWER SCREEN */}
      <AnimatePresence>
        {isSidebarCartOpen && (
          <>
            {/* Dark backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide over cabinet sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl flex flex-col h-full font-sans text-align-start border-l border-brand-gold/20"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-display font-black text-royal-purple inline-flex items-center gap-1.5">
                  <ShoppingCart className="w-5 h-5 text-brand-gold" />
                  طلباتي
                </h3>
                <button
                  onClick={() => setIsSidebarCartOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Items scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <span className="block text-4xl mb-2">🍹</span>
                    <p className="text-sm font-bold">لا توجد حبات مضافة بعد.</p>
                    <p className="text-xs mt-1">دعنا نلقي نظرة على زعزع أو فلان كراميل!</p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="p-3 bg-brand-cream rounded-2xl border border-gray-100 flex items-center gap-3 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.arabicName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 text-align-start">
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.arabicName}</h4>
                        <span className="text-[10px] text-brand-gold-dark font-black block mt-0.5">{item.product.price} DH</span>
                        
                        {/* Adjust quantities */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-white text-gray-600 font-bold flex items-center justify-center border border-gray-200"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-white text-gray-600 font-bold flex items-center justify-center border border-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="absolute top-2 left-2 text-gray-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal metrics and quick cart checkout */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-brand-cream/40">
                  <div className="flex justify-between items-center mb-4 text-sm font-bold text-neutral-700">
                    <span>مجموع الطلبية:</span>
                    <span className="text-lg text-royal-purple">
                      {cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)} DH
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 text-center mb-4 leading-normal">
                    * ملاحظة: توصيل مجاني لبعض الأحياء وتلقائياً للطلبات الأزيد من 100 DH
                  </p>

                  <button
                    onClick={() => {
                      setIsSidebarCartOpen(false);
                      setCurrentView('cart');
                    }}
                    className="w-full py-3.5 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-xl text-center text-xs transition-transform cursor-pointer block"
                  >
                    عرض تفاصيل الطلب
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CORE PAGES ROUTER RENDERING */}
      <main className="flex-grow pb-12">
        
        {/* VIEW 1: MAIN E-STORE (HOME) */}
        {currentView === 'home' && (
          <div className="space-y-12">
            
            {/* HERO SEGMENT */}
            <Hero
              onOrderNowClick={() => {
                const listElem = document.getElementById('products-listing-title');
                if (listElem) listElem.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreStory={() => handleSetView('about')}
              siteSettings={siteSettings}
            />

            {/* FILTERING BAR & PRODUCTS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-sans">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-align-start" id="products-listing-title">
                <div>
                  <span className="text-sm font-semibold tracking-wider text-brand-gold uppercase block mb-1">صنع برقة وطزاجة</span>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-royal-purple inline-flex items-center gap-2">
                    <Sparkles className="text-brand-gold animate-bounce" />
                    قائمة مشروباتنا وتحليّاتنا المدهشة
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">تصفح وجرب أفخر ما تحضره يدا دعاء وبسمة بالمنزل.</p>
                </div>

                {/* Search text inputs */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن: (زعزع، عصير الدراغون، عصير الأفوكادو، فلان فنزويلي،..."
                    className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-purple outline-none text-xs bg-white/70 backdrop-blur-md shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-3.5 text-gray-400 text-xs font-semibold hover:text-royal-purple"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>

              {/* Sub selectors filters and sorters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-royal-purple p-4 rounded-3xl border border-brand-purple/30 shadow-lg shadow-brand-purple/15">
                
                {/* Categories filtering tab buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-brand-gold hover:bg-brand-gold-light text-royal-purple shadow-md shadow-brand-gold/20'
                          : 'bg-white/10 hover:bg-white/20 text-purple-100 border border-white/5'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Sorting option trigger menu */}
                <div className="flex items-center gap-2 relative bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="text-[11px] text-purple-200 font-bold">ترتيب المنتجات:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs font-bold text-white outline-none bg-transparent cursor-pointer [&>option]:bg-royal-purple [&>option]:text-white"
                  >
                    <option value="default" className="bg-royal-purple text-white">الافتراضي (الأصوب)</option>
                    <option value="priceAsc" className="bg-royal-purple text-white">السعر: من الأقل إلى الأكثر</option>
                    <option value="priceDesc" className="bg-royal-purple text-white">السعر: من الأكثر إلى الأقل</option>
                    <option value="rating" className="bg-royal-purple text-white">الأعلى تقييماً وطلباً</option>
                  </select>
                </div>

              </div>

              {/* Products listing grid with fluid responsive metrics */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm max-w-lg mx-auto flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-5 border-2 border-brand-purple/20 shadow-inner group">
                    <Search className="w-8 h-8 text-royal-purple" />
                  </div>
                  <h3 className="font-display font-bold text-royal-purple text-lg mb-2">لم نجد أي منتج يطابق بحثك حالياً</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-semibold">لم يتم إضافة أي منتج بهذا التصنيف في الوقت الحالي ونعمل على ذلك، قريبا...</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto justify-center"
                >
                  <AnimatePresence>
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetails={(id) => setSelectedProductId(id)}
                        onAddToCart={(prod, evt) => handleAddToCart(prod, evt)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

            </div>

            {/* WHY CHOOSE US REVIEWS BRIDGES */}
            {renderTestimonialsSection()}

          </div>
        )}

        {/* VIEW 2: ABOUT US (من نحن) */}
        {currentView === 'about' && (
          <div className="flex flex-col gap-0">
            <InfoPages activeTab="about" siteSettings={siteSettings} />
            {renderTestimonialsSection()}
          </div>
        )}

        {/* VIEW 3: SHIPPING CONDITIONS (التوصيل) */}
        {currentView === 'delivery' && <InfoPages activeTab="delivery" siteSettings={siteSettings} />}

        {/* VIEW 4: CONTACT INFOS (اتصل بنا) */}
        {currentView === 'contact' && (
          <div className="flex flex-col gap-0">
            <InfoPages activeTab="contact" siteSettings={siteSettings} />
            {renderTestimonialsSection()}
          </div>
        )}

        {/* VIEW 5: CART SUMMARY DETAIL (صفحة السلة بالتفصيل) */}
        {currentView === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onContinueShopping={() => handleSetView('home')}
            onProceedToCheckout={() => handleSetView('checkout')}
            deliveryOption={selectedZoneCost}
            notes={orderNotes}
            onNotesChange={setOrderNotes}
            coupons={coupons}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
          />
        )}

        {/* VIEW 6: CHECKOUT FORM COMPOSITIONS (صفحة الدفع) */}
        {currentView === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            subtotal={cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
            deliveryCost={selectedZoneCost}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => handleSetView('cart')}
            selectedZone={selectedZone}
            onZoneChange={handleZoneChange}
            coupons={coupons}
            notes={orderNotes}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
          />
        )}

        {/* VIEW 7: ORDER PROGRESS TRACKING (تتبع الطلب) */}
        {currentView === 'track' && (
          <Tracking
            orders={orders.filter(o => myPlacedOrderIds.includes(o.id))}
            onViewStore={() => handleSetView('home')}
            siteSettings={siteSettings}
          />
        )}

        {/* VIEW 8: ADMIN CONTROL PANEL (لوحة التحكم) */}
        {currentView === 'admin' && (
          <Admin
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
            onDeleteOrder={handleDeleteOrder}
            onClearAllOrders={handleClearAllOrders}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            products={productsList}
            onUpdateProducts={setProductsList}
            siteSettings={siteSettings}
            onUpdateSiteSettings={handleUpdateSiteSettings}
            onLogout={handleAdminLogout}
          />
        )}

      </main>

      {/* DETAILED OVERLAY MODAL FOR EXPANSIVE DESCRIPTIONS */}
      <ProductDetails
        productId={selectedProductId}
        products={productsList}
        onClose={() => setSelectedProductId(null)}
        onAddToCartWithCustomization={handleAddToCartWithCustomization}
      />

      {/* FOOTER BLOCK (Always Mounted) */}
      <footer className="bg-royal-purple text-white relative overflow-hidden pt-12 pb-8 border-t border-brand-gold/30">
        <div className="absolute inset-0 arabesque-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
          
          {/* Logo & description (placed top center) */}
          <div className="space-y-4 mb-10 text-center border-b border-brand-gold/10 pb-8">
            <div className="flex items-center justify-center gap-1.5 animate-pulse-slow">
              <span 
                onClick={() => handleSetView('home')}
                className="text-2xl md:text-4xl font-display font-black text-brand-gold cursor-pointer transition-all duration-300 hover:scale-105 hover:text-brand-gold-light drop-shadow-sm select-none"
              >
                {siteSettings?.storeName || "Douaa & Basma"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {siteSettings?.storeDescription || "أرقى مشروع محلي مغربي لتقديم العصائر و التحليات المنزلية. و نسعى دائماً لترك بصمة من المتعة والفرح بمناسباتكم الخاصة والعامة."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start gap-12 md:gap-x-24 lg:gap-x-32 text-center">
            
            {/* Social channels icons row (Left/First on desktop, bottom/Second on mobile) */}
            <div className="flex flex-col items-center text-center w-full md:w-auto order-2 md:order-1">
              <h4 className="font-bold text-gray-100 text-sm mb-4 border-b-2 border-brand-gold/60 pb-1 px-4 md:px-0 inline-block">مواقع التواصل الاجتماعي</h4>
              <div className="flex gap-2.5 pt-1 justify-center">
                <a
                  href={`https://wa.me/${siteSettings?.whatsappNumber || '212705908383'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-transform hover:scale-105"
                  title="تواصل معنا عبر واتساب"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                </a>

                <a
                  href={siteSettings?.instagramUrl || "https://instagram.com/douaabasma_1"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center transition-transform hover:scale-105"
                  title="حسابنا على الإنستغرام"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>

                <a
                  href={siteSettings?.facebookUrl || "https://m.facebook.com/douaabasma01/"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform hover:scale-105"
                  title="صفحتنا على الفيسبوك"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Links map segment (Right/Second on desktop, top/First on mobile) */}
            <div className="flex flex-col items-center text-center w-full md:w-auto order-1 md:order-2">
              <h4 className="font-bold text-gray-100 text-sm mb-4 border-b-2 border-brand-gold/60 pb-1 px-4 md:px-0 inline-block">تصفح المتجر من خلال</h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-gray-300 max-w-sm w-full md:max-w-none md:w-auto">
                <li className="text-center">
                  <a 
                    href="#/" 
                    onClick={(e) => { e.preventDefault(); handleSetView('home'); }} 
                    className="hover:text-brand-gold transition-colors cursor-pointer text-center block w-full"
                  >
                    الرئيسية وقائمة المنتجات
                  </a>
                </li>
                <li className="text-center">
                  <a 
                    href="#/about-us" 
                    onClick={(e) => { e.preventDefault(); handleSetView('about'); }} 
                    className="hover:text-brand-gold transition-colors cursor-pointer text-center block w-full"
                  >
                    من نحن وقصتنا
                  </a>
                </li>
                <li className="text-center">
                  <a 
                    href="#/delivery" 
                    onClick={(e) => { e.preventDefault(); handleSetView('delivery'); }} 
                    className="hover:text-brand-gold transition-colors cursor-pointer text-center block w-full"
                  >
                    معلومات التوصيل والمدن
                  </a>
                </li>
                <li className="text-center">
                  <a 
                    href="#/contact-us" 
                    onClick={(e) => { e.preventDefault(); handleSetView('contact'); }} 
                    className="hover:text-brand-gold transition-colors cursor-pointer text-center block w-full"
                  >
                    للاتصال بنا وطلب حجز
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Copy credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-brand-gold/10 pt-6 mt-8 text-center text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} {siteSettings?.footerCredits || "جميع الحقوق محفوظة لعلامة"} <span className="cursor-pointer hover:text-brand-gold duration-200 font-bold" onClick={handleFooterSecretClick}>{siteSettings?.storeName || "Douaa & Basma"}</span></p>
        </div>
      </footer>



    </div>
  );
}
