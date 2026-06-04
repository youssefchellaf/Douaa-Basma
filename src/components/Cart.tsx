import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Truck, HelpCircle, Sparkles, Check } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
  deliveryOption: number; // Current Selected zone delivery fee
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
  deliveryOption,
  notes,
  onNotesChange,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const FREE_DELIVERY_THRESHOLD = 100;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCost = isFreeDelivery ? 0 : deliveryOption;
  const total = subtotal + deliveryCost;

  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
  const freeDeliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center font-sans">
        <div className="w-24 h-24 bg-brand-purple-soft/50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-purple animate-pulse">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-display font-black text-royal-purple mb-2">سلتك لا تزال خالية!</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
          اكتشف قائمتنا الفريدة من العصائر الطبيعية المبردة والتحليات المغربية الأندلسية الفاخرة لتبدأ طلبك الاستثنائي اليوم.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-purple/20 cursor-pointer"
        >
          اكتشف قائمتنا الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="text-align-start mb-6">
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-purple-light cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة لإضافة المزيد من المنتجات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart items list - left panel */}
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-2xl font-display font-black text-royal-purple text-align-start flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-gold" />
            <span>طلباتي <span className="text-sm font-normal text-gray-500 px-1">({cartItems.length} {cartItems.length >= 2 ? 'عناصر' : 'عنصر'})</span></span>
          </h1>

          {/* Items checklist */}
          <div className="space-y-3">
            <AnimatePresence>
              {cartItems.map((item, idx) => (
                <motion.div
                  key={`${item.product.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.image}
                      alt={item.product.arabicName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                    />

                    <div className="text-align-start">
                      <h3 className="font-bold text-royal-purple text-base leading-tight">
                        {item.product.arabicName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">
                        {item.product.category === 'juices' ? 'عصير طبيعي' : item.product.category === 'desserts' ? 'تحلية منزلية' : item.product.category === 'events' ? 'الأفراح و المناسبات' : 'عرض خاص'}
                      </p>
                      
                      <div className="text-brand-gold-dark font-extrabold text-sm mt-1">
                        {item.product.price} DH <span className="text-xs text-gray-400 font-medium">
                          {item.product.category === 'juices' ? 'للكأس' : item.product.category === 'desserts' ? 'للقطعة' : item.product.category === 'events' ? 'للطلب' : 'للحبة'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and removal buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="border border-gray-200 rounded-xl p-1 flex items-center bg-gray-50 bg-white shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center font-bold text-gray-800 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right sm:w-20">
                      <span className="text-xs text-gray-400 block sm:hidden">المجموع:</span>
                      <span className="font-black text-royal-purple text-base">
                        {item.product.price * item.quantity} DH
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="w-9 h-9 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                      title="حذف هذا المنتج"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Free delivery promo progress meter */}
          <div className="bg-white p-5 rounded-3xl border border-brand-gold/15 shadow-sm text-align-start">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <Truck className="w-4.5 h-4.5 text-brand-gold" />
                توصيل مجاني
              </span>
              <span className="text-xs font-black text-brand-gold-dark">الحد المطلوب 100 DH</span>
            </div>

            {isFreeDelivery ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2 mb-1">
                <Check className="w-4.5 h-4.5 text-emerald-600 font-bold" />
                <span className="text-sm font-bold">هنيـئـاً لك! طلبيتك مؤهلة للـتوصيـل المجـانـي كـامـلاً!</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                أضف منتجات بقيمة <span className="font-extrabold text-brand-purple">{remainingForFreeDelivery} DH</span> أخرى لتحصل على توصيل مجاني!
              </p>
            )}

            {/* Progress-bar fluid background loading */}
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeDeliveryProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${isFreeDelivery ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-gold to-brand-purple-light'}`}
              />
            </div>
          </div>
        </div>

        {/* Pricing Summary Breakdown - right panel */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-brand-gold/15 shadow-lg relative overflow-hidden text-align-start sticky top-24">
            
            {/* Elegant border ornaments */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-gold via-brand-purple-light to-brand-gold" />
            
            <h2 className="text-lg font-display font-black text-royal-purple mb-4 border-b border-gray-100 pb-3">
              ملخص الحساب الإجمالي
            </h2>

            <div className="space-y-3.5 mb-6 text-sm">

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-royal-purple">المجموع الإجمالي لسلتك:</span>
                  <span className="text-3xl font-black text-brand-gold-dark font-sans">
                    {subtotal} <span className="text-sm font-bold text-royal-purple">DH</span>
                  </span>
                </div>
              </div>

              <p className="text-[11.5px] text-brand-purple font-semibold text-right mt-3 leading-relaxed bg-brand-purple-soft/30 p-3 rounded-2xl border border-brand-purple/10">
                📍 ملاحظة: سيتم تحديد واحتساب سعر التوصيل المناسب لعنوانك في صفحة تأكيد الطلب التالية بعد اختيار حي السكن المحدد. (مجاني بالكامل فوق 100 DH لجميع الأحياء المذكورة).
              </p>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-brand-gold animate-pulse-slow" />
              <span>تأكيد الطلب وتعبئة العنوان</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full mt-2.5 py-3 border border-gray-200 hover:border-brand-purple text-gray-500 hover:text-brand-purple font-bold rounded-2xl flex items-center justify-center text-xs transition-colors cursor-pointer bg-white"
            >
              إضافة طلب جديد
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
