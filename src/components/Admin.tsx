import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, DollarSign, ListOrdered, Tag, CheckCircle2, RefreshCw, Sparkles, Plus, Clock, Eye,
  Lock, Unlock, LogOut, Edit3, Trash2, Image, Layers, HelpCircle, Check, X, ShieldAlert, Star,
  CheckCircle
} from 'lucide-react';
import { Order, Coupon, Product, CategoryId } from '../types';

interface AdminProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const Admin: React.FC<AdminProps> = ({
  orders,
  onUpdateOrderStatus,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  products,
  onUpdateProducts,
}) => {
  // --- AUTHENTICATION & SECURITY STATE SYSTEM ---
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('db_admin_authorized') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  // --- PASSCODE MANAGEMENT STATE ---
  const [currentPasscode, setCurrentPasscode] = useState(() => localStorage.getItem('db_admin_passcode') || '5566');
  const [newPasscodeSetting, setNewPasscodeSetting] = useState('');
  const [passSettingMsg, setPassSettingMsg] = useState('');

  // --- TABS SYSTEMS STATE ---
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons'>('orders');

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
  const [prodIngredients, setProdIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
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
    if (passcode === correctPass || passcode === 'douaa_basma_2026' || passcode === 'youssef2026') {
      setIsAuthorized(true);
      localStorage.setItem('db_admin_authorized', 'true');
    } else {
      setErrorMsg('❌ رمز المرور المدخل غير صحيح! حاول مجدداً.');
    }
  };

  const handleLockAdmin = () => {
    setIsAuthorized(false);
    localStorage.removeItem('db_admin_authorized');
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
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') return;
      const originalResult = event.target.result;
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            setProdImage(dataUrl);
          } else {
            setProdImage(originalResult);
          }
        } catch (err) {
          console.error("Error compressing image, fallback to original:", err);
          setProdImage(originalResult);
        }
      };
      img.onerror = () => {
        setProdImage(originalResult);
      };
      img.src = originalResult;
    };
    reader.readAsDataURL(file);
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
    setProdIngredients(['فواكه طازجة']);
    setProdIsFeatured(false);
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
    setProdIngredients(product.ingredients || []);
    setProdIsFeatured(!!product.isFeatured);
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
      rating: editingProduct ? editingProduct.rating : 4.8,
      isFeatured: prodIsFeatured,
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
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟')) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      onUpdateProducts(updatedProducts);
    }
  };

  const handleToggleFeatured = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedProducts = products.map((p) => p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p);
    onUpdateProducts(updatedProducts);
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
            
            <p className="text-[10px] text-gray-400 text-center leading-normal pt-2">
              تلميح السرية: رمز المرور الافتراضي لتجربته الآن هو <span className="font-bold text-brand-gold font-mono">5566</span> (ويمكنك تبديله من خيارات الكوبونات بالداخل!)
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- core MAIN ADMIN DASHBOARD (rendered only when isAuthorized) ---
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-align-start">
      
      {/* Title block with secret metadata and lock back options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-brand-purple block mb-1">بوابة الإدارة السرية Douaa & Basma</span>
          <h1 className="text-2xl md:text-3xl font-display font-black text-royal-purple flex items-center gap-2">
            <Award className="text-brand-gold animate-pulse-slow font-bold" />
            إدارة المبيعات وقوائم المنتجات
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            مرحباً بك! بصفتك المدير المسؤول، تملك صلاحيات التحكم بالطلبيات، المبيعات المباشرة، وتعديل المكونات والأسعار من الألف إلى الياء.
          </p>
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
        </div>
      </div>

      {/* Interactive Stats Dashboard Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-semibold">إجمالي المداخيل الحية</span>
          <span className="text-2xl font-black text-royal-purple mt-1 block">
            {totalRevenue} <span className="text-sm font-bold text-brand-gold">DH</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-brand-gold-dark flex items-center justify-center mb-3">
            <ListOrdered className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-semibold">عدد الطلبات المنجزة</span>
          <span className="text-2xl font-black text-royal-purple mt-1 block">
            {orders.length} <span className="text-sm font-bold text-gray-500">طَلَبَات</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs text-gray-400 block font-semibold">تحت التحضير الجاري</span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">
            {preparingCount + onWayCount} <span className="text-sm font-bold text-gray-500">مستمر</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-gray-400 block font-semibold">طلبات استلمت بنجاح</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">
            {deliveredCount} <span className="text-sm font-bold text-gray-500">تَمّ</span>
          </span>
        </div>
      </div>

      {/* Tabs list switches bar */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'orders' ? 'text-brand-purple border-b-2 border-brand-purple font-black' : 'text-gray-400'
          }`}
        >
          الطلبات المستلمة ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'products' ? 'text-brand-purple border-b-2 border-brand-purple font-black' : 'text-gray-400'
          }`}
        >
          📂 منتجات العصائر والتحليات ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 px-4 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'coupons' ? 'text-brand-purple border-b-2 border-brand-purple font-black' : 'text-gray-400'
          }`}
        >
          🎟️ تخفيضات وكودات الكوبون
        </button>
      </div>

      {/* --- TAB 1: ORDERS LIST --- */}
      {activeTab === 'orders' && (
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-display font-black text-royal-purple mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>الطلبات المستلمة حية ({orders.length})</span>
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
                    <th className="p-3 text-right">الإجمالي</th>
                    <th className="p-3 text-right">الحالة والتحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-cream/40 transition-colors">
                      <td className="p-3 font-sans">
                        <span className="font-bold text-brand-purple block text-xs">{order.id}</span>
                        <span className="font-semibold text-gray-800 block text-sm mt-0.5">{order.fullName}</span>
                        <span className="text-[11px] text-gray-400 font-mono block">{order.phone}</span>
                      </td>

                      <td className="p-3">
                        <div className="max-w-[180px] overflow-hidden truncate" title={order.items.map(item => `${item.product.arabicName} x${item.quantity}`).join(', ')}>
                          {order.items.map((item, idx) => (
                            <span key={idx} className="block text-[11px] text-gray-600 truncate">
                              • {item.product.arabicName} <strong className="text-brand-purple">x{item.quantity}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-black text-brand-gold-dark block whitespace-nowrap">{order.total} DH</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">برسائل التوصيل</span>
                      </td>

                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`p-1.5 rounded-lg text-xs font-bold outline-none border transition-colors cursor-pointer ${
                            order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : order.status === 'preparing'
                                ? 'bg-pink-50 text-pink-700 border-pink-200'
                                : order.status === 'on_way'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="pending">مسجل ومعتمد (مستلم)</option>
                          <option value="preparing">تقشير ومزج العصائر (جاري)</option>
                          <option value="on_way">مغادرة المندوب المبرّد (بالطريق)</option>
                          <option value="delivered">تـم التسليم بنجاح (مكتمل)</option>
                        </select>
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
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-100">
              <div>
                <h2 className="text-base font-display font-black text-royal-purple">لوحة التحكم بالمنتجات من الألف إلى الياء (A-Z)</h2>
                <p className="text-gray-400 text-xs mt-0.5">أضف، عدل الأسعار، المكونات، وقم برفع الصور بدقة ليراها جميع زبائن الموقع فورا.</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-light text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>إدراج منتج طبيعي جديد</span>
              </button>
            </div>

            {/* List grid of customizable products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-gray-100 bg-brand-cream/30 hover:border-brand-purple/20 transition-all flex items-start gap-4">
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
                    </div>
                    
                    <span className="text-[11px] text-gray-400 block font-mono mt-0.5">{p.name} -- ID: #{p.id}</span>
                    <span className="font-black text-brand-gold-dark text-xs block mt-1">{p.price} DH</span>
                    
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">{p.description}</p>
                    
                    {/* Compact actions button row inside catalog view */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100/60">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-3 py-1.5 bg-brand-purple-soft hover:bg-brand-purple-soft/80 text-brand-purple text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

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

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 px-2.5 hover:bg-rose-50 hover:text-rose-600 text-gray-400 rounded-lg text-xs font-bold cursor-pointer transition-colors mr-auto"
                        title="حذف المنتج من المتجر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  className="bg-white rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          <option value="desserts">تحليات منزلية (desserts)</option>
                          <option value="specials">عروض خاصة زوينات (specials)</option>
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
                    </div>

                     <div>
                      <label className="block mb-1.5 text-gray-600">صورة المنتج (ارفع الصورة من معرض جهازك) *</label>
                      
                      <div className="space-y-3 font-sans">
                        {/* Hidden input file tag */}
                        <input
                          type="file"
                          id="prod-image-file-input"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />

                        {prodImage ? (
                          // Active Image uploaded preview container
                          <div className="relative border border-brand-gold/20 rounded-2xl p-3 bg-brand-cream/40 flex items-center gap-4">
                            <img
                              src={prodImage}
                              alt="معاينة الصورة"
                              referrerPolicy="no-referrer"
                              className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 mb-1">
                                <Check className="w-3 h-3" /> تم تحميل الصورة بنجاح من المعرض
                              </span>
                              <p className="text-[10px] text-gray-400 truncate max-w-xs font-mono font-normal">
                                {prodImage.startsWith('data:') ? 'صورة مرفوعة (متضمنة محلياً في المتجر)' : prodImage}
                              </p>
                              
                              <div className="flex gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('prod-image-file-input')?.click()}
                                  className="px-3 py-1 bg-white hover:bg-neutral-50 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  تغيير الصورة 📁
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProdImage('')}
                                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  إزالة 🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Drag & Drop styled area box
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('prod-image-file-input')?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative ${
                              isDragging 
                                ? 'border-brand-purple bg-brand-purple-soft/20 scale-[0.99]' 
                                : 'border-neutral-200 hover:border-brand-purple/45 bg-brand-cream/10 hover:bg-brand-cream/20'
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <div className="w-10 h-10 bg-brand-purple-soft text-brand-purple rounded-xl flex items-center justify-center">
                                <Image className="w-5 h-5" />
                              </div>
                              <p className="text-gray-700 font-bold text-xs">
                                اضغط هنا لاختيار صورة من معرض جهازك 📸
                              </p>
                              <p className="text-gray-400 text-[10px] font-normal leading-normal">
                                أو قم بسحب وإلقاء الصورة المفرومة هنا (PNG, JPG, WebP)
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Optional Toggle to enter a URL for flexibility */}
                        <div className="text-left">
                          <button
                            type="button"
                            onClick={() => setShowUrlField(!showUrlField)}
                            className="text-[11px] text-brand-purple hover:underline font-semibold cursor-pointer"
                          >
                            {showUrlField ? '◀ إخفاء خيارات الروابط اليدوية' : '◀ أو ضع رابط صورة مباشر يدوياً (خيارات متقدمة)'}
                          </button>
                        </div>

                        {showUrlField && (
                          <div className="p-3 bg-neutral-50 rounded-xl border border-gray-150 space-y-1.5 duration-200">
                            <label className="block text-[10px] text-gray-500 font-bold">أدخل أي رابط صورة خارجي (Unsplash أو غيره):</label>
                            <input
                              type="text"
                              value={prodImage}
                              onChange={(e) => setProdImage(e.target.value)}
                              placeholder="ضع هنا رابط الصورة المباشر لمتصفح الويب..."
                              className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:border-brand-purple text-xs font-mono select-all"
                            />
                          </div>
                        )}
                      </div>
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

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="prodIsFeatured"
                        checked={prodIsFeatured}
                        onChange={(e) => setProdIsFeatured(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-brand-purple focus:ring-brand-purple"
                      />
                      <label htmlFor="prodIsFeatured" className="text-xs text-gray-700 select-none cursor-pointer">
                        هل تريد ترويج هذا كمنتج مميز ونجمي (يظهر في أول واجهة الموقع)؟ ⭐
                      </label>
                    </div>

                    {prodFormMsg && (
                      <div className="p-3 text-brand-purple-light bg-brand-purple-soft/40 border border-brand-purple/10 rounded-xl text-center text-xs">
                        {prodFormMsg}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold"
                      >
                        إلغاء التعديل
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-light text-white rounded-xl text-xs font-bold flex items-center gap-1"
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
        </div>
      )}

      {/* --- TAB 3: COUPONS AND SETTINGS --- */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coupon controller - left column */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-display font-black text-royal-purple pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Tag className="w-5 h-5 text-brand-gold" />
                توليد وإدراج كودات التخفيض للزبائن
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-normal">
                من هنا يمكنك وضع أكواد ترويجية مثل (SAVE20) وإهدائها لأحبابك أو زبائنك لخصم مبالغ مئوية متجاوبة حية عند التشكيل.
              </p>
            </div>

            {/* Form for new coupon creation */}
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">رمز الكوبون (رمز بالإنجليزية)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="مثال: SPRING20"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-bold uppercase tracking-wider outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">نسبة التخفيض (%)</label>
                  <input
                    type="number"
                    value={newPercent}
                    onChange={(e) => setNewPercent(Math.max(1, Math.min(100, parseInt(e.target.value) || 10)))}
                    min="1"
                    max="100"
                    placeholder="10"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-bold outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">حد طلب أدنى (DH)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-center font-bold outline-none focus:border-brand-purple"
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

            {couponMsg && (
              <p className="text-xs text-brand-purple-light font-bold mt-2.5 bg-brand-purple-soft/50 p-2.5 rounded-xl border border-brand-purple/10 text-center">
                {couponMsg}
              </p>
            )}

            {/* List active coupons */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="text-xs font-bold text-gray-400 mb-2">الكودات الفعالة بالسيارة حالياً ({coupons.length})</h4>
              
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {coupons.map((c) => (
                  <div key={c.code} className="p-2.5 rounded-xl bg-brand-cream border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-brand-purple block uppercase font-mono">{c.code}</strong>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">
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
            </div>
          </div>

          {/* Secure Settings column - right column */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-display font-black text-rose-800 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-rose-650" />
                إعدادات حماية لوحة التحكم
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-normal">
                قم بتغيير كود الحماية هنا لتخصيص رمز لوحة الإدارة، لمنع زوار الموقع من كشفه أو الولوج للتحليلات.
              </p>
            </div>

            <form onSubmit={handleUpdatePasscodeSetting} className="space-y-4">
              <div>
                <span className="text-gray-500 text-[10px] block mb-1">الرمز الحالي المحتفظ به بالجهاز:</span>
                <span className="bg-brand-cream px-3 py-1.5 rounded-lg text-xs font-mono font-bold block border border-gray-100 w-fit">
                  {currentPasscode}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">الرمز السري الجديد للتحكم</label>
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
          </div>
        </div>
      )}

    </div>
  );
};
