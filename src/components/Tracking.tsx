import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, ShieldAlert, Sparkles, MapPin, CheckCircle2, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { Order, SiteSettings } from '../types';

interface TrackingProps {
  orders: Order[];
  onViewStore: () => void;
  siteSettings: SiteSettings;
}

export const Tracking: React.FC<TrackingProps> = ({ orders, onViewStore, siteSettings }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (orders.length > 0) {
      if (selectedOrder) {
        const updated = orders.find((o) => o.id === selectedOrder.id);
        if (updated) {
          setSelectedOrder(updated);
          return;
        }
      }
      // Prioritize the latest order
      const sorted = [...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSelectedOrder(sorted[0]);
    }
  }, [orders, selectedOrder?.id]);

  // Sync active step strictly with control panel order status
  useEffect(() => {
    if (!selectedOrder) return;

    // Map order status to starting steps
    let initialStep = 0;
    if (selectedOrder.status === 'new') initialStep = -1;
    if (selectedOrder.status === 'pending') initialStep = 0;
    if (selectedOrder.status === 'preparing') initialStep = 1;
    if (selectedOrder.status === 'on_way') initialStep = 2;
    if (selectedOrder.status === 'delivered') initialStep = 3;
    if (selectedOrder.status === 'cancelled') initialStep = -1;
    
    setActiveStep(initialStep);
  }, [selectedOrder]);

  const STAGES = [
    {
      title: 'تم تأكيد الطلب',
      desc: 'قام فريقنا باعتماد وتأكيد طلبك بنجاح',
      icon: '✓',
      time: 'معتمد'
    },
    {
      title: 'يتم تجهيز طلبك',
      desc: 'نقوم بتجهيز طلبك مباشرة بعد قبوله لاستلامه طازج وبارد',
      icon: '✓',
      time: 'تحضير'
    },
    {
      title: 'مغادرة المندوب والحفاظ على البرودة',
      desc: 'نقوم بوضع الطلبيات داخل الحقائب الحافظة للبرودة لحفظ وضمان جودتها',
      icon: '✓',
      time: 'بالطريق'
    },
    {
      title: 'تم الإستلام بالصحة والراحة',
      desc: 'شكراً لك على استقبال طلبك من المندوب بالصحة والعافية، نتمنى زيارة موقعنا مرة أخرى',
      icon: '✓',
      time: 'مكتمل'
    }
  ];

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!selectedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center font-sans">
        <div className="w-20 h-20 bg-brand-gold-soft text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <ChevronRight className="w-10 h-10 rotate-180" />
        </div>
        <h2 className="text-xl font-display font-bold text-royal-purple mb-2">لا توجد طلبيات مسجلة لتتبعها حالياً</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
          عندما تقوم بطلب كوب عصير أو فلان، ستحصل تلقائياً على واجهة تتبع تفاعلية مباشرة لتفاصيل طلبك خطوة بخطوة.
        </p>
        <button
          onClick={onViewStore}
          className="px-6 py-3 bg-brand-purple hover:bg-brand-purple-light text-white font-bold rounded-2xl transition-colors cursor-pointer"
        >
          أطلب أول طلبية لك الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      
      {/* Title Segment */}
      <div className="text-align-start mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">تحديث حي ومباشر</span>
          <h1 className="text-2xl md:text-3xl font-display font-black text-royal-purple flex items-center gap-2">
            <Clock className="w-7 h-7 text-emerald-500 animate-spin-slow" />
            تتبع طلبيتك اللذيذة
          </h1>
        </div>
        
        {/* Orders list switcher if multiple */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 bg-brand-purple px-4 py-2.5 rounded-2xl border border-brand-purple-light/20 shadow-md">
            <span className="text-xs text-brand-gold font-black whitespace-nowrap">تبديل الطلب الحالي:</span>
            <select
              value={selectedOrder.id}
              onChange={(e) => {
                const found = orders.find((o) => o.id === e.target.value);
                if (found) setSelectedOrder(found);
              }}
              className="text-xs font-bold text-white outline-none bg-transparent cursor-pointer font-sans"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id} className="text-brand-purple bg-white">
                  {o.id} -- ({o.total} DH)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Progress tracker stages - left side */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Visual Header info */}
          <div className="glass-panel p-6 rounded-3xl bg-white/90 border border-brand-gold/15 shadow-md text-align-start relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-gold via-emerald-500 to-brand-gold" />
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-semibold">رقم التتبع التعريفي</span>
                <span className="text-lg font-black text-rose-950 font-mono">{selectedOrder.id}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-semibold">تاريخ ووقت المعاملة</span>
                <span className="text-sm font-bold text-gray-700">{selectedOrder.date}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-semibold">الزمن المتوقع للتسليم</span>
                <span className="text-sm font-bold text-brand-green">
                  يختلف حسب المنطقة
                </span>
              </div>
            </div>
            
            <div className={`mt-4 pt-4 border-t border-gray-100 p-4 rounded-2xl flex items-center justify-between ${
              selectedOrder.status === 'cancelled'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-emerald-50/40 border border-emerald-100/50'
            }`}>
              <span className={`text-xs font-bold flex items-center gap-1.5 font-sans ${
                selectedOrder.status === 'cancelled' ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {selectedOrder.status === 'cancelled' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                ) : (
                  <Sparkles className="w-4 h-4 text-brand-gold animate-pulse-slow" />
                )}
                الحالة المباشرة: {
                  selectedOrder.status === 'new' ? 'تم تسجيل طلبك ونحن بصدد مراجعته' :
                  selectedOrder.status === 'pending' ? 'تم تأكيد طلبك ومعتمد' :
                  selectedOrder.status === 'preparing' ? 'جاري تحضير وتعبئة مكونات الفواكه' :
                  selectedOrder.status === 'on_way' ? 'غادر المندوب ومسرع بالطريق إليك' :
                  selectedOrder.status === 'cancelled' ? 'عذراً، تم إلغاء هذا الطلب من إدارة المتجر ❌' :
                  'تم التسليم بنجاح، بالصحة والراحة!'
                }
              </span>
              <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-1 rounded-lg">تحديث من لوحة التحكم</span>
            </div>
          </div>
          


          {/* Staged list of progress */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-align-start relative font-sans">
            {selectedOrder.status === 'cancelled' ? (
              <div className="text-center py-6">
                <span className="block text-4xl mb-2">🛑</span>
                <h4 className="text-sm font-black text-rose-700 mb-1">تمت العودة وإلغاء الطلب بالكامل</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  لم نتمكن من إتمام هذه المعاملة إما لعدم استلامها أو بناءً على رغبتك. شكراً جزيلاً لتفهمك!
                </p>
              </div>
            ) : (
              <>
                <div className="absolute top-10 right-11 bottom-10 w-0.5 bg-gray-100 pointer-events-none" />
                
                <div className="space-y-8">
                  {STAGES.map((stage, index) => {
                    const isCompleted = index < activeStep || (selectedOrder.status === 'delivered' && index === 3);
                    const isCurrent = index === activeStep && selectedOrder.status !== 'delivered';
                    const isPending = index > activeStep;

                    return (
                      <div key={index} className="flex gap-4 relative">
                        
                        {/* Circle index status indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 shrink-0 text-sm transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
                            : isCurrent 
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-4 ring-emerald-50' 
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : stage.icon}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`font-bold text-base transition-colors ${
                              isCompleted ? 'text-emerald-700' : isCurrent ? 'text-emerald-800 font-extrabold' : 'text-gray-400'
                            }`}>
                              {stage.title}
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              isCompleted 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : isCurrent 
                                  ? 'bg-emerald-50 text-emerald-700 animate-pulse' 
                                  : 'bg-gray-50 text-gray-400'
                            }`}>
                              {stage.time}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${
                            isCompleted ? 'text-gray-500' : isCurrent ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {stage.desc}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Order Info Summary card - right side */}
        <div className="lg:col-span-4 space-y-6 text-align-start">
          
          {/* Deliver location & address info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-display font-black text-royal-purple mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              مكان التوصيل المحدد
            </h3>

            <div className="space-y-3.5 text-sm">
              <div>
                <span className="text-xs text-gray-400 block font-semibold">المستلم الكريم</span>
                <span className="font-bold text-gray-800">{selectedOrder.fullName}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-semibold">رقم الهاتف</span>
                <span className="font-mono font-bold text-gray-800">{selectedOrder.phone}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-semibold">العنوان السكني</span>
                <span className="font-medium text-gray-600 leading-normal block">
                  {selectedOrder.deliveryArea && !selectedOrder.address.includes(selectedOrder.deliveryArea)
                    ? `${selectedOrder.deliveryArea}، ${selectedOrder.address}`
                    : selectedOrder.address}
                </span>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-brand-gold-soft/50 rounded-2xl border border-brand-gold/10 text-xs text-gray-600">
                  <strong>ملاحظاتك للتحضير:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>
          </div>

          {/* Summary receipt break */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-display font-black text-royal-purple mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Package className="w-5 h-5 text-brand-purple" />
              تفاصيل الفاتورة المستلمة
            </h3>

            {/* List items requested */}
            <div className="space-y-3 max-h-40 overflow-y-auto mb-4 pr-1">
              {selectedOrder.items.map((item, idx) => (
                <div key={`${item.product.id}-${idx}`} className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-50 pb-2">
                  <span>
                    {item.product.arabicName} <strong className="text-brand-purple font-extrabold">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold whitespace-nowrap">{item.product.price * item.quantity} DH</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold text-gray-700">{selectedOrder.subtotal} DH</span>
              </div>
              
              {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>تخفيض الكوبون المتخذ:</span>
                  <span>-{selectedOrder.discountAmount} DH</span>
                </div>
              ) : null}

              <div className="flex justify-between text-gray-500">
                <span>رسوم التوصيل:</span>
                <span>{selectedOrder.deliveryCost === 0 ? 'مجاني' : `${selectedOrder.deliveryCost} DH`}</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 text-sm">
                <span className="font-bold text-royal-purple">الإجمالي:</span>
                <span className="text-lg font-black text-brand-gold-dark">{selectedOrder.total} DH</span>
              </div>
            </div>

            {/* Direct call support buttons */}
            <div className="flex justify-center mt-4 pt-2">
              <a
                href={`https://wa.me/${siteSettings?.whatsappNumber || '212705908383'}`}
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-[180px] p-2 border border-emerald-100 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>فريق الدعم</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
