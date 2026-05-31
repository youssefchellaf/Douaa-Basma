import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, ArrowUpDown, ShoppingCart, Trash2, X, Plus, Minus, CheckCircle, 
  MessageSquare, Instagram, Facebook, Heart, ChevronLeft, Award, Sparkles, AlertCircle, RefreshCw,
  Phone, MessageCircle
} from 'lucide-react';

import { Product, CartItem, Order, Coupon } from './types';
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
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  const [selectedZone, setSelectedZone] = useState<string>('baisa');
  const [isSidebarCartOpen, setIsSidebarCartOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('db_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validated = parsed.filter(p => p && typeof p === 'object' && p.id && p.arabicName && p.price && p.image);
          if (validated.length > 0) return validated;
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

  // Local storage lists for persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('db_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const lookup = getProductsLookup();
          return parsed.map((item: any) => {
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
          return parsed.map((order: any) => {
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
        }
      }
    } catch (e) {
      console.error("Error reading db_orders from localStorage:", e);
    }
    
    return defaultOrders;
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

  // --- PERSISTENCE SYNCS ---
  useEffect(() => {
    try {
      // Stripping heavy base64 product images when saving cart to avoid localStorage quota issues
      const minimizedCart = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      localStorage.setItem('db_cart', JSON.stringify(minimizedCart));
    } catch (e) {
      console.error("Failed to save db_cart to localStorage:", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
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
      localStorage.setItem('db_orders', JSON.stringify(minimizedOrders));
    } catch (e) {
      console.error("Failed to save db_orders to localStorage:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('db_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error("Failed to save db_coupons to localStorage:", e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('db_products', JSON.stringify(productsList));
    } catch (e) {
      console.error("Failed to save db_products to localStorage:", e);
      triggerToast('⚠️ عذراً، لم نتمكن من الحفظ لامتلاء ذاكرة التخزين المحلية. الرجاء استخدام صورة أصغر أو رابط صورة مباشر.', 'info');
    }
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
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

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
    const rawDeliveryCost = selectedZoneDetail ? selectedZoneDetail.cost : 5;
    const isFreeDelivery = subtotal >= 100;
    const deliveryCost = isFreeDelivery ? 0 : rawDeliveryCost;
    const total = subtotal + deliveryCost - orderData.discountAmount;

    // Generate random Order ID
    const randomId = `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    // Auto-prepend the selected district/area name to the residential address
    let formattedAddress = orderData.address;
    if (orderData.deliveryArea && !orderData.address.includes(orderData.deliveryArea)) {
      formattedAddress = `${orderData.deliveryArea}، ${orderData.address}`;
    }

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
      status: 'pending',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      couponApplied: orderData.couponApplied,
      discountAmount: orderData.discountAmount,
    };

    // Save order in state lists (pre-pended so latest is always visible)
    setOrders((prev) => [newOrder, ...prev]);

    // Format WhatsApp invoice text
    const storeWhatsAppNumber = '212705908383';
    
    let whatsappText = `*طلب جديد من متجر Douaa & Basma*\n\n`;
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
    whatsappText += `شكرًا جزيلاً لاختياركم *Douaa & Basma* ! طري ومصنوع بكل حب وعناية منزلية فخمة`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodedText}`;

    // Attempt to open WhatsApp in a new tab immediately (synchronously under the click handler context)
    // to prevent the browser's popup blocker from blocking it.
    let opened = false;
    try {
      const newWindow = window.open(whatsappUrl, '_blank');
      if (newWindow && !newWindow.closed && typeof newWindow.closed !== 'undefined') {
        opened = true;
      }
    } catch (e) {
      console.error("Popup window open failed:", e);
    }

    // Fallback: If popup is blocked or fails to open, redirect the current window directly as it cannot be blocked.
    if (!opened) {
      window.location.href = whatsappUrl;
    }

    triggerToast(`تـم تسجيل طلبيتك بنجاح! جاري توجيهك إلى واتساب لتأكيد الاستلام...`, 'success');

    // Clear cart and switch view to the live order tracking page
    setCartItems([]);
    setOrderNotes('');
    setCurrentView('track');
  };

  // --- FILTERING AND SORTING Logic ---
  const filteredProducts = productsList.filter((product) => {
    if (!product) return false;
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const arabicName = product.arabicName || '';
    const name = product.name || '';
    const description = product.description || '';
    const query = searchQuery || '';
    const matchesSearch =
      arabicName.toLowerCase().includes(query.toLowerCase()) ||
      name.toLowerCase().includes(query.toLowerCase()) ||
      description.toLowerCase().includes(query.toLowerCase());
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

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedZoneCost = DELIVERY_ZONES.find((z) => z.id === selectedZone)?.cost ?? 5;

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
          setCurrentView(view);
          setIsSidebarCartOpen(false); // Autoclose drawer on actions
        }}
        cartItems={cartItems}
        cartCount={totalCartCount}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenCart={() => setIsSidebarCartOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        onUnlockAdmin={handleUnlockAdmin}
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
                  سلة المشتريات
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
                  cartItems.map((item) => (
                    <div key={item.product.id} className="p-3 bg-brand-cream rounded-2xl border border-gray-100 flex items-center gap-3 relative">
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
                    * ملاحظة: التوصيل مجاني تلقائياً للطلبات الأزيد من 100 DH.
                  </p>

                  <button
                    onClick={() => {
                      setIsSidebarCartOpen(false);
                      setCurrentView('cart');
                    }}
                    className="w-full py-3.5 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-xl text-center text-xs transition-transform cursor-pointer block"
                  >
                    عرض تفاصيل السلة
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
              onExploreStory={() => setCurrentView('about')}
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
                  <p className="text-gray-500 text-sm mt-1">تصفح وجرب أفخر ما تحضره يدا دعاء وبسمة بمنازل الكوادر والشرفاء.</p>
                </div>

                {/* Search text inputs */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن: زعزع، أفوكادو، فلان..."
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-gray-100">
                
                {/* Categories filtering tab buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/10'
                          : 'bg-brand-cream hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Sorting option trigger menu */}
                <div className="flex items-center gap-2 relative bg-brand-cream/60 px-3 py-1.5 rounded-xl border border-gray-100">
                  <ArrowUpDown className="w-3.5 h-3.5 text-brand-purple" />
                  <span className="text-[11px] text-gray-400 font-bold">ترتيب المنتجات:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs font-bold text-gray-700 outline-none bg-transparent cursor-pointer"
                  >
                    <option value="default">الافتراضي (الأصوب)</option>
                    <option value="priceAsc">السعر: من الأقل إلى الأكثر</option>
                    <option value="priceDesc">السعر: من الأكثر إلى الأقل</option>
                    <option value="rating">الأعلى تقييماً وطلباً</option>
                  </select>
                </div>

              </div>

              {/* Products listing grid with fluid responsive metrics */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100">
                  <span className="text-4xl block mb-2">🔎</span>
                  <h3 className="font-bold text-royal-purple text-base">لم نجد أي منتج يطابق بحثك حالياً</h3>
                  <p className="text-xs text-gray-400 mt-1">تأكد من كتابة الكلمات باللغة العربية أو تصفح الأقسام مباشرة.</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center"
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
            <div className="bg-brand-purple/10 relative overflow-hidden py-16 dark:bg-neutral-950/60 font-sans">
              <div className="absolute inset-0 arabesque-pattern opacity-6 pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-align-start relative z-10">
                <div className="text-center mb-12">
                  <span className="text-sm font-semibold tracking-wider text-brand-gold uppercase block mb-1">شاهد عظمة وثقة عشاقنا</span>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-royal-purple flex items-center justify-center gap-1">
                    ماذا يقول زبائننا المخلصون؟
                  </h2>
                  <div className="w-24 h-0.5 bg-brand-gold mx-auto mt-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {TESTIMONIALS.map((t) => (
                    <div
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
                        <span className="text-xs text-gray-400">{t.city} -- {t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ABOUT US (من نحن) */}
        {currentView === 'about' && <InfoPages activeTab="about" />}

        {/* VIEW 3: SHIPPING CONDITIONS (التوصيل) */}
        {currentView === 'delivery' && <InfoPages activeTab="delivery" />}

        {/* VIEW 4: CONTACT INFOS (اتصل بنا) */}
        {currentView === 'contact' && <InfoPages activeTab="contact" />}

        {/* VIEW 5: CART SUMMARY DETAIL (صفحة السلة بالتفصيل) */}
        {currentView === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onContinueShopping={() => setCurrentView('home')}
            onProceedToCheckout={() => setCurrentView('checkout')}
            deliveryOption={selectedZoneCost}
            notes={orderNotes}
            onNotesChange={setOrderNotes}
          />
        )}

        {/* VIEW 6: CHECKOUT FORM COMPOSITIONS (صفحة الدفع) */}
        {currentView === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            subtotal={cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
            deliveryCost={selectedZoneCost}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => setCurrentView('cart')}
            selectedZone={selectedZone}
            onZoneChange={handleZoneChange}
            coupons={coupons}
            notes={orderNotes}
          />
        )}

        {/* VIEW 7: ORDER PROGRESS TRACKING (تتبع الطلب) */}
        {currentView === 'track' && (
          <Tracking
            orders={orders}
            onViewStore={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 8: ADMIN CONTROL PANEL (لوحة التحكم) */}
        {currentView === 'admin' && (
          <Admin
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            products={productsList}
            onUpdateProducts={setProductsList}
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-align-start font-sans">
          
          {/* Logo segment */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xl font-display font-black text-brand-gold flex items-center gap-1.5">
              Douaa & Basma
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              أرقى مشروع محلي مغربي لتقديم العصائر و التحليات المنزلية. و نسعى دائماً لترك بصمة من المتعة والفرح بمناسباتكم الخاصة والعامة.
            </p>
            
            {/* Links map segment moved here */}
            <div className="pt-2">
              <h4 className="font-bold text-gray-100 text-sm mb-4 border-r-2 border-brand-gold pr-2">تصفح المتجر من خلال</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-gray-300 max-w-sm">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-brand-gold transition-colors cursor-pointer text-right w-full">الرئيسية وقائمة المنتجات</button></li>
                <li><button onClick={() => setCurrentView('about')} className="hover:text-brand-gold transition-colors cursor-pointer text-right w-full">من نحن وقصتنا</button></li>
                <li><button onClick={() => setCurrentView('delivery')} className="hover:text-brand-gold transition-colors cursor-pointer text-right w-full">معلومات التوصيل والمدن</button></li>
                <li><button onClick={() => setCurrentView('contact')} className="hover:text-brand-gold transition-colors cursor-pointer text-right w-full">للاتصال بنا وطلب حجز</button></li>
              </ul>
            </div>
          </div>

          {/* Social channels icons row moved here */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-gray-100 text-sm mb-4 border-r-2 border-brand-gold pr-2">مواقع التواصل الاجتماعي</h4>
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://wa.me/212705908383"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-transform hover:scale-105"
                title="تواصل معنا عبر واتساب"
              >
                <MessageCircle className="w-4.5 h-4.5" />
              </a>

              <a
                href="https://instagram.com/douaabasma_1"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center transition-transform hover:scale-105"
                title="حسابنا على الإنستغرام"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>

              <a
                href="https://m.facebook.com/douaabasma01/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform hover:scale-105"
                title="صفحتنا على الفيسبوك"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Copy credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-brand-gold/10 pt-6 mt-8 text-center text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لعلامة <span className="cursor-pointer hover:text-brand-gold duration-200" onClick={handleFooterSecretClick}>Douaa & Basma</span></p>
        </div>
      </footer>

    </div>
  );
}
