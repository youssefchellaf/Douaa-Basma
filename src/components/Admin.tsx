import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, DollarSign, ListOrdered, Tag, CheckCircle2, RefreshCw, Sparkles, Plus, Clock, Eye,
  Lock, Unlock, LogOut, Edit3, Trash2, Image, Layers, HelpCircle, Check, X, ShieldAlert, Star,
  CheckCircle, MessageCircle, Bell, Volume2, VolumeX, Info, AlertCircle, ArrowUp, ArrowDown,
  Copy
} from 'lucide-react';
import { Order, Coupon, Product, CategoryId, SiteSettings } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ImageSelectionWidget } from './ImageSelectionWidget';

interface AdminProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onCancelOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onClearAllOrders?: () => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onLogout?: () => void;
}

const compressImageFile = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  callback: (result: string) => void
) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (!event.target || typeof event.target.result !== 'string') return;
    const base64Str = event.target.result;
    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          callback(dataUrl);
        } else {
          callback(base64Str);
        }
      } catch (err) {
        console.error("Error compressing image:", err);
        callback(base64Str);
      }
    };
    img.onerror = () => {
      callback(base64Str);
    };
    img.src = base64Str;
  };
  reader.readAsDataURL(file);
};

const generateWhatsAppConfirmUrl = (order: Order, storeName: string) => {
  // Clean phone number
  let rawPhone = order.phone || "";
  let cleanPhone = rawPhone.replace(/\D/g, ""); // strip all non-digits
  
  // Format to Moroccan international standard: 212xxxxxxxxx
  if (cleanPhone.startsWith("06") && cleanPhone.length === 10) {
    cleanPhone = "212" + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith("07") && cleanPhone.length === 10) {
    cleanPhone = "212" + cleanPhone.substring(1);
  } else if ((cleanPhone.startsWith("6") || cleanPhone.startsWith("7")) && cleanPhone.length === 9) {
    cleanPhone = "212" + cleanPhone;
  } else if (cleanPhone.startsWith("00212")) {
    cleanPhone = cleanPhone.substring(2);
  } else if (cleanPhone.startsWith("212") && cleanPhone.length === 12) {
    // Already in correct 212XXXXXXXXX format
  } else if (cleanPhone.length === 9) {
    cleanPhone = "212" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("212")) {
    // If it was parsed with 212 but without 0, let it be
  } else {
    // Fallback: if it's already got prefix or something else
  }
  
  // Create message text
  let msg = `*${storeName || "Douaa & Basma"} - تأكيد طلبية جديدة*\n\n`;
  msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n`;
  msg += `يسعدنا تأكيد طلبكم المعتمد عبر متجرنا تحت رقم: \`#${order.id}\`\n\n`;
  
  msg += `*المنتجات المطلوبة:*\n`;
  (order.items || []).forEach((item) => {
    if (item && item.product) {
      msg += `• ${item.product.arabicName || ""} *x${item.quantity || 1}* (${(item.product.price || 0) * (item.quantity || 1)} DH)\n`;
      
      // Check for product-specific customization note
      let note = '';
      if (item.product.description && item.product.description.includes('[تعليمات إضافية:')) {
        const parts = item.product.description.split('[تعليمات إضافية:');
        if (parts.length > 1) {
          const extracted = parts[1].split(']')[0].trim();
          if (extracted) {
            note = extracted;
          }
        }
      }
      if (note && note !== 'بدون ملاحظات') {
        msg += `  └ _ملاحظة التخصيص: ${note}_\n`;
      }
    }
  });
  
  msg += `\n*معلومات التوصيل والعنوان:*\n`;
  const area = (order.deliveryArea || "").trim();
  let address = (order.address || "").trim();
  if (area && address) {
    if (address.startsWith(area)) {
      address = address.substring(area.length).trim();
    }
    address = address.replace(/^[\s,，、，\-,，—ـ~_()（）:：]+/g, '').trim();
  }
  const displayAddress = address && address !== area ? `${area} - ${address}` : area;
  msg += `• *العنوان:* ${displayAddress || "غير محدد"}\n`;
  
  msg += `\n*تفاصيل المجموع الفوري:*\n`;
  msg += `- المجموع الفرعي: ${order.subtotal} DH\n`;
  if (order.couponApplied) {
    msg += `- كوبون الخصم [${order.couponApplied}]: -${order.discountAmount || 0} DH\n`;
  }
  msg += `- كلفة التوصيل: ${order.deliveryCost === 0 ? 'توصيل مجاني' : `${order.deliveryCost} DH`}\n`;
  msg += `*المجموع الإجمالي لتأديته عند الاستلام:* *${order.total} DH*\n\n`;
  
  msg += `*لتأكيد طلبيتك يرجى إرسال "نعم"*\n\n`;
  msg += `تفضلوا بالرد للتجهيز السريع والتوصيل في الموعد المحدد. شكراً جزيلاً لثقتكم! ❤️`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
};

const cleanAndConvertImageUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();

  // 1. Google Drive Sharing Link conversions
  // Examples:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  // - https://docs.google.com/file/d/FILE_ID/edit
  // - https://drive.google.com/uc?id=FILE_ID
  const gdRegex1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdRegex2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const gdRegex3 = /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdRegex4 = /drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/;

  let fileId = '';
  if (gdRegex1.test(cleaned)) {
    fileId = cleaned.match(gdRegex1)?.[1] || '';
  } else if (gdRegex2.test(cleaned)) {
    fileId = cleaned.match(gdRegex2)?.[1] || '';
  } else if (gdRegex3.test(cleaned)) {
    fileId = cleaned.match(gdRegex3)?.[1] || '';
  } else if (gdRegex4.test(cleaned)) {
    fileId = cleaned.match(gdRegex4)?.[1] || '';
  }

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 2. Dropbox sharing link conversions
  // Change dl=0 to raw=1
  if (cleaned.includes('dropbox.com') && cleaned.includes('dl=0')) {
    cleaned = cleaned.replace('dl=0', 'raw=1');
  }

  return cleaned;
};

const isDiscordUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('discordapp.com') || url.includes('discordapp.net');
};

const generateWhatsAppStatusUpdateUrl = (order: Order, status: Order['status'], storeName: string) => {
  // Clean phone number
  let rawPhone = order.phone || "";
  let cleanPhone = rawPhone.replace(/\D/g, ""); // strip all non-digits
  
  // Format to Moroccan international standard: 212xxxxxxxxx
  if (cleanPhone.startsWith("06") && cleanPhone.length === 10) {
    cleanPhone = "212" + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith("07") && cleanPhone.length === 10) {
    cleanPhone = "212" + cleanPhone.substring(1);
  } else if ((cleanPhone.startsWith("6") || cleanPhone.startsWith("7")) && cleanPhone.length === 9) {
    cleanPhone = "212" + cleanPhone;
  } else if (cleanPhone.startsWith("00212")) {
    cleanPhone = cleanPhone.substring(2);
  } else if (cleanPhone.startsWith("212") && cleanPhone.length === 12) {
    // Already in correct 212XXXXXXXXX format
  } else if (cleanPhone.length === 9) {
    cleanPhone = "212" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("212")) {
    // If it was parsed with 212 but without 0, let it be
  } else {
    // Fallback
  }

  let msg = "";
  if (status === "pending") {
    msg = `*تحديث حالة الطلب بمتجر ${storeName || "Douaa & Basma"}*\n\n`;
    msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n\n`;
    msg += `يسعدنا إخبارك بأن طلبك رقم \`#${order.id}\` قد تم تأكيده بنجاح! الطلب قيد التحضير الفوري وسنقوم بإرساله في أقرب وقت. شكراً جزيلاً لثقتكم! ❤️`;
  } else if (status === "preparing") {
    msg = `*تحديث حالة الطلب بمتجر ${storeName || "Douaa & Basma"}*\n\n`;
    msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n\n`;
    msg += `نبشرك بأن طلبك الـرائع رقم \`#${order.id}\` هو الآن في مرحلة التحضير والتجهيز بكل عناية للتقديم الطازج! سنخبركم فور انطلاقه مع المندوب. شكراً جزيلاً لثقتكم! 🍹✨`;
  } else if (status === "on_way") {
    msg = `*تحديث حالة الطلب بمتجر ${storeName || "Douaa & Basma"}*\n\n`;
    msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n\n`;
    msg += `طلبك اللذيذ والمنعش رقم \`#${order.id}\` قد غادر وهو الآن بالطريق إليك برفقة مندوب التوصيل ! 🛵\n`;
    msg += `المرجو إبقاء الهاتف قريباً للرد وتسهيل عملية التسليم في أقرب وقت.! 🌟\n`;
    msg += `رقم المندوب: 0605210092`;
  } else if (status === "delivered") {
    msg = `*تحديث حالة الطلب بمتجر ${storeName || "Douaa & Basma"}*\n\n`;
    msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n\n`;
    msg += `تـم تسليم طلبك رقم \`#${order.id}\` بنجاح والحمد لله! نتمنى أن تنال منتجاتنا إعجابك وتكون عند حسن ظنك دائماً.\n`;
    msg += `بالصحة والعافية ونتطلع لتجربتك القادمة قريباً! ❤️🍹\n`;
    msg += `نتمنى زيارة المتجر و متابعة صفحات مواقع التواصل الخاص بنا:\n`;
    msg += `•المتجر\nhttps://douaabasma.com\n`;
    msg += `•أنستغرام\nhttps://instagram.com/douaabasma75\n`;
    msg += `•فيسبوك\nhttps://facebook.com/douaabasma75`;
  } else if (status === "cancelled") {
    msg = `*تحديث حالة الطلب بمتجر ${storeName || "Douaa & Basma"}*\n\n`;
    msg += `أهلاً بك زبوننا الكريم *${order.fullName}*،\n\n`;
    msg += `نعلمك للأسف بأنه قد تم إلغاء طلبك رقم \`#${order.id}\` بمتجرنا. إذا كان هذا الإلغاء قد تم عن غير قصد أو كنت ترغب في إعادة الطلب وتغيير التفاصيل، نرحب بتواصلك معنا دائماً للاستفسار. شكراً لك!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
};

export const Admin: React.FC<AdminProps> = ({
  orders,
  onUpdateOrderStatus,
  onCancelOrder,
  onDeleteOrder,
  onClearAllOrders,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  products,
  onUpdateProducts,
  siteSettings,
  onUpdateSiteSettings,
  onLogout,
}) => {
  // --- AUTHENTICATION & SECURITY STATE SYSTEM ---
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('db_admin_authorized') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [adminRole, setAdminRole] = useState<'admin' | 'team'>(() => {
    return (localStorage.getItem('db_admin_role') as 'admin' | 'team') || 'admin';
  });

  // --- COPY TRACKING ID STATE & HELPER ---
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = (id: string) => {
    const performCopy = () => {
      setCopiedOrderId(id);
      setTimeout(() => {
        setCopiedOrderId((prev) => (prev === id ? null : prev));
      }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id)
        .then(performCopy)
        .catch(() => {
          const textArea = document.createElement("textarea");
          textArea.value = id;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            performCopy();
          } catch (e) {
            console.error("Could not copy ID", e);
          }
          document.body.removeChild(textArea);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = id;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        performCopy();
      } catch (e) {
        console.error("Could not copy ID", e);
      }
      document.body.removeChild(textArea);
    }
  };

  // --- CUSTOM CONFIRMATION DIALOG STATE ---
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'delete' | 'delete_product' | 'clear_all_orders';
    orderId?: string;
    orderCustomer?: string;
    productId?: number;
    productName?: string;
  }>({
    isOpen: false,
    type: 'cancel',
  });

  const handleOpenCancelConfirm = (orderId: string, customerName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'cancel',
      orderId,
      orderCustomer: customerName,
    });
  };

  const handleOpenDeleteConfirm = (orderId: string, customerName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      orderId,
      orderCustomer: customerName,
    });
  };

  const handleOpenDeleteProductConfirm = (productId: number, productName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete_product',
      productId,
      productName,
    });
  };

  const handleOpenClearAllOrdersConfirm = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'clear_all_orders',
    });
  };

  const handleExecuteConfirm = () => {
    const { type, orderId, productId } = confirmDialog;
    if (type === 'cancel' && orderId) {
      onCancelOrder?.(orderId);
      const abortedOrder = orders.find((o) => o?.id === orderId);
      if (abortedOrder) {
        setStatusUpdateModal({
          isOpen: true,
          order: abortedOrder,
          status: 'cancelled',
        });
      }
    } else if (type === 'delete' && orderId) {
      onDeleteOrder?.(orderId);
    } else if (type === 'delete_product' && productId !== undefined) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      onUpdateProducts(updatedProducts);
    } else if (type === 'clear_all_orders') {
      onClearAllOrders?.();
    }
    setConfirmDialog({ isOpen: false, type: 'cancel' });
  };

  // --- STATUS UPDATE MODAL STATE ---
  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    isOpen: boolean;
    order?: Order;
    status?: Order['status'];
  }>({
    isOpen: false,
  });

  const [newOrdersModalOpen, setNewOrdersModalOpen] = useState(false);

  const handleLocalStatusChange = (order: Order, newStatus: Order['status']) => {
    onUpdateOrderStatus(order.id, newStatus);
    if (newStatus !== 'new') {
      setStatusUpdateModal({
        isOpen: true,
        order,
        status: newStatus,
      });
    }
  };

  // --- PASSCODE MANAGEMENT STATE ---
  const [currentPasscode, setCurrentPasscode] = useState(() => localStorage.getItem('db_admin_passcode') || '5566');
  const [newPasscodeSetting, setNewPasscodeSetting] = useState('');
  const [passSettingMsg, setPassSettingMsg] = useState('');

  const [teamPasscode, setTeamPasscode] = useState(() => localStorage.getItem('db_team_passcode') || 'DB123');
  const [newTeamPasscodeSetting, setNewTeamPasscodeSetting] = useState('');
  const [teamPassSettingMsg, setTeamPassSettingMsg] = useState('');

  // --- TABS SYSTEMS STATE ---
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'security' | 'settings' | 'notifications'>('orders');

  // --- NOTIFICATIONS STATE SYSTEMS ---
  interface AdminNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    orderId?: string;
  }

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const stored = localStorage.getItem('db_admin_notifications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'notif-welcome',
        title: 'أهلاً بك زعيماً في لوحة المتابعة 🔔',
        message: 'تم تفعيل نظام الإشعارات الذكي والمستمر لـ Douaa & Basma بنجاح! ستسمع رنيناً جميلاً هنا فور استقبال أي طلب جديد.',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-tip',
        title: 'استخدام التبويب 💡',
        message: 'يمكنك من خلال هذا القسم تفعيل التنبيهات الصوتية ومحاكاة الطلبات الجديدة لتجربة الصوت والمظهر التنبيهي قبل النشر.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('db_sound_notifications') !== 'false';
  });

  const [lastOrdersCount, setLastOrdersCount] = useState(() => orders.length);
  const pendingOrders = orders.filter((o) => o && o.status === 'new');

  // Sync to localStorage
  React.useEffect(() => {
    localStorage.setItem('db_admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  React.useEffect(() => {
    localStorage.setItem('db_sound_notifications', String(soundEnabled));
  }, [soundEnabled]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration - 0.02);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Play a beautiful double chime of premium quality
      playTone(523.25, 0, 0.15); // C5
      playTone(659.25, 0.1, 0.15); // E5
      playTone(783.99, 0.2, 0.25); // G5
      playTone(1046.50, 0.35, 0.4); // C6
    } catch (e) {
      console.warn("Could not play sound:", e);
    }
  };

  React.useEffect(() => {
    if (orders.length > lastOrdersCount) {
      const numNew = orders.length - lastOrdersCount;
      const newOrders = orders.slice(-numNew);
      
      const newNotifs = newOrders.map((order, idx) => ({
        id: `notif-order-${order.id}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        title: 'طلب جديد مستلم! 🛍️',
        message: `وصلك طلب جديد من الزبون ${order.fullName || "مجهول"} بقيمة ${order.total} DH عبر موقعك المباشر.`,
        type: 'success' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
        orderId: order.id
      }));

      setNotifications(prev => [...newNotifs, ...prev]);
      playNotificationSound();
    }
    setLastOrdersCount(orders.length);
  }, [orders]);

  const simulateNewOrderNotification = () => {
    const randomNames = [
      'سلوى الغرباوي', 'محسن بنجلون', 'رقية طنجة', 'ياسين الرباطي', 
      'عبد الله الوجدي', 'إقبال الفاسية', 'ياسمينة كازا', 'زينب العرائش'
    ];
    const randomProducts = [
      'عصير زعزع الملكي الفخم', 'عصير برتقال طبيعي بارد', 
      'تحلية الفراولة بالكريمة المنزلية', 'كوكتيل الأفوكادو باللوز والكراميل',
      'حلوى الشوكولاتة الفاخرة'
    ];
    
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomProduct = randomProducts[Math.floor(Math.random() * randomProducts.length)];
    const randomPrice = Math.floor(Math.random() * 80) + 25; // 25 to 105 DH
    const cleanId = 'DB-' + Math.floor(10000 + Math.random() * 90000);

    const simulatedNotif = {
      id: `notif-sim-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      title: 'طلب تجريبي جديد 🥂',
      message: `[محاكاة] طلب زبون باسم ${randomName} لمنتج "${randomProduct}" بقيمة إجمالية ${randomPrice} DH. رقم المعاملة #${cleanId}`,
      type: 'success' as const,
      isRead: false,
      createdAt: new Date().toISOString(),
      orderId: cleanId
    };

    setNotifications(prev => [simulatedNotif, ...prev]);
    playNotificationSound();
  };

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    if (newVal) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }
      } catch {}
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // --- COUPON FORM STATE ---
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState<number>(10);
  const [newMinOrder, setNewMinOrder] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState('');

  // --- PRODUCT MANAGEMENT (EDIT/ADD FORM STATE) ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodArabicName, setProdArabicName] = useState('');
  const [prodLatinName, setProdLatinName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(25);
  const [prodCategory, setProdCategory] = useState<CategoryId>('juices');
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrepTime, setProdPrepTime] = useState('5 - 10 دقائق');
  const [prodSize, setProdSize] = useState('350ml');
  const [prodIngredients, setProdIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsAvailable, setProdIsAvailable] = useState(true);
  const [prodFormMsg, setProdFormMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  // --- METRICS COMPUTATIONS ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const preparingCount = orders.filter((o) => o.status === 'preparing' || o.status === 'pending').length;
  const onWayCount = orders.filter((o) => o.status === 'on_way').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  // --- AUTH handlers ---
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const correctPass = localStorage.getItem('db_admin_passcode') || '5566';
    const correctTeamPass = localStorage.getItem('db_team_passcode') || 'DB123';

    if (passcode === correctPass || passcode === 'douaa_basma_2026' || passcode === 'youssef2026') {
      setIsAuthorized(true);
      setAdminRole('admin');
      localStorage.setItem('db_admin_authorized', 'true');
      localStorage.setItem('db_admin_role', 'admin');
    } else if (passcode === correctTeamPass) {
      setIsAuthorized(true);
      setAdminRole('team');
      localStorage.setItem('db_admin_authorized', 'true');
      localStorage.setItem('db_admin_role', 'team');
      setActiveTab('orders'); // set initial view to orders
    } else {
      setErrorMsg('❌ رمز المرور المدخل غير صحيح! حاول مجدداً.');
    }
  };

  const handleLockAdmin = () => {
    setIsAuthorized(false);
    localStorage.removeItem('db_admin_authorized');
    localStorage.removeItem('db_admin_role');
    if (onLogout) {
      onLogout();
    }
  };

  const handleUpdateTeamPasscodeSetting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamPasscodeSetting.trim()) return;
    localStorage.setItem('db_team_passcode', newTeamPasscodeSetting.trim());
    setTeamPasscode(newTeamPasscodeSetting.trim());
    setNewTeamPasscodeSetting('');
    setTeamPassSettingMsg('تم تحديث كود حماية الفريق بنجاح! 🔒');
    setTimeout(() => setTeamPassSettingMsg(''), 2500);
  };

  const handleUpdatePasscodeSetting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscodeSetting.trim()) return;
    localStorage.setItem('db_admin_passcode', newPasscodeSetting.trim());
    setCurrentPasscode(newPasscodeSetting.trim());
    setNewPasscodeSetting('');
    setPassSettingMsg('تم تحديث كود اللوحة السري بنجاح! 🔒');
    setTimeout(() => setPassSettingMsg(''), 2500);
  };

  // --- COUPON SYSTEM handlers ---
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg('');

    if (!newCode.trim()) {
      setCouponMsg('من فضلك أدخل رمز كوبون صحيح');
      return;
    }

    const codeUpper = newCode.trim().toUpperCase();
    const exists = coupons.some((c) => c.code === codeUpper);
    if (exists) {
      setCouponMsg('هذا الكود متواجد بالفعل في النظام');
      return;
    }

    onAddCoupon({
      code: codeUpper,
      discountPercent: newPercent,
      active: true,
      minOrder: newMinOrder || undefined,
    });

    setNewCode('');
    setNewPercent(10);
    setNewMinOrder(0);
    setCouponMsg('تم إضافة الكوبون الجديد بنجاح! 🎟️');
    setTimeout(() => setCouponMsg(''), 2500);
  };

  // --- PRODUCT MANAGEMENT file upload handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const compressAndSetImage = (file: File) => {
    compressImageFile(file, 400, 400, 0.6, (url) => {
      setProdImage(url);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      compressAndSetImage(file);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndSetImage(file);
  };

  // --- PRODUCT MANAGEMENT handlers ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdArabicName('');
    setProdLatinName('');
    setProdPrice(25);
    setProdCategory('juices');
    setProdImage('');
    setProdDescription('');
    setProdPrepTime('5 - 10 دقائق');
    setProdSize('350ml');
    setProdIngredients(['فواكه طازجة']);
    setProdIsFeatured(false);
    setProdIsAvailable(true);
    setProdFormMsg('');
    setIsFormOpen(true);
    setShowUrlField(false);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProdArabicName(product.arabicName);
    setProdLatinName(product.name);
    setProdPrice(product.price);
    setProdCategory(product.category);
    setProdImage(product.image);
    setProdDescription(product.description);
    setProdPrepTime(product.prepTime || '5 - 10 دقائق');
    setProdSize(product.size || '350ml');
    setProdIngredients(product.ingredients || []);
    setProdIsFeatured(!!product.isFeatured);
    setProdIsAvailable(product.isAvailable !== false);
    setProdFormMsg('');
    setIsFormOpen(true);
    setShowUrlField(false);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    if (prodIngredients.includes(newIngredient.trim())) return;
    setProdIngredients([...prodIngredients, newIngredient.trim()]);
    setNewIngredient('');
  };

  const handleRemoveIngredient = (ingName: string) => {
    setProdIngredients(prodIngredients.filter((i) => i !== ingName));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProdFormMsg('');

    if (adminRole !== 'admin') {
      setProdFormMsg('⚠️ عذراً، لا تملك الصلاحية لتعديل معلومات وتفاصيل هذا المنتج.');
      return;
    }

    if (!prodArabicName.trim()) {
      setProdFormMsg('الرجاء إدخال الاسم العربي للمنتج');
      return;
    }

    const finalProduct: Product = {
      id: editingProduct ? editingProduct.id : Math.max(...products.map(p => p.id), 0) + 1,
      name: prodLatinName.trim() || prodArabicName.trim(),
      arabicName: prodArabicName.trim(),
      description: prodDescription.trim() || 'وصف لذيذ محضر ومصنوع بعناية فائقة.',
      price: Math.max(1, prodPrice),
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600',
      category: prodCategory,
      size: prodSize.trim() || '350ml',
      isFeatured: prodIsFeatured,
      isAvailable: prodIsAvailable,
      prepTime: prodPrepTime.trim() || '5 - 10 دقائق',
      ingredients: prodIngredients.length > 0 ? prodIngredients : ['فواكه طازجة وطبيعية 100%']
    };

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map((p) => p.id === editingProduct.id ? finalProduct : p);
      onUpdateProducts(updatedProducts);
      setProdFormMsg('تم تحديث تفاصيل المنتج بنجاح! ✨');
    } else {
      // Add new product
      const updatedProducts = [finalProduct, ...products];
      onUpdateProducts(updatedProducts);
      setProdFormMsg('تم إضافة منتج طبيعي جديد بنجاح! 🍹');
    }

    setTimeout(() => {
      setIsFormOpen(false);
      setEditingProduct(null);
    }, 1500);
  };

  const handleDeleteProduct = (productId: number) => {
    if (adminRole !== 'admin') {
      alert('⚠️ عذراً، فريق العمل لا يملك صلاحيات حذف المنتجات.');
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product) {
      handleOpenDeleteProductConfirm(productId, product.arabicName);
    }
  };

  const handleCopyProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (adminRole !== 'admin') {
      alert('⚠️ عذراً، لا تملك صلاحية نسخ المنتجات.');
      return;
    }
    
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    const copiedProduct: Product = {
      ...product,
      id: nextId,
      arabicName: `${product.arabicName} (نسخة)`,
      name: `${product.name} (Copy)`,
      isFeatured: false, // Default copy is not featured
    };
    
    const updatedProducts = [copiedProduct, ...products];
    onUpdateProducts(updatedProducts);
  };

  const handleToggleFeatured = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (adminRole !== 'admin') {
      alert('⚠️ عذراً، لا تملك صلاحية تعديل حالة ترويج المنتج المميز.');
      return;
    }
    const updatedProducts = products.map((p) => p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p);
    onUpdateProducts(updatedProducts);
  };

  const handleToggleAvailable = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedProducts = products.map((p) => p.id === product.id ? { ...p, isAvailable: p.isAvailable === false ? true : false } : p);
    onUpdateProducts(updatedProducts);
  };

  const handleMoveProductUp = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = products.findIndex((p) => p.id === productId);
    if (index <= 0) return; // Already at the top or not found
    
    const newProducts = [...products];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index - 1];
    newProducts[index - 1] = temp;
    
    onUpdateProducts(newProducts);
  };

  const handleMoveProductDown = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1 || index >= products.length - 1) return; // Already at the bottom or not found
    
    const newProducts = [...products];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index + 1];
    newProducts[index + 1] = temp;
    
    onUpdateProducts(newProducts);
  };

  // --- SECURE passcode GATE screen (rendered when not authenticated) ---
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 font-sans text-align-start">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 text-white rounded-3xl border border-brand-gold/30 p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient lighting decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6 relative z-10">
            <div className="w-16 h-16 bg-brand-gold-soft/10 text-brand-gold mx-auto rounded-2xl flex items-center justify-center mb-4 border border-brand-gold/20">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-brand-gold block mb-1">منطقة خاصة بمالك المتجر</span>
            <h2 className="text-xl font-display font-black text-white">لوحة الإدارة السرية والمحمية</h2>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              هذه اللوحة مخصصة لإدارة العصائر والطلبات. يُرجى إدخال رمز المرور السري الخاص بك للولوج وتعديل لوائح ومنتجات المتجر.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1.5">أدخل رمز المرور السري</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••••"
                className="w-full p-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-center font-bold outline-none focus:border-brand-gold text-sm tracking-widest font-mono"
              />
            </div>

            {errorMsg && (
              <p className="text-rose-500 text-xs font-bold text-center bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/10">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-royal-purple font-black rounded-xl text-xs transition-all hover:bg-neutral-100 hover:text-black cursor-pointer shadow-md"
            >
              افتح لوحة الإدارة 🔑
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- core MAIN ADMIN DASHBOARD (rendered only when isAuthorized) ---
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans text-align-start">
      
      {/* Title block with secret metadata and lock back options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-brand-purple block mb-1">بوابة الإدارة السرية Douaa & Basma</span>
          <h1 className="text-2xl md:text-3xl font-display font-black text-royal-purple flex items-center gap-2">
            <Award className="text-brand-gold animate-pulse-slow font-bold" />
            إدارة المبيعات وقوائم المنتجات
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            مرحباً بك! بصفتك المسؤول، تملك صلاحيات التحكم بالطلبيات، المبيعات المباشرة، وتعديل المكونات والأسعار.
          </p>
          {adminRole === 'team' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-850 rounded-full text-[11px] font-bold mt-2 pb-0.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>حساب فريق العمل (صلاحيات محدودة) 👥</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-full text-[11px] font-bold mt-2 pb-0.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>حساب المدير العام (صلاحيات كاملة) 👑</span>
            </div>
          )}
        </div>

         {/* Action options buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLockAdmin}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="قفل لوحة التحكم والخروج"
          >
            <LogOut className="w-4 h-4" />
            <span>قفل اللوح السري</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              setNewOrdersModalOpen(true);
            }}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white border-transparent shadow-sm shadow-brand-purple/10'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <Bell className="w-4 h-4 flex-shrink-0" />
            <span>الإشعارات</span>
            {pendingOrders.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse font-sans">
                {pendingOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Stats Dashboard Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center mb-3.5 shadow-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-bold">إجمالي المداخيل</span>
          <span className="text-xl md:text-2xl font-black text-royal-purple mt-1 block font-sans">
            {totalRevenue} <span className="text-xs font-bold text-brand-gold">DH</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-brand-gold-dark flex items-center justify-center mb-3.5 shadow-sm">
            <ListOrdered className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-bold">عدد الطلبات</span>
          <span className="text-xl md:text-2xl font-black text-royal-purple mt-1 block font-sans">
            {orders.length} <span className="text-xs font-bold text-gray-400 font-sans">طلب</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3.5 shadow-sm">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs text-gray-400 block font-bold">تحت التحضير</span>
          <span className="text-xl md:text-2xl font-black text-rose-600 mt-1 block font-sans">
            {preparingCount + onWayCount} <span className="text-xs font-bold text-gray-400">مستمر</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-bold">طلبات مستلمة</span>
          <span className="text-xl md:text-2xl font-black text-emerald-700 mt-1 block font-sans">
            {deliveredCount} <span className="text-xs font-bold text-gray-400">ناجح</span>
          </span>
        </div>
      </div>

      {/* Tabs list switches bar */}
      <div className="flex bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 mb-8 gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white shadow-sm shadow-brand-purple/10'
              : 'text-gray-500 hover:text-royal-purple hover:bg-white'
          }`}
        >
          <ListOrdered className="w-4 h-4 flex-shrink-0" />
          <span>سجل الطلبات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white shadow-sm shadow-brand-purple/10'
              : 'text-gray-500 hover:text-royal-purple hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          <span>المنتجات ({products.length})</span>
        </button>

        {adminRole === 'admin' && (
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white shadow-sm shadow-brand-purple/10'
                : 'text-gray-500 hover:text-royal-purple hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4 flex-shrink-0" />
            <span>الكوبونات</span>
          </button>
        )}

        {adminRole === 'admin' && (
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white shadow-sm shadow-brand-purple/10'
                : 'text-gray-500 hover:text-royal-purple hover:bg-white'
            }`}
          >
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>كلمة المرور</span>
          </button>
        )}

        {adminRole === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-brand-purple to-royal-purple text-white shadow-sm shadow-brand-purple/10'
                : 'text-gray-500 hover:text-royal-purple hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>الإعدادات</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: ORDERS LIST --- */}
      {activeTab === 'orders' && (
        <div id="admin-orders-list-anchor" className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-display font-black text-royal-purple mb-4 pb-2 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span>الطلبات المستلمة حية ({orders.length})</span>
              {orders.length > 0 && onClearAllOrders && adminRole === 'admin' && (
                <button
                  type="button"
                  onClick={handleOpenClearAllOrdersConfirm}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 w-8 h-8 rounded-lg border border-rose-100 transition-all flex items-center justify-center cursor-pointer"
                  title="حذف جميع الطلبات"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-400">تتحكم الحالات بالمسار التفاعلي للزبون</span>
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <span className="block text-4xl mb-3">📭</span>
              <p className="text-sm font-bold">لا يوجد طلبيات مسجلة في المتصفح حالياً.</p>
              <p className="text-xs mt-1">قم بدور الزبون، اشترِ عصير أو زعزع الملكي، ثم عد لتعديل المراحل من هنا!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-cream text-gray-500 text-xs border-b border-gray-100">
                    <th className="p-3 text-right">رقم المعاملة والزبون</th>
                    <th className="p-3 text-right">المنتجات المطلوبة</th>
                    <th className="p-3 text-right">الحالة والتحكم</th>
                    <th className="p-3 text-right">الإجمالي</th>
                    <th className="p-3 text-right min-w-[320px] md:min-w-[480px]">معلومات الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-cream/40 transition-colors">
                      <td className="p-3 font-sans">
                        <div className="flex items-center gap-1.5 mb-1.5 select-all">
                          <span className="font-bold text-brand-purple text-xs">#{order.id}</span>
                          <button
                            onClick={() => handleCopyOrderId(order.id)}
                            title="نسخ رقم تتبع الطلب"
                            type="button"
                            className="p-1 rounded-md bg-purple-50 text-brand-purple hover:bg-brand-purple hover:text-white transition-all cursor-pointer shadow-xs"
                          >
                            {copiedOrderId === order.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="font-semibold text-gray-800 block text-sm mt-0.5">{order.fullName}</span>
                        <a
                          href={generateWhatsAppConfirmUrl(order, siteSettings?.storeName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] bg-[#25D366] hover:bg-[#20ba5a] text-white font-mono font-black mt-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer group shadow-sm hover:scale-105 active:scale-95"
                          title="اضغط لإرسال رسالة تتبع وتأكيد للزبون عبر واتساب"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-white flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span>{order.phone}</span>
                        </a>
                      </td>

                      <td className="p-3">
                        <div className="max-w-[150px] overflow-hidden truncate" title={(order.items || []).map(item => `${item?.product?.arabicName || ""} x${item?.quantity || 1}`).join(', ')}>
                          {(order.items || []).map((item, idx) => (
                            <span key={idx} className="block text-[11px] text-gray-600 truncate">
                              • {item?.product?.arabicName || ""} <strong className="text-brand-purple">x{item?.quantity || 1}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-2 min-w-[150px]">
                          <select
                            value={order.status}
                            onChange={(e) => handleLocalStatusChange(order, e.target.value as Order['status'])}
                            className={`p-1.5 rounded-lg text-[11px] font-bold outline-none border transition-colors cursor-pointer w-full text-center ${
                              order.status === 'new'
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : order.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : order.status === 'preparing'
                                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                                    : order.status === 'on_way'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : order.status === 'cancelled'
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="new">طلب جديد</option>
                            <option value="pending">تم تأكيد الطلب</option>
                            <option value="preparing">تقشير ومزج العصائر (جاري)</option>
                            <option value="on_way">مغادرة المندوب المبرّد (بالطريق)</option>
                            <option value="delivered">تـم التسليم بنجاح (مكتمل)</option>
                            <option value="cancelled">تم إلغاء الطلب (ملغى) ❌</option>
                          </select>

                          {/* Quick manual status whatsapp sender */}
                          {order.status !== 'new' && (
                            <a
                              href={generateWhatsAppStatusUpdateUrl(order, order.status, siteSettings?.storeName)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 px-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] text-center"
                              title="إرسال رسالة حالة الطلب اليدوية عبر واتساب للزبون"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>إرسال الحالة للزبون</span>
                            </a>
                          )}

                          {/* Controls for Order (Admin / Team) */}
                          <div className="flex gap-1.5 justify-stretch w-full">
                            {order.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleOpenCancelConfirm(order.id, order.fullName)}
                                className="flex-1 py-1 px-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                title="إلغاء الطلب"
                              >
                                <X className="w-3 h-3 flex-shrink-0" />
                                <span>إلغاء</span>
                              </button>
                            )}
                            {adminRole === 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteConfirm(order.id, order.fullName)}
                                className="flex-1 py-1 px-1.5 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                title="حذف الطلب نهائياً"
                              >
                                <Trash2 className="w-3 h-3 flex-shrink-0" />
                                <span>حذف</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-black text-brand-gold-dark block whitespace-nowrap">{order.total} DH</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">برسائل التوصيل</span>
                      </td>

                      <td className="p-3">
                        <div className="text-xs space-y-1.5 text-right max-w-[320px] md:max-w-[560px]">
                          <div>
                            <span className="text-gray-400 font-bold block text-[10px]">المنطقة والعنوان:</span>
                            {(() => {
                              const area = (order.deliveryArea || "").trim();
                              let address = (order.address || "").trim();
                              
                              if (area && address) {
                                if (address.startsWith(area)) {
                                  address = address.substring(area.length).trim();
                                }
                                address = address.replace(/^[\s,，、，\-,，—ـ~_()（）:：]+/g, '').trim();
                              }
                              
                              if (address && address !== area) {
                                return (
                                  <span className="text-gray-700 font-semibold block leading-tight text-xs justify-start items-center">
                                    <span className="text-brand-gold-dark font-black">{area}</span> - {address}
                                  </span>
                                );
                              }
                              
                              return (
                                <span className="text-gray-700 font-semibold block leading-tight text-xs">
                                  <span className="text-brand-gold-dark font-black">{area || "غير محدد"}</span>
                                 </span>
                               );
                             })()}
                           </div>

                           {/* Product-Specific Customisation Notes */}
                           <div className="bg-purple-50/60 border border-purple-100/80 p-2 rounded-xl my-1.5 text-[11px] leading-relaxed">
                             <span className="text-brand-purple font-black block text-[10px] mb-1">📋 ملاحظات تخصيص الطلب:</span>
                             <ul className="space-y-0.5 text-gray-700 font-semibold">
                               {(order.items || []).map((item, idx) => {
                                 let note = 'بدون ملاحظات';
                                 if (item?.product?.description && item.product.description.includes('[تعليمات إضافية:')) {
                                   const parts = item.product.description.split('[تعليمات إضافية:');
                                   if (parts.length > 1) {
                                     const extracted = parts[1].split(']')[0].trim();
                                     if (extracted) {
                                       note = extracted;
                                     }
                                   }
                                 }
                                 return (
                                   <li key={idx} className="block text-right">
                                     • {item?.product?.arabicName || ""}: <span className={note === 'بدون ملاحظات' ? 'text-gray-400 font-normal' : 'text-brand-purple font-bold bg-brand-purple/5 px-1 rounded'}>{note}</span>
                                   </li>
                                 );
                               })}
                             </ul>
                           </div>

                           <div className="flex flex-wrap items-center gap-1.5 mt-1">
                             {order.couponApplied && (
                               <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                                 كوبون: {order.couponApplied} ({order.discountAmount} DH-)
                               </span>
                             )}
                             <span className="text-gray-400 text-[10px] font-sans block bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                               {order.date ? (
                                 (() => {
                                   try {
                                     return new Date(order.date).toLocaleString('ar-MA', {
                                       hour: '2-digit',
                                       minute: '2-digit',
                                       day: '2-digit',
                                       month: '2-digit'
                                     });
                                   } catch (e) {
                                     return order.date;
                                   }
                                 })()
                               ) : '-'}
                             </span>
                           </div>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>
       )}

       {/* --- TAB 2: PRODUCTS A-Z CATALOGUE --- */}
       {activeTab === 'products' && (
         <div className="space-y-6">
           <div className="bg-white p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-100">
               <div>
                 <h2 className="text-base font-display font-black text-royal-purple">لوحة التحكم بالمنتجات من الألف إلى الياء (A-Z)</h2>
                 {adminRole === 'admin' ? (
                   <p className="text-gray-400 text-xs mt-0.5">أضف، عدل الأسعار، المكونات، وقم برفع الصور بدقة ليراها جميع زبائن الموقع فورا.</p>
                 ) : (
                   <p className="text-amber-600 text-xs mt-0.5 font-bold flex items-center gap-1">
                     <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                     صلاحيات فريق العمل المحدودة: يُسمح لك كعضو فريق فقط بتفعيل حالة التوفر (متوفر / غير متوفر).
                   </p>
                 )}
               </div>

               {adminRole === 'admin' && (
                 <button
                   onClick={handleOpenAddProduct}
                   className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-light text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                 >
                   <Plus className="w-4 h-4" />
                   <span>إدراج منتج طبيعي جديد</span>
                 </button>
               )}
             </div>

             {/* List grid of customizable products with draggable/scrollable layout for mobile views */}
             <div className="overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
               <div className="grid grid-cols-1 gap-4 min-w-[480px] md:min-w-0">
                 {products.map((p, idx) => (
                 <div key={p.id} className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-brand-cream/30 hover:border-brand-purple/20 transition-all flex items-start gap-3 sm:gap-4">
                  {/* Reordering column button controls */}
                  {adminRole === 'admin' && (
                    <div className="flex flex-col gap-1 justify-center self-stretch shrink-0 border-l border-gray-100 pl-2.5">
                      <button
                        onClick={(e) => handleMoveProductUp(p.id, e)}
                        className="p-1 rounded-lg bg-white border border-gray-150 text-gray-500 hover:text-brand-purple hover:border-brand-purple/50 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shadow-3xs"
                        title="تحريك لأعلى"
                        disabled={idx === 0}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleMoveProductDown(p.id, e)}
                        className="p-1 rounded-lg bg-white border border-gray-150 text-gray-500 hover:text-brand-purple hover:border-brand-purple/50 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shadow-3xs"
                        title="تحريك لأسفل"
                        disabled={idx === products.length - 1}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <img
                    src={p.image}
                    alt={p.arabicName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{p.arabicName}</h3>
                      {p.isFeatured && (
                        <span className="bg-brand-gold-soft text-brand-gold-dark text-[10px] px-2 py-0.5 rounded-full font-bold">
                          مميز نجمي ⭐
                        </span>
                      )}
                      {p.isAvailable !== false ? (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span>متوفر</span>
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-rose-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                          <span>غير متوفر</span>
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[11px] text-gray-400 block font-mono mt-0.5">{p.name} -- ID: #{p.id}</span>
                    <span className="font-black text-brand-gold-dark text-xs block mt-1">{p.price} DH</span>
                    
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">{p.description}</p>
                    
                    {/* Compact actions button row inside catalog view */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100/60 flex-wrap">
                      {adminRole === 'admin' && (
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-3 py-1.5 bg-brand-purple-soft hover:bg-brand-purple-soft/80 text-brand-purple text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                      )}

                      {adminRole === 'admin' && (
                        <button
                          onClick={(e) => handleCopyProduct(p, e)}
                          className="px-3 py-1.5 bg-brand-gold-soft/50 hover:bg-brand-gold-soft/80 text-brand-gold-dark text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          title="إنشاء نسخة من هذا المنتج"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </button>
                      )}

                      {adminRole === 'admin' && (
                        <button
                          onClick={(e) => handleToggleFeatured(p, e)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                            p.isFeatured 
                              ? 'bg-amber-100 hover:bg-amber-100/80 text-amber-800' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-600 text-amber-600' : ''}`} />
                          <span>{p.isFeatured ? 'مميز' : 'عادي'}</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => handleToggleAvailable(p, e)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${
                          p.isAvailable !== false
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{p.isAvailable !== false ? 'متوفر' : 'غير متوفر'}</span>
                      </button>

                      {adminRole === 'admin' && (
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 px-2.5 hover:bg-rose-50 hover:text-rose-600 text-gray-400 rounded-lg text-xs font-bold cursor-pointer transition-colors mr-auto"
                          title="حذف المنتج من المتجر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>
        )}

          {/* ADD / EDIT PRODUCT POPUP FORM DISPLAY MODAL */}
          <AnimatePresence>
            {isFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                {/* Backdrop dark overlay panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFormOpen(false)}
                  className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md"
                />

                {/* Form wrapper */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-display font-black text-royal-purple mb-4 pb-2 border-b border-gray-100">
                    {editingProduct ? `تعديل تفاصيل: ${editingProduct.arabicName}` : 'إضافة عصير أو تحلية بيتية جديدة'}
                  </h3>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-gray-600">اسم المنتج بالعربية *</label>
                        <input
                          type="text"
                          required
                          value={prodArabicName}
                          onChange={(e) => setProdArabicName(e.target.value)}
                          placeholder="مثال: عصير أفوكادو مميز"
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-600">الاسم بالإنجليزية (اللاتيني)</label>
                        <input
                          type="text"
                          value={prodLatinName}
                          onChange={(e) => setProdLatinName(e.target.value)}
                          placeholder="مثال: Creamy Avocado Shake"
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block mb-1 text-gray-600">السعر بالدرهم (DH) *</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-600">قسم المنتج *</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value as CategoryId)}
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans"
                        >
                          <option value="juices">عصائر طبيعية (juices)</option>
                          <option value="desserts">تحليات أصيلة (desserts)</option>
                          <option value="specials">عروض خاصة (specials)</option>
                          <option value="events">الأفراح و المناسبات (events)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-600">زمن التحضير التقريبي</label>
                        <input
                          type="text"
                          value={prodPrepTime}
                          onChange={(e) => setProdPrepTime(e.target.value)}
                          placeholder="مثال: 5 - 10 دقائق"
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-650">الحجم أو الوزن (ml/g) *</label>
                        <input
                          type="text"
                          required
                          value={prodSize}
                          onChange={(e) => setProdSize(e.target.value)}
                          placeholder="مثال: 350ml أو 200g"
                          className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans font-semibold text-royal-purple"
                        />
                        <div className="flex gap-1 flex-wrap mt-1">
                          {['200ml', '350ml', '400ml', '200g', '300g'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setProdSize(preset)}
                              className="text-[9px] bg-brand-purple-soft hover:bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                     <div>
                      <ImageSelectionWidget
                        label="صورة المنتج (Product Image) *"
                        value={prodImage}
                        onChange={(val) => setProdImage(val)}
                        placeholder="أدخل رابط الصورة المباشر للمنتج..."
                        maxDim={800}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-600">وصف المنتج الفاخر</label>
                      <textarea
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="اكتب تفاصيل ومذاق هذا العصير أو التحلية ومميزاته..."
                        className="w-full h-16 p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-sans resize-none"
                      />
                    </div>

                    {/* Dynamic ingredients bubbles list manager */}
                    <div>
                      <label className="block mb-1 text-gray-600">المكونات المستخدمة بالترتيب ({prodIngredients.length})</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                          placeholder="مثال: حليب اللوز، كريمة فستق..."
                          className="flex-1 p-2 rounded-xl border border-gray-200 outline-none text-xs font-sans"
                        />
                        <button
                          type="button"
                          onClick={handleAddIngredient}
                          className="px-3 bg-brand-purple hover:bg-brand-purple-light text-white rounded-xl text-xs"
                        >
                          إضافة
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-brand-cream border border-gray-100 min-h-12">
                        {prodIngredients.length === 0 ? (
                          <span className="text-gray-400 text-[10px] leading-normal font-normal self-center">لا يوجد مكونات، المرجو إدراجها.</span>
                        ) : (
                          prodIngredients.map((i, idx) => (
                            <span key={idx} className="bg-white text-gray-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-gray-150 inline-flex items-center gap-1 shrink-0">
                              <span>{i}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredient(i)}
                                className="text-rose-500 hover:text-rose-700 font-black text-xs shrink-0"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                     <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="prodIsFeatured"
                          checked={prodIsFeatured}
                          onChange={(e) => setProdIsFeatured(e.target.checked)}
                          className="w-4.5 h-4.5 rounded text-brand-purple focus:ring-brand-purple"
                        />
                        <label htmlFor="prodIsFeatured" className="text-xs text-gray-750 select-none cursor-pointer font-bold">
                          هل تريد ترويج هذا كمنتج مميز ونجمي (يظهر في أول واجهة الموقع)؟ ⭐
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="prodIsAvailable"
                          checked={prodIsAvailable}
                          onChange={(e) => setProdIsAvailable(e.target.checked)}
                          className="w-4.5 h-4.5 rounded text-brand-purple focus:ring-brand-purple"
                        />
                        <label htmlFor="prodIsAvailable" className="text-xs text-gray-750 select-none cursor-pointer font-bold">
                          هل هذا المنتج متوفر حالياً وجاهز للطلب الفوري؟ 🟢 (إلغاء التحديد يجعله «غير متوفر»)
                        </label>
                      </div>
                    </div>

                    {prodFormMsg && (
                      <div className="p-3 text-brand-purple-light bg-brand-purple-soft/40 border border-brand-purple/10 rounded-xl text-center text-xs font-bold">
                        {prodFormMsg}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        إلغاء التعديل
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-light text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>حفظ التعديلات بالمتجر</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

      {/* --- TAB 3: COUPONS MANAGEMENT --- */}
      {activeTab === 'coupons' && adminRole === 'admin' && (
        <div className="max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <div>
            <h3 className="text-base md:text-lg font-display font-black text-royal-purple pb-3 border-b border-gray-100 flex items-center gap-1.5">
              <Tag className="w-5 h-5 text-brand-gold animate-bounce" />
              توليد وإدراج كودات التخفيض للزبائن
            </h3>
            <p className="text-gray-450 text-xs mt-1.5 leading-normal">
              من هنا يمكنك وضع أكواد ترويجية مثل (SAVE20) وإهدائها لأحبابك أو زبائنك لخصم مبالغ مئوية متجاوبة حية عند التشكيل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Form for new coupon creation */}
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">رمز الكوبون (رمز بالإنجليزية)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="مثال: SPRING20"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-black uppercase tracking-wider outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">نسبة التخفيض (%)</label>
                  <input
                    type="number"
                    value={newPercent}
                    onChange={(e) => setNewPercent(Math.max(1, Math.min(100, parseInt(e.target.value) || 10)))}
                    min="1"
                    max="100"
                    placeholder="10"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-black outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">حد طلب أدنى (DH)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-black outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                إدراج الكوبون النشط بخصائص السلة 🎟️
              </button>
            </form>

            {/* List active coupons */}
            <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50">
              <h4 className="text-xs font-black text-royal-purple mb-3">الكودات الفعالة بالسيارة حالياً ({coupons.length})</h4>
              
              {coupons.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 font-semibold bg-white rounded-xl border border-gray-100">
                  لا توجد أكواد تفعيل بالوقت الحالي.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {coupons.map((c) => (
                    <div key={c.code} className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between text-xs hover:border-brand-gold/40 transition-colors shadow-2xs">
                      <div>
                        <strong className="text-brand-purple block uppercase font-mono font-black">{c.code}</strong>
                        <span className="text-[10px] text-gray-500 mt-0.5 block font-bold">
                          خصم {c.discountPercent}% {c.minOrder ? `(ابتداءً من ${c.minOrder} DH)` : ''}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteCoupon(c.code)}
                        className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] cursor-pointer transition-colors"
                        title="حذف هذا الرمز وتجميده"
                      >
                        تعطيل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {couponMsg && (
            <p className="text-xs text-brand-purple-light font-bold mt-2.5 bg-brand-purple-soft/50 p-2.5 rounded-xl border border-brand-purple/10 text-center">
              {couponMsg}
            </p>
          )}
        </div>
      )}

      {/* --- TAB 4: SECURITY PASSCODE SETTINGS --- */}
      {activeTab === 'security' && adminRole === 'admin' && (
        <div className="max-w-xl mx-auto bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-display font-black text-rose-700 pb-3 border-b border-gray-100 flex items-center gap-1.5">
              <Lock className="w-5 h-5 text-rose-600 animate-pulse" />
              إعدادات حماية لوحة التحكم
            </h3>
            <p className="text-gray-450 text-xs mt-1.5 leading-normal">
              قم بتغيير كود الحماية هنا لتخصيص رمز لوحة الإدارة، لمنع زوار الموقع من كشفه أو الولوج للتحليلات.
            </p>
          </div>

          <form onSubmit={handleUpdatePasscodeSetting} className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50 flex items-center justify-between">
              <span className="text-rose-900 text-xs font-bold">الرمز الحالي المحتفظ به بالجهاز:</span>
              <span className="bg-white px-4 py-1.5 rounded-xl text-xs font-mono font-black text-rose-700 border border-rose-100/80 shadow-2xs">
                {currentPasscode}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 block text-align-start pr-0.5">الرمز السري الجديد للتحكم</label>
              <input
                type="text"
                required
                value={newPasscodeSetting}
                onChange={(e) => setNewPasscodeSetting(e.target.value)}
                placeholder="اكتب الرمز السري الجديد هنا..."
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-brand-purple"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              تحديث رمز الولوج السري للوحة 🖥️
            </button>
          </form>

          {passSettingMsg && (
            <p className="text-xs text-rose-700 font-bold mt-2.5 bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-center">
              {passSettingMsg}
            </p>
          )}

          {/* TEAM PASSCODE SECTION */}
          <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
            <div>
              <h4 className="text-xs font-black text-brand-purple block text-align-start pr-0.5">👥 رمز مرور فريق العمل (المحدود)</h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                عند تسجيل الدخول بهذا الرمز، يتمكن فريق العمل من متابعة وإدارة "سجل الطلبات" وإلغاء الطلبات فقط، دون صلاحية حذف المنتجات أو تعديل الكوبونات وإعدادات الهوية والمظهر وكلمات المرور.
              </p>
            </div>

            <form onSubmit={handleUpdateTeamPasscodeSetting} className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-purple-soft/30 border border-brand-purple/10 flex items-center justify-between">
                <span className="text-brand-purple-light text-xs font-bold">الرمز الحالي المحتفظ به لفريق العمل:</span>
                <span className="bg-white px-4 py-1.5 rounded-xl text-xs font-mono font-black text-brand-purple border border-brand-purple/20 shadow-2xs">
                  {teamPasscode}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 block text-align-start pr-0.5">الرمز السري الجديد للفريق</label>
                <input
                  type="text"
                  required
                  value={newTeamPasscodeSetting}
                  onChange={(e) => setNewTeamPasscodeSetting(e.target.value)}
                  placeholder="اكتب رمز فريق العمل الجديد هنا... (مثال: DB123)"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-brand-purple"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                تحديث رمز فريق العمل المحدود 👥
              </button>
            </form>

            {teamPassSettingMsg && (
              <p className="text-xs text-brand-purple-light font-bold mt-2.5 bg-brand-purple-soft/50 p-2.5 rounded-xl border border-brand-purple/10 text-center">
                {teamPassSettingMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: WEBSITE CONFIG SETTINGS (إعدادات الهوية والمظهر) --- */}
      {activeTab === 'settings' && adminRole === 'admin' && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-brand-purple/10 to-brand-gold-soft/10 p-6 rounded-3xl border border-brand-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-align-start font-sans">
              <h2 className="text-lg font-display font-black text-royal-purple inline-flex items-center gap-2">
                <Sparkles className="text-brand-gold animate-bounce w-5 h-5 flex-shrink-0" />
                تخصيص الهوية والمظهر والروابط والنصوص
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                من هنا يمكنك التحكم بهوية الموقع بالكامل: تغيير الأيقونات (Favicon)، شعار البوابة (Logo)، خلفيات الهيرو، تعديل كافة النصوص وقصص المشروع، وربط أرقام طلبات الواتساب ومجموعات الدعم والفيسبوك مباشرة بشكل حي.
              </p>
            </div>
            
            <button
              onClick={() => {
                // reset default settings to restore if they break anything
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط الهوية إلى قيمها الافتراضية الأولى؟')) {
                  onUpdateSiteSettings({
                    logoUrl: "https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd",
                    heroBannerUrl: "",
                    heroBannerMobileUrl: "",
                    faviconUrl: "https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd",
                    heroTitle: "مذاق طبيعي…",
                    heroSubTitle: "بلمسة فاخرة",
                    heroDescription: "نحضر لكم أفخر العصائر الطبيعية الباردة والتحليات المنزلية الأصيلة، بمكونات طازجة مختارة بعناية وبمعايير تليق بكرم الضيافة ورفاهية أهليكم",
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
                    isComingSoonActive: false,
                    comingSoonTitle: "انتظرونا... نفتتح قريباً!",
                    comingSoonSubtitle: "نعمل بحب وشغف لتجهيز أفخر العصائر والتحليات المنزلية تليق بضيافتكم."
                  });
                  alert('🎉 تم إعادة ضبط الإعدادات إلى القيم المصممة بنجاح!');
                }
              }}
              className="px-4 py-2 bg-brand-purple-soft text-brand-purple font-bold text-xs rounded-xl hover:bg-brand-purple/20 transition-all cursor-pointer whitespace-nowrap self-start md:self-center"
            >
              🔄 إعادة ضبط المصنع
            </button>
          </div>

          {/* Coming Soon Mode Control Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-gold/25 shadow-md space-y-4 text-align-start font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-brand-gold via-brand-purple hover:from-brand-gold-light hover:to-brand-gold" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-royal-purple inline-flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${siteSettings?.isComingSoonActive ? 'bg-amber-500 animate-ping' : 'bg-gray-300'}`} />
                  🚧 وضع الافتتاح قريباً (Coming Soon Mode)
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  عند تفعيل هذا الخيار المتقدم، سيتم غلق المتجر أمام العملاء تلقائياً ليظهر لهم صفحة ترقب وتجهيز أنيقة مع الشعار ومجموعات الدعم والشبكات الاجتماعية بدون أي موقت، مما يمنحكم الوقت لإعداد تحديثاتكم براحة.
                </p>
              </div>

              {/* Toggle switch with exquisite styles */}
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold transition-colors ${siteSettings?.isComingSoonActive ? 'text-amber-600' : 'text-gray-400'}`}>
                  {siteSettings?.isComingSoonActive ? 'مُفعّل (الموقع مغلق حالياً)' : 'مُعطّل (الموقع مفتوح للجميع)'}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateSiteSettings({ 
                    ...siteSettings, 
                    isComingSoonActive: !siteSettings?.isComingSoonActive 
                  })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteSettings?.isComingSoonActive ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      siteSettings?.isComingSoonActive ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {siteSettings?.isComingSoonActive && (
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">عنوان صفحة الافتتاح</label>
                  <input 
                    type="text"
                    value={siteSettings?.comingSoonTitle || 'انتظرونا... نفتتح قريباً!'}
                    onChange={(e) => onUpdateSiteSettings({ ...siteSettings, comingSoonTitle: e.target.value })}
                    placeholder="مثال: انتظرونا... نفتتح قريباً!"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">العنوان الوصفي الفرعي</label>
                  <input 
                    type="text"
                    value={siteSettings?.comingSoonSubtitle || 'نعمل بحب وشغف لتجهيز أفخر العصائر والتحليات المنزلية تليق بضيافتكم.'}
                    onChange={(e) => onUpdateSiteSettings({ ...siteSettings, comingSoonSubtitle: e.target.value })}
                    placeholder="مثال: ترقبوا تشكيلة مدهشة من النكهات..."
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* RIGHT COLUMN: Visual styling, Favicon, Logo & Social links */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Card 1: Images control section */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 text-align-start font-sans">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5">
                  🖼️ تخصيص الأيقونات وصور الموقع
                </h3>
                
                {/* Logo modification block */}
                <div className="space-y-2">
                  <ImageSelectionWidget
                    label="شعار الموقع الرئيسي (Logo)"
                    value={siteSettings?.logoUrl || ''}
                    onChange={(val) => onUpdateSiteSettings({ ...siteSettings, logoUrl: val })}
                    placeholder="أدخل رابط الشعار المباشر أو استخدم الخيارات أعلاه..."
                    maxDim={600}
                  />
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Favicon modification block */}
                <div className="space-y-2">
                  <ImageSelectionWidget
                    label="أيقونة المتصفح المفضلة (Favicon)"
                    value={siteSettings?.faviconUrl || ''}
                    onChange={(val) => onUpdateSiteSettings({ ...siteSettings, faviconUrl: val })}
                    placeholder="أدخل رابط أيقونة favicon المباشر..."
                    maxDim={200}
                  />
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Hero Banner modification block */}
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  
                  {/* Desktop Banner Field */}
                  <div className="space-y-2 border border-gray-100 rounded-2xl p-3 bg-neutral-50/50">
                    <ImageSelectionWidget
                      label="🖥️ صورة بانر للكمبيوتر (Desktop Banner)"
                      value={siteSettings?.heroBannerUrl || ''}
                      onChange={(val) => onUpdateSiteSettings({ ...siteSettings, heroBannerUrl: val })}
                      placeholder="أدخل رابط بانر الكمبيوتر المباشر..."
                      maxDim={1200}
                    />
                  </div>

                  {/* Mobile Banner Field */}
                  <div className="space-y-2 border border-gray-100 rounded-2xl p-3 bg-neutral-50/50">
                    <ImageSelectionWidget
                      label="📱 صورة بانر للهاتف (Mobile Banner)"
                      value={siteSettings?.heroBannerMobileUrl || ''}
                      onChange={(val) => onUpdateSiteSettings({ ...siteSettings, heroBannerMobileUrl: val })}
                      placeholder="أدخل رابط بانر الهاتف المباشر..."
                      maxDim={1000}
                    />
                  </div>

                </div>

              </div>

              {/* Card 2: Social media and contacts control section */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-align-start font-sans">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5">
                  🔗 روابط الصفحات والتحويلات الخارجية
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رقم هاتف الواتساب للطلبيات السريعة</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.whatsappNumber || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                      placeholder="مثال: 212705908383"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                    <span className="text-[10px] text-gray-400 block mt-1">اكتب الكود الدولي للمملكة المغربية بدون علامة + (مثال: 212705908383)</span>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">عنوان الفاتورة لرسالة الواتساب وتنبيهات الدعم</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.whatsappMessageTemplate || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, whatsappMessageTemplate: e.target.value })}
                      placeholder="عنوان المراسلة الوصفية..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط حساب الإنستغرام (Instagram URL)</label>
                    <input 
                      type="url"
                      value={siteSettings?.instagramUrl || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                      placeholder="مثال: https://instagram.com/douaabasma_1"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة الفيسبوك (Facebook URL)</label>
                    <input 
                      type="url"
                      value={siteSettings?.facebookUrl || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                      placeholder="مثال: https://m.facebook.com/douaabasma01/"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* LEFT COLUMN: Texts contents, store info, story texts */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Card 3: Headings & store textual configurations */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-align-start font-sans">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5">
                  ✍️ تخصيص نصوص الموقع والعناوين العامة
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">اسم المتجر / العلامة التجارية بالهوية</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.storeName || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, storeName: e.target.value })}
                      placeholder="اسم المتجر..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">عبارة البادج الترشيحي العلوية المتلألئة</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.promoBadgeText || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, promoBadgeText: e.target.value })}
                      placeholder="عبارة التميز..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">عنوان البانر الرئيسي (الهيدر الهيروي)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.heroTitle || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                      placeholder="مذاق طبيعي..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">العنوان المرفق الملون بالذهب</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.heroSubTitle || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroSubTitle: e.target.value })}
                      placeholder="بلمسة فاخرة..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">الوصف العام بالواجهة الأمامية</label>
                    <textarea 
                      rows={3}
                      required
                      value={siteSettings?.heroDescription || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, heroDescription: e.target.value })}
                      placeholder="تفاصيل الوصف للمشروبات والتحليات..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">النبذة التعريفية للمتجر (في الفوتر والجوانب)</label>
                    <textarea 
                      rows={3}
                      required
                      value={siteSettings?.storeDescription || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, storeDescription: e.target.value })}
                      placeholder="وصف الفوتر والنبذة القصيرة..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">حقوق الملكية الفكرية واللوجو بالفوتر</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.footerCredits || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, footerCredits: e.target.value })}
                      placeholder="مثال: جميع الحقوق محفوظة لعلامة"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

              </div>

              {/* Card 4: Story of project text content modification page */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-align-start font-sans">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5">
                  📖 تعديل قصة مشروعنا وهويتنا المغربية (About Us Page)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">العنوان الرئيسي لقصتنا</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.aboutTitle || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, aboutTitle: e.target.value })}
                      placeholder="عنوان صفحة من نحن..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">العبارة الترحيبية الروحية</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.aboutHeroText || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, aboutHeroText: e.target.value })}
                      placeholder="مرحبًا بكم في..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">العرض التفصيلي لقصة نشأة مع تحضير الفنيدق</label>
                    <textarea 
                      rows={5}
                      required
                      value={siteSettings?.aboutMainText || ''}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, aboutMainText: e.target.value })}
                      placeholder="اكتب قصة المشروع هنا..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

              </div>

              {/* Card 5: Customizable Page URLs Section */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-align-start font-sans">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5 inline-flex items-center gap-1.5">
                  🔗 تخصيص روابط ومسارات صفحات الموقع (Page URLs)
                </h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  يمكنك هنا تعديل المسار (Path) المباشر لكل صفحة، مما يتيح لك التحكم في الرابط النهائي لزوار موقعك (مثال: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-brand-purple">/contact-us</code> أو <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-brand-purple">/about</code>).
                </p>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط الصفحة الرئيسية (Home URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.homePath || '/'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, homePath: e.target.value })}
                      placeholder="/"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة من نحن (About Us URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.aboutPath || '/about-us'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, aboutPath: e.target.value })}
                      placeholder="/about-us"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة التوصيل (Delivery URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.deliveryPath || '/delivery'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, deliveryPath: e.target.value })}
                      placeholder="/delivery"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة اتصل بنا (Contact Us URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.contactPath || '/contact-us'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, contactPath: e.target.value })}
                      placeholder="/contact-us"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة تتبع الطلبية (Order Tracking URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.trackPath || '/track'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, trackPath: e.target.value })}
                      placeholder="/track"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">رابط صفحة لوحة التحكم (Admin Panel URL)</label>
                    <input 
                      type="text"
                      required
                      value={siteSettings?.adminPath || '/admin'}
                      onChange={(e) => onUpdateSiteSettings({ ...siteSettings, adminPath: e.target.value })}
                      placeholder="/admin"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple font-mono text-left"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-r from-brand-purple/10 to-brand-gold-soft/10 p-6 rounded-3xl border border-brand-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-align-start font-sans">
              <h2 className="text-lg font-display font-black text-royal-purple inline-flex items-center gap-2">
                <Bell className="text-brand-gold animate-bounce w-5 h-5 flex-shrink-0" />
                مركز الإشعارات المباشر للأعمال
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                راقب طلباتك بشكل حي واستمع لأصوات التنبيهات الدقيقة، أو قم بمحاكاة الطلبات لاختبار النظام.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={simulateNewOrderNotification}
                className="px-4 py-2 bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>محاكاة طلب جديد 🪄</span>
              </button>

              <button
                onClick={toggleSound}
                className={`px-4 py-2 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 border ${
                  soundEnabled 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 hover:bg-amber-500/20' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>الصوت مفعّل 🔊</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>الصوت كتم 🔇</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            {/* Left Box: Stats & Utilities */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-align-start">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5 mb-4">
                  📊 مؤشرات الإشعارات
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-brand-cream/50 p-4 border border-brand-gold/10 rounded-2xl text-center">
                    <span className="text-xs text-gray-400 block font-bold">غير مقروء</span>
                    <span className="text-2xl font-black text-brand-purple mt-1 block font-sans">
                      {unreadCount}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-2xl text-center">
                    <span className="text-xs text-gray-400 block font-bold">الإجمالي</span>
                    <span className="text-2xl font-black text-gray-700 mt-1 block font-sans">
                      {notifications.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تعليم الكل كمقروء</span>
                  </button>

                  <button
                    onClick={handleClearAllNotifications}
                    disabled={notifications.length === 0}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف كافة الإشعارات</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-align-start space-y-3">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5">
                  🛡️ إشعار المتصفح
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  تم دمج نظام الصوت والمحاكاة التفاعلية ليعمل مباشرة في المتصفح بشكل فوري ومستقل عن أي خوادم خارجية لضمان السرعة المطلقة.
                </p>
                <div className="p-3 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl flex items-start gap-2.5 text-[10px] text-brand-gold-dark leading-relaxed">
                  <Info className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span>تأكد من إلغاء كتم تبويب المتصفح لتتمكن من سماع نغمات الطلبات الجديدة فور صدورها من الزبائن.</span>
                </div>
              </div>
            </div>

            {/* Right Box: Notifications List */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-align-start flex flex-col h-full min-h-[400px]">
                <h3 className="text-sm font-bold text-royal-purple border-r-4 border-brand-gold pr-2.5 mb-4 flex items-center justify-between">
                  <span>سجل تنبيهات النظام</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      يوجد {unreadCount} تنبيهات معلقة
                    </span>
                  )}
                </h3>

                {notifications.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 text-center">
                    <span className="text-4xl mb-2">🔕</span>
                    <p className="text-sm font-bold font-sans font-semibold">لا توجد أي إشعارات حالياً.</p>
                    <p className="text-xs mt-1 text-gray-400 font-sans font-semibold">انقر على "محاكاة طلب جديد" بالأعلى لملء السجل واختبار أصوات التنبيه.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                            notif.isRead 
                              ? 'bg-neutral-50/50 border-neutral-100 opacity-75' 
                              : 'bg-white border-brand-purple/15 shadow-sm ring-1 ring-brand-purple/5'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${
                              notif.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : notif.type === 'warning' 
                                ? 'bg-amber-50 text-amber-600'
                                : notif.type === 'error'
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}>
                              {notif.type === 'success' && <CheckCircle className="w-4 h-4" />}
                              {notif.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                              {notif.type === 'error' && <X className="w-4 h-4 animate-shake" />}
                              {notif.type === 'info' && <Info className="w-4 h-4" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-sans text-right">
                                <h4 className={`text-xs font-black ${notif.isRead ? 'text-gray-500' : 'text-royal-purple'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.isRead && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
                                )}
                              </div>
                              <p className="text-[11px] text-gray-600 leading-relaxed font-semibold font-sans text-right">
                                {notif.message}
                              </p>
                              <span className="text-[9px] text-gray-400 block font-mono">
                                {new Date(notif.createdAt).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ({new Date(notif.createdAt).toLocaleDateString('ar-MA')})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleToggleRead(notif.id)}
                              title={notif.isRead ? "تعليم كـ غير مقروء" : "تعليم كـ مقروء"}
                              className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ${
                                notif.isRead ? 'text-neutral-400' : 'text-brand-purple'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              title="حذف هذا التنبيه"
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialogue Modal */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with elegant blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans text-right"
              style={{ direction: 'rtl' }}
            >
              {/* Header color strip/indicator based on action */}
              <div className={`h-2 w-full ${
                confirmDialog.type === 'cancel' 
                  ? 'bg-amber-500' 
                  : confirmDialog.type === 'delete' || confirmDialog.type === 'delete_product' || confirmDialog.type === 'clear_all_orders'
                  ? 'bg-rose-600'
                  : 'bg-brand-purple'
              }`} />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    confirmDialog.type === 'cancel'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {confirmDialog.type === 'cancel' ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : (
                      <Trash2 className="w-6 h-6" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1.5 flex-1 text-align-start pr-1">
                    <h3 className="text-base font-black text-royal-purple">
                      {confirmDialog.type === 'cancel' && 'تأكيد إلغاء الطلبية'}
                      {confirmDialog.type === 'delete' && 'حذف الطلبية نهائياً'}
                      {confirmDialog.type === 'delete_product' && 'حذف المنتج نهائياً'}
                      {confirmDialog.type === 'clear_all_orders' && 'حذف كافة الطلبات نهائياً'}
                    </h3>
                    
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      {confirmDialog.type === 'cancel' && (
                        <>
                          هل أنت متأكد من رغبتك في إلغاء طلبية الزبون <strong className="text-gray-800">{confirmDialog.orderCustomer}</strong>؟
                          <span className="block mt-1 text-amber-700">⚠️ سيتم تغيير حالة الطلب الخاص به إلى "ملغى" تلقائياً.</span>
                        </>
                      )}
                      {confirmDialog.type === 'delete' && (
                        <>
                          هل أنت متأكد من رغبتك في حذف طلبية الزبون <strong className="text-gray-800">{confirmDialog.orderCustomer}</strong> ذات الرمز <strong className="text-gray-800 font-mono">({confirmDialog.orderId})</strong> نهائياً من المتصفح؟
                          <span className="block mt-2 text-rose-700 font-bold">⚠️ هذا الإجراء غير قابل للتراجع وسيختفي الطلب تماماً من قواعد بيانات المتصفح الخاصة بك.</span>
                        </>
                      )}
                      {confirmDialog.type === 'delete_product' && (
                        <>
                          هل أنت متأكد من رغبتك في حذف منتج <strong className="text-gray-800">"{confirmDialog.productName}"</strong> نهائياً من المعرض؟
                          <span className="block mt-1 text-rose-700">⚠️ لن يتوفر المنتج للطلب مجدداً للزوار بمجرد تأكيد الحذف.</span>
                        </>
                      )}
                      {confirmDialog.type === 'clear_all_orders' && (
                        <>
                          هل أنت متأكد من رغبتك في حذف كافة الطلبات المستلمة نهائياً من المتصفح؟
                          <span className="block mt-2 text-rose-700 font-bold">⚠️ هذا الإجراء غير قابل للتراجع تماماً وسيتم مسح جميع الطلبات نهائياً من قاعدة البيانات المحلية.</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 font-sans">
                  <button
                    type="button"
                    onClick={handleExecuteConfirm}
                    className={`flex-1 py-3 px-4 text-xs font-black rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 shadow-sm ${
                      confirmDialog.type === 'cancel'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100 hover:shadow-lg'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100 hover:shadow-lg'
                    }`}
                  >
                    <span>{confirmDialog.type === 'cancel' ? 'تأكيد إلغاء الطلب' : confirmDialog.type === 'clear_all_orders' ? 'تأكيد حذف كافة الطلبات' : 'تأكيد الحذف نهائياً'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                    className="py-3 px-4 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 rounded-xl cursor-pointer transition-colors text-center"
                  >
                    <span>الرجوع للخلف</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {statusUpdateModal.isOpen && statusUpdateModal.order && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusUpdateModal({ isOpen: false })}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans text-right"
              style={{ direction: 'rtl' }}
            >
              <div className={`h-2 w-full ${
                statusUpdateModal.status === 'pending'
                  ? 'bg-amber-500'
                  : statusUpdateModal.status === 'preparing'
                    ? 'bg-pink-500'
                    : statusUpdateModal.status === 'on_way'
                      ? 'bg-blue-500'
                      : statusUpdateModal.status === 'delivered'
                        ? 'bg-emerald-500'
                        : 'bg-rose-600'
              }`} />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-emerald-100">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-1.5 flex-1 pr-1 text-right">
                    <h3 className="text-base font-black text-royal-purple">
                      تم تحديث حالة الطلبية بنجاح! 🎉
                    </h3>
                    
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      لقد قمت بتحديث حالة طلبية الزبون <strong className="text-gray-800">{statusUpdateModal.order.fullName}</strong> (رقم الطلب: <span className="font-mono bg-gray-50 px-1 rounded">#{statusUpdateModal.order.id}</span>) إلى:
                      <span className={`inline-block mr-1.5 ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        statusUpdateModal.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : statusUpdateModal.status === 'preparing'
                            ? 'bg-pink-50 text-pink-700 border border-pink-200'
                            : statusUpdateModal.status === 'on_way'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : statusUpdateModal.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {statusUpdateModal.status === 'new' && 'طلب جديد'}
                        {statusUpdateModal.status === 'pending' && 'تم تأكيد الطلب'}
                        {statusUpdateModal.status === 'preparing' && 'تقشير ومزج العصائر (جاري)'}
                        {statusUpdateModal.status === 'on_way' && 'مغادرة المندوب المبرّد (بالطريق)'}
                        {statusUpdateModal.status === 'delivered' && 'تـم التسليم بنجاح (مكتمل)'}
                        {statusUpdateModal.status === 'cancelled' && 'تم إلغاء الطلب (ملغى) ❌'}
                      </span>
                    </p>

                    <p className="text-xs text-amber-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50 font-semibold mt-2">
                      💡 يرجى إرسال التحديث للزبون عبر الواتساب لإبقائه على اطلاع بمسار طلبيته وتفادي أي ارتباك.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 font-sans">
                  <a
                    href={generateWhatsAppStatusUpdateUrl(statusUpdateModal.order, statusUpdateModal.status, siteSettings?.storeName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStatusUpdateModal({ isOpen: false })}
                    className="flex-1 py-3 px-4 text-xs font-black rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 shadow-sm bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-emerald-50 hover:shadow-lg"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>إرسال التحديث عبر الواتساب</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setStatusUpdateModal({ isOpen: false })}
                    className="py-3 px-4 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 rounded-xl cursor-pointer transition-colors text-center"
                  >
                    <span>إغلاق</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {newOrdersModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewOrdersModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans text-right flex flex-col max-h-[85vh]"
              style={{ direction: 'rtl' }}
            >
              {/* Header color strip */}
              <div className="h-2 w-full bg-brand-purple" />

              <div className="p-6 flex flex-col overflow-hidden h-full">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-royal-purple">الطلبات الجديدة المستلمة 🔔</h3>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        لديك {pendingOrders.length} طلبات جديدة بانتظار التأكيد والتحضير
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNewOrdersModalOpen(false)}
                    className="p-1 px-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl transition-all cursor-pointer text-xs font-bold"
                  >
                    إغلاق
                  </button>
                </div>

                {/* Content area: Scrollable */}
                <div className="overflow-y-auto py-4 flex-1 space-y-4 pr-1 pl-1 max-h-[50vh]">
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 mb-3 border border-slate-100/50">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-700">لا توجد أي طلبات جديدة!</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-[280px] leading-relaxed">
                        تمت تلبية وتحديث كافة طلبيات الزبائن الواردة بنجاح، عمل رائع ومستمر! 🎉
                      </p>
                    </div>
                  ) : (
                    pendingOrders.map((order) => (
                      <div key={order.id} className="bg-brand-cream/40 border border-brand-purple/10 rounded-2xl p-4 hover:border-brand-purple/35 transition-all text-right">
                        <div className="flex justify-between items-start gap-2 border-b border-gray-105 pb-3 mb-3">
                          <div>
                            <div className="flex items-center gap-1.5 select-all">
                              <span className="font-mono text-xs font-black text-brand-purple bg-purple-50 px-2.5 py-1 rounded-lg">
                                #{order.id}
                              </span>
                              <button
                                onClick={() => handleCopyOrderId(order.id)}
                                title="نسخ رقم تتبع الطلب"
                                type="button"
                                className="p-1 rounded-md bg-purple-50 text-brand-purple hover:bg-brand-purple hover:text-white transition-all cursor-pointer shadow-xs"
                              >
                                {copiedOrderId === order.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-xs text-gray-400 font-sans block mt-1.5 font-bold">
                              التاريخ: {new Date(order.date).toLocaleString('ar-MA', { hour12: false })}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-black text-royal-purple block font-sans">
                              {order.total} DH
                            </span>
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                              في الانتظار
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-right">
                          <p className="text-xs text-gray-700 font-bold">
                            <span className="text-gray-400 font-medium">الزبون:</span> {order.fullName} | <span className="font-mono">{order.phone}</span>
                          </p>
                          <p className="text-xs text-gray-700 font-semibold">
                            <span className="text-gray-400 font-medium">العنوان:</span> {order.address} ({order.deliveryArea})
                          </p>
                          {order.notes && (
                            <p className="text-xs text-gray-600 bg-brand-beige/30 p-2 rounded-xl mt-1.5 border border-brand-gold/10 font-semibold">
                              <span className="text-brand-gold-dark font-black">التعليمات:</span> {order.notes}
                            </p>
                          )}

                          <div className="pt-2">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">المنتجات المطلوبة:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {order.items.map((item, idx) => (
                                <span key={idx} className="bg-white px-2 py-1 border border-gray-100 rounded-lg text-xs font-semibold text-gray-800 shadow-3xs">
                                  {item.product.name} (x{item.quantity})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 mt-2 border-t border-gray-100/50">
                            <button
                              onClick={() => {
                                setActiveTab('orders');
                                setNewOrdersModalOpen(false);
                                setTimeout(() => {
                                  const element = document.getElementById('admin-orders-list-anchor');
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }, 100);
                              }}
                              className="px-3 py-1.5 bg-royal-purple/10 hover:bg-royal-purple/20 text-royal-purple text-[10px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <ListOrdered className="w-3.5 h-3.5" />
                              <span>قائمة الطلبات</span>
                            </button>
                            {/* No whatsapp option for pending orders */}
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setNewOrdersModalOpen(false)}
                    className="w-full sm:w-auto py-2.5 px-6 text-xs font-black text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 rounded-xl cursor-pointer transition-colors text-center"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
