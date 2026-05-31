import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Sparkles, MapPin, AlertCircle, Check, CreditCard, Gift } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { DELIVERY_ZONES, APP_COUPONS } from '../data/products';

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryCost: number;
  onPlaceOrder: (orderData: {
    fullName: string;
    phone: string;
    address: string;
    notes: string;
    deliveryArea: string;
    couponApplied?: string;
    discountAmount: number;
  }) => void;
  onBackToCart: () => void;
  selectedZone: string;
  onZoneChange: (zoneId: string) => void;
  coupons?: Coupon[];
  notes: string;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  subtotal,
  deliveryCost,
  onPlaceOrder,
  onBackToCart,
  selectedZone,
  onZoneChange,
  coupons = [],
  notes,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const FREE_DELIVERY_THRESHOLD = 100;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const actualDeliveryCost = isFreeDelivery ? 0 : deliveryCost;

  // Coupon calculations
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal + actualDeliveryCost - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('الرجاء إدخال رمز الكوبون أولاً');
      return;
    }

    const activeCoupons = coupons.length > 0 ? coupons : APP_COUPONS;

    const foundCoupon = activeCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!foundCoupon) {
      setCouponError('رمز التخفيض غير صحيح أو منتهي الصلاحية');
      setAppliedCoupon(null);
      return;
    }

    if (!foundCoupon.active) {
      setCouponError('هذا الكوبون لم يعد نشطاً حالياً');
      setAppliedCoupon(null);
      return;
    }

    if (foundCoupon.minOrder && subtotal < foundCoupon.minOrder) {
      setCouponError(`هذا الكوبون يتطلب طلبيّة بحد أدنى قدره ${foundCoupon.minOrder} DH`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(foundCoupon);
    setCouponSuccess(`تم تفعيل الكوبون بنجاح بخصم قدره ${foundCoupon.discountPercent}%!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب لتأكيد الهوية البريدية';
    
    // Simple Moroccan phone format assertion (e.g. 06 / 07 followed by 8 numbers)
    const phoneNo = phone.trim();
    if (!phoneNo) {
      errors.phone = 'رقم الهاتف مطلوب لتوصيل مباشر';
    } else if (!/^(05|06|07)[0-9]{8}$/.test(phoneNo) && !/^\+212[0-9]{9}$/.test(phoneNo)) {
      errors.phone = 'يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)';
    }

    if (!address.trim()) errors.address = 'تفاصيل العنوان مطلوبة لضمان وصول المندوب ببرودة';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onPlaceOrder({
      fullName,
      phone,
      address,
      notes,
      deliveryArea: DELIVERY_ZONES.find((z) => z.id === selectedZone)?.name || selectedZone,
      couponApplied: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmount,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="text-align-start mb-6">
        <button
          onClick={onBackToCart}
          className="flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-purple-light cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>الرجوع والتعديل على سلة المشتريات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form panel - left side */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-align-start">
          <h2 className="text-xl font-display font-black text-royal-purple mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center text-sm font-bold">1</span>
            معلومات التوصيل والاستلام
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5 focus:text-brand-purple">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: ليلى الودغيري"
                className={`w-full p-3.5 rounded-2xl border ${formErrors.fullName ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-brand-purple'} outline-none text-sm transition-colors bg-brand-cream/40`}
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">
                رقم الهاتف (واتساب مفضل للتنسيق) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 0612345678"
                className={`w-full p-3.5 rounded-2xl border ${formErrors.phone ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-brand-purple'} outline-none text-sm transition-colors bg-brand-cream/40 text-right`}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.phone}
                </p>
              )}
            </div>

            {/* Delivery Zone dropdown */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-gold" />
                منطقة التوصيل والخدمة
              </label>
              <select
                value={selectedZone}
                onChange={(e) => onZoneChange(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-brand-purple outline-none text-sm transition-colors bg-brand-cream font-medium"
              >
                <optgroup label="أحياء قريبة بـ (5 درهم توصيل)">
                  {DELIVERY_ZONES.filter(z => z.cost === 5).map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="أحياء متوسطة البعد بـ (10 دراهم توصيل)">
                  {DELIVERY_ZONES.filter(z => z.cost === 10).map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="أماكن أخرى أكثر بعداً">
                  {DELIVERY_ZONES.filter(z => z.cost === 0 || z.id === 'remote').map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              {(() => {
                const zone = DELIVERY_ZONES.find(z => z.id === selectedZone);
                return zone ? (
                  <div className="mt-2.5 p-3 rounded-2xl bg-purple-50/60 border border-brand-purple/10 text-xs text-brand-purple-dark leading-relaxed font-semibold">
                    📍 {zone.description}
                  </div>
                ) : null;
              })()}
              <p className="text-[11px] text-gray-400 mt-1.5">
                * ملاحظة: التوصيل يصبح مجاني بالكامل تلقائياً عند تجاوز الطلبات قيمة 100 DH.
              </p>
            </div>

            {/* Full Street Address */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">
                عنوان السكن <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: قرب المسجد، رقم المنزل 07، الشقة 2، ..."
                className={`w-full p-3.5 rounded-2xl border ${formErrors.address ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-brand-purple'} outline-none text-sm transition-colors bg-brand-cream/40`}
              />
              {formErrors.address && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.address}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Invoice breakdown & Coupons - right side */}
        <div className="lg:col-span-5 space-y-6 text-align-start font-sans">
          
          {/* Coupon Segment */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-display font-black text-royal-purple mb-3.5 flex items-center gap-1.5">
              <Gift className="w-5 h-5 text-brand-gold animate-bounce" />
              هل لديك كوبون تخفيض مالي؟
            </h3>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
                placeholder="رمز الكوبون"
                className="flex-1 p-3 rounded-2xl border border-gray-200 focus:border-brand-purple outline-none text-xs text-center uppercase tracking-widest font-black placeholder:tracking-normal placeholder:font-bold"
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl text-xs cursor-pointer border border-rose-200"
                >
                  إلغاء
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 bg-royal-purple hover:bg-brand-purple text-white font-bold rounded-2xl text-xs cursor-pointer text-nowrap transition-colors"
                >
                  تطبيق
                </button>
              )}
            </form>

            {couponError && (
              <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {couponError}
              </p>
            )}

            {couponSuccess && (
              <p className="text-xs text-emerald-600 font-black mt-2 flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <Check className="w-3.5 h-3.5 font-black" />
                {couponSuccess}
              </p>
            )}


          </div>

          {/* Detailed Invoice panel */}
          <div className="bg-white p-6 rounded-3xl border border-brand-gold/15 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-brand-gold" />
            
            <h3 className="text-base font-display font-black text-royal-purple mb-4 border-b border-gray-100 pb-3">
              تفاصيل الفاتورة النهائية
            </h3>

            {/* Collapsed items list */}
            <div className="max-h-36 overflow-y-auto mb-4 space-y-2 pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs text-gray-500">
                  <span className="line-clamp-1">
                    {item.product.arabicName} <strong className="text-royal-purple font-extrabold">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold whitespace-nowrap">{item.product.price * item.quantity} DH</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="space-y-3.5 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>سعر الفواكه والحلويات:</span>
                <span className="font-bold text-gray-800">{subtotal} DH</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-black bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100 text-xs">
                  <span>خصم الكوبون ({appliedCoupon.discountPercent}%):</span>
                  <span>-{discountAmount} DH</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>أجرة التوصيل للمنزل:</span>
                <span className="font-bold text-gray-800">
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 font-bold">مجاني</span>
                  ) : selectedZone === 'remote' ? (
                    <span className="text-brand-purple font-bold">يتم التفاهم حسب العنوان</span>
                  ) : (
                    <span>{actualDeliveryCost} DH</span>
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-royal-purple">
                    {selectedZone === 'remote' && !isFreeDelivery ? 'المجموع (بدون التوصيل):' : 'المبلغ الصافي المطلوب:'}
                  </span>
                  <span className="text-3xl font-black text-brand-gold-dark font-sans">
                    {finalTotal} <span className="text-sm font-bold text-royal-purple">DH</span>
                  </span>
                </div>
                {selectedZone === 'remote' && !isFreeDelivery && (
                  <p className="text-[11px] text-brand-purple font-semibold text-right leading-relaxed bg-purple-50 p-2 rounded-xl border border-brand-purple/10">
                    * سيتم الاتفاق على ثمن التوصيل المبرّد وإضافته عند تأكيد وفحص العنوان على الواتساب.
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all cursor-pointer text-base"
            >
              <Send className="w-5 h-5 text-white" />
              <span>إرسال الطلب الأن</span>
            </button>

            <div className="p-3 bg-brand-gold-soft/50 rounded-2xl border border-brand-gold/10 mt-4 text-center">
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                * ملاحظة: بعد الضغط، ستنعكس الطلبية على نظامنا فوراً للتوصيل برأس السنة، كما تفضل بتحويلها للواتساب لتأكيد الاستلام والتواصل المباشر مع دعاء وبسمة!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
