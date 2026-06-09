import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Clock, ShoppingBag, Plus, Minus, ChefHat, 
  Sparkles, CheckCircle, HelpCircle, Leaf, Star, ArrowRight, ShieldCheck, Heart, X
} from 'lucide-react';
import { Product } from '../types';
import { getProxiedImageUrl } from '../utils';

interface ProductDetailPageProps {
  productId: number;
  products: Product[];
  onAddToCartWithCustomization: (product: Product, quantity: number, instructions: string) => void;
  onSetView: (view: string, productId?: number) => void;
  onBack: () => void;
  onOpenCart: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  onAddToCartWithCustomization,
  onSetView,
  onBack,
  onOpenCart,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1);
      setInstructions('');
      setSuccessMsg(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [productId, products]);

  useEffect(() => {
    if (!product) {
      setRecommendations([]);
      return;
    }

    // Filter candidate products in the same category or default categories
    let candidates = products.filter(
      (p) => p.id !== product.id && p.category === product.category
    );

    if (candidates.length < 3) {
      candidates = products.filter((p) => p.id !== product.id);
    }

    // Shuffle and pick 3 products
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 3));
  }, [product, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-royal-purple">المنتج غير موجود</h3>
        <p className="text-gray-500 mt-2">عذراً، لم نتمكن من العثور على الصفحة المطلوبة.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2.5 bg-brand-purple text-white rounded-xl font-semibold cursor-pointer hover:bg-royal-purple transition-all"
        >
          العودة للتسوق
        </button>
      </div>
    );
  }

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    onAddToCartWithCustomization(product, quantity, instructions);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-right" dir="rtl">
      {/* Breadcrumb / Navigation track */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-150 rounded-2xl hover:bg-brand-cream/40 text-gray-700 hover:text-royal-purple transition-all shadow-sm cursor-pointer text-xs font-black"
        >
          <ArrowRight className="w-4.5 h-4.5 text-brand-purple" />
          <span>العودة للمنتجات</span>
        </button>

        <span className="text-xs text-gray-400 font-bold hidden sm:inline-block">
          الرئيسية / {product.category === 'juices' ? 'عصائر طبيعية' : 'تحليات ووجبات منزلية'} / <span className="text-gray-600 font-black">{product.arabicName}</span>
        </span>
      </div>

      {/* Main product design board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 p-6 md:p-10 overflow-hidden">
        
        {/* Gallery Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-brand-purple-soft/40 border border-gray-50 shadow-inner group">
            <img
              src={getProxiedImageUrl(product.image)}
              alt={product.arabicName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Badges on images */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span className="bg-white/90 backdrop-blur-md text-emerald-600 border border-emerald-100 rounded-2xl px-3.5 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 fill-emerald-100" />
                <span>طبيعي 100%</span>
              </span>
              <span className="bg-white/95 backdrop-blur-md text-brand-gold-dark border border-brand-gold/20 rounded-2xl px-3.5 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-brand-gold" />
                <span>تحضير منزلي</span>
              </span>
            </div>

            {/* Like animation */}
            <button
              onClick={() => setLiked(!liked)}
              className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-md cursor-pointer ${
                liked ? 'bg-rose-550 text-white shadow-rose-200' : 'bg-white text-gray-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            </button>

            {/* Preparation time badge banner */}
            <div className="absolute bottom-4 right-4 bg-royal-purple/90 backdrop-blur-md text-brand-gold border border-brand-gold/20 px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>جاهز للتوصيل خلال: {product.prepTime}</span>
            </div>
          </div>
          
          {/* Subtle safety indicators */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="p-3.5 bg-brand-cream/50 rounded-2xl border border-brand-gold/10 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#25D366] shrink-0" />
              <div className="text-right">
                <span className="text-xs font-bold text-gray-700 block">صحي ومعقّم</span>
                <span className="text-[10px] text-gray-400 block font-semibold">بأعلى معايير السلامة</span>
              </div>
            </div>
            <div className="p-3.5 bg-brand-cream/50 rounded-2xl border border-brand-gold/10 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />
              <div className="text-right">
                <span className="text-xs font-bold text-gray-700 block">بدون مواد حافظة</span>
                <span className="text-[10px] text-gray-400 block font-semibold">مكونات طازجة يومياً</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Board */}
        <div className="lg:col-span-6 flex flex-col justify-between font-sans">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-brand-gold uppercase tracking-widest bg-brand-gold-soft border border-brand-gold/20 px-2.5 py-1 rounded-xl">
                  {product.category === 'juices' ? 'عصائر طازجة' : product.category === 'desserts' ? 'حلويات وتحليات ممتازة' : 'خاص ومميز'}
                </span>
                
                {product.isAvailable !== false ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>متوفر للتسليم الآن</span>
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl px-2.5 py-0.5 text-xs font-bold">
                    غير متوفر مؤقتاً
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-black text-royal-purple leading-tight">
                {product.arabicName}
              </h1>

              {/* Dynamic feedback display */}
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4.5 h-4.5 text-brand-gold fill-brand-gold" />
                ))}
                <span className="text-xs font-black text-gray-700 mr-2">5.0 (تقييمات الزبناء ممتازة)</span>
              </div>
            </div>

            {/* Sizing description list */}
            <div className="flex flex-wrap gap-4 items-center border-b border-gray-100 pb-5">
              <div>
                <span className="text-xs text-gray-400 block font-bold">السعر للمنتح</span>
                <span className="text-3xl font-black text-royal-purple block mt-1">
                  {product.price} <span className="text-lg font-bold text-brand-gold">DH</span>
                </span>
              </div>

              {product.size && (
                <div className="mr-auto">
                  <span className="text-xs text-gray-400 block font-bold text-left">الحجم / الوزن</span>
                  <div className="mt-1 bg-emerald-950 border border-brand-gold/30 px-4 py-2 rounded-2xl flex items-center justify-center">
                    <span className="text-sm font-black text-brand-gold">{product.size}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Slogan Details description */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-gray-400">لماذا يستحق التجربة؟</h4>
              <p className="text-gray-700 leading-relaxed text-base font-semibold">
                {product.description}
              </p>
            </div>

            {/* Ingredients cards tags */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-gray-400">عناصر التحضير والمكونات الأساسية:</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.ingredients.map((ing, idx) => (
                  <span 
                    key={idx} 
                    className="bg-brand-cream/50 text-royal-purple border border-brand-gold/10 text-xs font-extrabold rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Customization box */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-black text-gray-400 block">
                تخصيص مكونات طلبك (اختياري / مثلاً: بدون سكر، اللوز مهرمش، بدون قشدة...):
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="أضف تعليماتك الخاصة هنا وسنلبيها بدقة تامة..."
                className="w-full h-20 p-3.5 rounded-2xl border border-gray-150 focus:border-brand-purple outline-none text-xs leading-relaxed text-gray-700 resize-none bg-brand-cream/30"
              />
            </div>
          </div>

          {/* Action Trigger Block */}
          <div className="border-t border-gray-150 pt-6 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
              <span className="text-xs font-black text-gray-400 sm:hidden">الكمية والمجموع:</span>
              <div className="border border-gray-250 rounded-2xl p-1 flex items-center bg-gray-50/70">
                <button
                  onClick={handleDecrement}
                  className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 hover:text-royal-purple flex items-center justify-center transition-colors font-bold cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="w-12 text-center font-display font-black text-royal-purple text-lg">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 hover:text-royal-purple flex items-center justify-center transition-colors font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-left font-sans sm:mr-4">
                <span className="text-[10px] text-gray-400 block font-bold">المجموع الإجمالي</span>
                <span className="text-2xl font-black text-royal-purple">
                  {product.price * quantity} <span className="text-sm font-bold text-brand-gold">DH</span>
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex gap-2">
              <button
                onClick={handleAdd}
                disabled={successMsg || product.isAvailable === false}
                className={`flex-1 sm:flex-initial px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2.5 text-white shadow-lg transition-all text-sm cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  product.isAvailable === false
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : successMsg
                    ? 'bg-emerald-500 shadow-emerald-200'
                    : 'bg-gradient-to-r from-brand-purple to-royal-purple hover:shadow-brand-purple/20'
                }`}
              >
                {product.isAvailable === false ? (
                  <>
                    <X className="w-5 h-5 text-white" />
                    <span>غير متوفر حالياً</span>
                  </>
                ) : successMsg ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white animate-bounce" />
                    <span>تم وضعه في سلة الطلبات!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4.5 h-4.5 text-white" />
                    <span>أضف إلى السلة ({quantity})</span>
                  </>
                )}
              </button>

              {successMsg && (
                <button
                  onClick={onOpenCart}
                  className="px-5 py-4 bg-brand-gold hover:bg-brand-gold-dark text-royal-purple rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all text-nowrap"
                >
                  <span>عرض السلة</span>
                  <ShoppingBag className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Recommended products grid (Very standard Shopify layout) */}
      <div className="mt-14 font-sans text-right">
        <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
          <h3 className="text-xl font-display font-black text-royal-purple flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
            <span>منتجات ننصحك بتجربتها أيضاً (قد تعجبك)</span>
          </h3>
          <button
            onClick={() => onSetView('products')}
            className="flex items-center gap-1 text-xs font-extrabold text-brand-purple hover:text-brand-gold transition-colors cursor-pointer"
          >
            <span>عرض كل المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto justify-center">
          {recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              onClick={() => onSetView('product-detail', rec.id)}
              className="bg-white rounded-3xl border border-gray-100 hover:border-brand-purple/20 hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer transition-all p-4 flex flex-col justify-between"
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-purple-soft/40 mb-3">
                  <img
                    src={getProxiedImageUrl(rec.image)}
                    alt={rec.arabicName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-sm font-black text-gray-800 line-clamp-1">
                  {rec.arabicName}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1">
                  {rec.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                <span className="text-xs font-bold text-gray-400">السعر:</span>
                <span className="text-sm font-black text-brand-gold-dark">{rec.price} DH</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
