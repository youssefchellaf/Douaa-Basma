import React from 'react';
import { motion } from 'motion/react';
import { Milk, Sparkles, ChefHat, ShieldCheck, Heart, ArrowLeft, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOrderNowClick: () => void;
  onExploreStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNowClick, onExploreStory }) => {
  return (
    <div className="relative overflow-hidden font-sans">
      
      {/* Visual background using our generated Moroccan andalusion banner */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_banner_1779343691365.png"
          alt="Douaa & Basma Royal Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 brightness-[0.92] dark:brightness-[0.7]"
        />
        {/* Gradients to blend banner flawlessly into white and deep violet pages */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-brand-cream/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cream/40 to-brand-cream" />
      </div>

      {/* Hero content blocks and headlines */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-28 md:pb-32 text-align-start flex flex-col justify-center min-h-[50vh]">
        
        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl space-y-6"
        >
          {/* Sparkly sub-badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs md:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-brand-gold animate-pulse-slow" />
            <span>مشروع نسائي منزلي فاخر 100%</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-royal-purple leading-tight drop-shadow-sm">
            مذاق طبيعي… <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light">
              بلمسة فاخرة
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold">
            نحضر لكم أفخر العصائر الطبيعية المبردة والتحليات المنزلية المغربية الأصيلة، من المنتجات الطازجة وبمعايير تليق بكرم ضيافتكم ورفاهية أهليكم في الفنيدق، الحي الجديد.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={onOrderNowClick}
              className="px-8 py-4 bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/30 active:scale-95 transition-all text-sm cursor-pointer group"
            >
              <span>تصفح قائمة العصائر و التحليات</span>
              <ArrowDown className="w-4 h-4 text-white hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={onExploreStory}
              className="px-6 py-4 border border-brand-gold hover:border-brand-purple text-brand-gold hover:text-brand-purple font-bold rounded-2xl flex items-center justify-center text-xs transition-colors bg-white/70 backdrop-blur-sm cursor-pointer"
            >
              اقرأ قصة مشروعنا ونشأتنا
            </button>
          </div>
        </motion.div>

      </div>

      {/* Overlapping trust features bar - "لماذا نحن" */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-brand-gold/15 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-align-start font-sans">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-3">
              <Milk className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">مكونات طازجة</h4>
            <p className="text-[11px] text-gray-500 mt-1">فواكه منتقاة بعناية لضمان أعلى فائدة وطزاجة مطلقة.</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-soft/60 text-brand-purple flex items-center justify-center mb-3">
              <ChefHat className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">تحضير منزلي</h4>
            <p className="text-[11px] text-gray-500 mt-1">شغف وحرفية عائلية نسائية فائقة الجودة والنظافة والتعقيم.</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">جودة عالية</h4>
            <p className="text-[11px] text-gray-500 mt-1">خالٍ تام من المنكهات الصناعية والمواد الحافظة الكيماوية.</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-soft/60 text-brand-purple flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-brand-purple-light animate-pulse-slow" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">مذاق فاخر</h4>
            <p className="text-[11px] text-gray-500 mt-1">توليفات غنية ومميزة تمزج الحلويات التقليدية مع المشروبات العصرية.</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-right col-span-2 md:col-span-1 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            <div className="w-full h-full flex flex-col justify-center text-center md:text-right">
              <span className="text-xl font-black text-brand-green">توصيل بـ 5 DH!</span>
              <p className="text-[10px] text-gray-400 mt-1">
                توصيل فائق السرعة مع الحفاظ التام على البرودة، ومجاني فوق 100 DH.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
