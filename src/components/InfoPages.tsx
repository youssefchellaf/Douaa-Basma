import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Facebook, MessageCircle, MapPin, ShieldCheck, Soup, Truck, Award, Sparkles, Clock } from 'lucide-react';

import { SiteSettings } from '../types';

interface InfoPagesProps {
  activeTab: 'about' | 'delivery' | 'contact';
  siteSettings: SiteSettings;
}

export const InfoPages: React.FC<InfoPagesProps> = ({ activeTab, siteSettings }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (activeTab === 'about') {
    const titleText = siteSettings?.aboutTitle || "من نحن - Douaa & Basma";
    let firstPart = titleText;
    let secondPart = "";

    const separators = [" - ", " – ", " — ", "-", "–", "—"];
    for (const sep of separators) {
      if (titleText.includes(sep)) {
        const parts = titleText.split(sep);
        firstPart = parts[0];
        secondPart = parts.slice(1).join(sep);
        break;
      }
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="relative glass-panel bg-white/80 rounded-3xl p-8 md:p-12 shadow-xl border-t-4 border-brand-gold overflow-hidden">
          {/* Islamic Frame Accents */}
          <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-brand-gold/30 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-brand-gold/30 rounded-bl-3xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <span className="text-sm font-semibold tracking-wider text-brand-gold uppercase block mb-1">قصتنا وهويتنا</span>
            <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-royal-purple flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold animate-pulse-slow" />
                {firstPart.trim()}
                <Sparkles className="w-5 h-5 text-brand-gold animate-pulse-slow" />
              </h1>
              {secondPart && (
                <span className="text-xl md:text-2xl font-display text-brand-gold font-extrabold drop-shadow-sm tracking-wide mt-2">
                  {secondPart.trim()}
                </span>
              )}
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4" />
          </div>

          <div className="space-y-8 text-lg text-gray-700 leading-relaxed text-center">
            <p className="font-medium text-xl text-brand-purple">
              {siteSettings?.aboutHeroText || "مرحبًا بكم في عالم النكهات الفاخرة والطبيعية 100%"}
            </p>
            
            <p className="bg-brand-purple-soft/40 p-6 rounded-2xl border border-brand-purple/10">
              {siteSettings?.aboutMainText || "Douaa & Basma هو مشروع نسائي مغربي شغوف ومتخصص في تحضير العصائر الطبيعية والتحليات المنزلية الراقية. نقدم لكم تشكيلة مختارة من المنتجات المعدة بمكونات طازجة منتقاة حبة بحبة، لنصنع تجربة فريدة تمزج بين الفخامة والأصالة المغربية."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-5 rounded-2xl bg-brand-gold-soft/50 border border-brand-gold/20 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3">
                  <Soup className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-royal-purple text-base mb-2">مكونات ممتازة</h3>
                <p className="text-sm text-gray-600">نختار الفواكه طازجة يومياً ونستخدم حليب طري ومكسرات بأعلى جودة لضمان الطعم الفاخر.</p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-purple-soft/30 border border-brand-purple/10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-royal-purple text-base mb-2">حرفية عائلية</h3>
                <p className="text-sm text-gray-600">تحضير منزلي أصيل بحب وعناية نسائية بالغة، مع مراعاة أعلى معايير النظافة والتعقيم.</p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-gold-soft/50 border border-brand-gold/20 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-royal-purple text-base mb-2">ضمان الجودة</h3>
                <p className="text-sm text-gray-600">لا نستخدم ملونات صناعية، مواد حافظة، أو نكهات معدلة. كل شيء طبيعي كما تحبه عائلتك.</p>
              </div>
            </div>

            <p className="text-base text-gray-500 pt-4">
              نحن هنا لنضفي لمسة من البهجة والرفاهية على جلسات عائلتكم ومناسباتكم الخاصة من خلال العصائر المنعشة والتحليات كــ "زعزع و فلان".
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (activeTab === 'delivery') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="relative glass-panel bg-white/80 rounded-3xl p-8 md:p-12 shadow-xl border-t-4 border-brand-purple overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-brand-purple/20 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-brand-purple/20 rounded-bl-3xl pointer-events-none" />
          
          <div className="text-center mb-10">
            <span className="text-sm font-semibold tracking-wider text-brand-purple uppercase block mb-1">سرعة وأمان</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-royal-purple flex items-center justify-center gap-2">
              <Truck className="w-6 h-6 text-brand-gold animate-bounce" />
              سياسة وشروط التوصيل
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brand-purple to-transparent mx-auto mt-4" />
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-sm mb-3 animate-pulse">
                عرض مميز
              </span>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">التوصيل مجانـي للطلبات فوق 100 درهم!</h3>
              <p className="text-emerald-700 text-base">اطلب ما قيمته 100 DH أو أكثر، وسوف نتحمل تكلفة التوصيل بالكامل لجميع أحياء المدينة.</p>
            </div>

             <h3 className="text-xl font-bold text-royal-purple border-r-4 border-brand-gold pr-3 mt-8">تسعيرة التوصيل حسب المنطقة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500 text-white inline-block">توصيل مجاني 🎁</span>
                  <h4 className="font-bold text-gray-800 mt-3 text-lg">أحياء معفيّة</h4>
                  <p className="text-sm text-gray-500 mt-2">توصيل سريع مجاني بالكامل بدون أدنى تكلفة مضافة للطلب.</p>
                  <div className="mt-3 text-[11px] text-gray-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10">
                    <span className="font-bold text-emerald-700 block mb-1">الأحياء المشمولة:</span>
                    <span className="leading-relaxed">الحي الجديد، حي الشبار، حي سبيلة، حي الزاوية، حومة الفوقية.</span>
                  </div>
                </div>
                <div className="border-t border-emerald-100 pt-4 mt-4 grid grid-cols-2 gap-2 text-right">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-[11px] font-bold">توقيت التوصيل</span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5 flex-shrink-0" /> سريع ومبرد</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-emerald-600 text-[11px] font-bold">ثمن التوصيل</span>
                    <span className="font-bold text-emerald-600 text-lg leading-snug animate-pulse">0 DH (مجاناً)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-purple-soft text-brand-purple">داخل المدينة</span>
                  <h4 className="font-bold text-gray-800 mt-3 text-lg">الأحياء القريبة</h4>
                  <p className="text-sm text-gray-500 mt-2">توصيل سريع عبر الدراجات النارية المجهزة بالحقائب المبردة.</p>
                  <div className="mt-3 text-[11px] text-gray-500 bg-brand-purple-soft/20 p-2.5 rounded-xl border border-brand-purple/10">
                    <span className="font-bold text-brand-purple block mb-1">الأحياء المشمولة:</span>
                    <span className="leading-relaxed">حي بايصة، حي الأميرة، حي رأس لوطا، حي كنديسة، حي أغطاس، حي سيدي بوغابة، حي المرجة، حي سيراميكا، حي الباطيو، حي بوسيطو، حومة د بحر، حومة د الواد.</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-2 text-right">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-[11px] font-bold">توقيت التوصيل</span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5 flex-shrink-0" /> يختلف حسب المنطقة</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-gray-400 text-[11px] font-bold">ثمن التوصيل</span>
                    <span className="font-bold text-royal-purple text-lg leading-snug">5 DH</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-gold-soft text-brand-gold-dark">المناطق المجاورة</span>
                  <h4 className="font-bold text-gray-800 mt-3 text-lg">الأحياء البعيدة</h4>
                  <p className="text-sm text-gray-500 mt-2">توصيل سريع عبر الدراجات النارية المجهزة بالحقائب المبردة.</p>
                  <div className="mt-3 text-[11px] text-gray-500 bg-brand-gold-soft/25 p-2.5 rounded-xl border border-brand-gold/10">
                    <span className="font-bold text-brand-gold-dark block mb-1">الأحياء المشمولة:</span>
                    <span className="leading-relaxed">حي بنديبان، حي برارك، حيضرة، ريفيين، واد داويات، ممزلة.</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-2 text-right">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-[11px] font-bold">توقيت التوصيل</span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5 flex-shrink-0" /> يختلف حسب المنطقة</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-gray-400 text-[11px] font-bold">ثمن التوصيل</span>
                    <span className="font-bold text-royal-purple text-lg leading-snug">10 DH</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700">المناطق البعيدة</span>
                  <h4 className="font-bold text-gray-800 mt-3 text-lg">خارج المدينة</h4>
                  <p className="text-sm text-gray-500 mt-2">سعر التوصيل حسب المسافة التي سيتم قطعها.</p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-2 text-right">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-[11px] font-bold">توقيت التوصيل</span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5 flex-shrink-0" /> يختلف حسب المنطقة</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-gray-400 text-[11px] font-bold">ثمن التوصيل</span>
                    <span className="font-bold text-royal-purple text-lg leading-snug">## DH</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-brand-beige border border-brand-gold/10 mt-6">
              <h4 className="font-bold text-royal-purple mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                تنويه الحفاظ على البرودة
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                جميع طلبياتنا يتم نقلها داخل حاويات تحتفظ على البرودة للحفاظ على طراوة العصائر و التحليات لتقديمها باردة تماماً كالتقديم المنزلي.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="relative glass-panel bg-white/80 rounded-3xl p-8 md:p-12 shadow-xl border-t-4 border-brand-gold overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-brand-gold/20 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-brand-gold/20 rounded-bl-3xl pointer-events-none" />
        
        <div className="text-center mb-10">
          <span className="text-sm font-semibold tracking-wider text-brand-gold uppercase block mb-1">نسعد بخدمتكم</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-royal-purple flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-brand-gold" />
            تواصلوا معنا الآن
          </h1>
          <p className="text-gray-500 text-sm mt-2">جاهزون للرد على استفساراتكم وحجز طلبياتكم وأفراحكم الخاصة</p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-royal-purple mb-4">قنوات التواصل الرسمية</h3>
            
            <a
              href={`https://wa.me/${siteSettings?.whatsappNumber || '212705908383'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all text-emerald-900 group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-align-start">
                <p className="text-xs text-emerald-700 font-medium font-sans">واتساب الطلبات الفوري</p>
                <p className="text-lg font-bold font-mono">{siteSettings?.whatsappNumber || '0705908383'}</p>
                <p className="text-xs text-emerald-600 mt-1">اضغط للتحدث معنا مباشرة والطلب السريع</p>
              </div>
            </a>

            <a
              href={siteSettings?.instagramUrl || "https://instagram.com/douaabasma_1"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-all text-pink-900 group shadow-sm"
              style={{ direction: 'rtl' }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <div className="text-align-start font-sans">
                <p className="text-xs text-pink-700 font-medium font-sans">حسابنا على الإنستغرام</p>
                <p className="text-lg font-bold font-mono">@{ (siteSettings?.instagramUrl || 'douaabasma_1').replace(/\/$/, '').split('/').pop() || 'douaabasma_1' }</p>
                <p className="text-xs text-pink-600 mt-1 font-medium">تابعوا كواليس التحضير والآراء اليومية 📸</p>
              </div>
            </a>

            <a
              href={siteSettings?.facebookUrl || "https://m.facebook.com/douaabasma01/"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all text-blue-900 group shadow-sm"
              style={{ direction: 'rtl' }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              <div className="text-align-start font-sans">
                <p className="text-xs text-blue-700 font-medium">صفحتنا على الفيسبوك</p>
                <p className="text-lg font-bold">{siteSettings?.storeName || "Douaa & Basma"}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">تابعوا منشوراتنا وعروضنا المباشرة على فيسبوك 👍</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-purple-soft/40 border border-brand-purple/10">
              <div className="w-12 h-12 rounded-xl bg-brand-purple text-white flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-align-start">
                <p className="text-xs text-brand-purple font-medium">موقع الإنتاج والتحضير</p>
                <p className="text-base font-bold text-royal-purple">المملكة المغربية، المنطقة الشمالية</p>
                <p className="text-xs text-gray-500 mt-0.5">الفنيدق، الحي الجديد</p>
              </div>
            </div>
          </div>

          {/* Opening hours & notice */}
          <div className="p-6 rounded-2xl bg-brand-beige/50 border border-brand-gold/15 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-royal-purple text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-gold" />
                ساعات استقبال الطلبات
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-brand-gold/10 gap-1">
                  <span className="font-medium">طيلة أيام الأسبوع:</span>
                  <span className="font-bold text-brand-purple">08:00 صباحاً - 23:30 مساءً</span>
                </li>
                <li className="flex flex-col sm:flex-row justify-between sm:items-start py-2 border-b border-brand-gold/10 gap-1">
                  <span className="font-medium">يوم الجمعة المبارك:</span>
                  <div className="flex flex-col items-start sm:items-end text-xs font-bold text-brand-purple">
                    <span>من 08:00 صباحاً إلى 13:00 ظهراً</span>
                    <span className="text-[11px] text-gray-400 font-medium my-0.5">و</span>
                    <span>من 15:00 بعد الظهر إلى 23:30 مساءً</span>
                  </div>
                </li>
                <li className="flex justify-between items-center py-1.5">
                  <span className="font-medium">المناسبات و الأفراح:</span>
                  <span className="font-bold text-emerald-700">تواصلوا معنا قبل 24 ساعة</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 border-t border-brand-gold/10 pt-4 text-center">
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                ملاحظة: لضمان تقديم جودة تليق بكم وبضيوفكم، يتم عصر المشروبات وتقديم التحليات طازجة
              </p>
              <div className="mt-4 flex justify-center gap-1 text-xs font-bold text-brand-gold">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
