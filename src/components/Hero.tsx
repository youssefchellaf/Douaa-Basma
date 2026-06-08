import React from 'react';
import { motion } from 'motion/react';
import { Milk, Sparkles, ChefHat, ShieldCheck, Heart, ArrowDown } from 'lucide-react';
import { SiteSettings } from '../types';
import { getProxiedImageUrl } from '../utils';

interface HeroProps {
  onOrderNowClick: () => void;
  onExploreStory: () => void;
  siteSettings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNowClick, onExploreStory, siteSettings }) => {
  return (
    <div className="relative overflow-hidden font-sans">
      
      {/* FIRST FRAME AREA (Header content, title, description, buttons) */}
      <div className="relative pt-0 pb-8 md:py-16 flex flex-col justify-center min-h-[30vh] overflow-hidden">
        
        {/* Background / Banner for first frame area */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-cream via-white to-brand-beige flex justify-center items-center">
          {/* Mobile: Show uploaded mobile banner if present with cover fit to fill the container sides, aligned to the top */}
          {siteSettings?.heroBannerMobileUrl ? (
            <div className="relative w-full h-full md:hidden flex justify-center items-start bg-brand-cream">
              <img
                src={getProxiedImageUrl(siteSettings.heroBannerMobileUrl)}
                alt="Douaa & Basma Mobile Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-100 opacity-95 brightness-[0.98] object-top blur-[1.5px]"
              />
              {/* Soft, elegant layout protection gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 arabesque-pattern opacity-40 mix-blend-multiply md:hidden" />
          )}

          {/* Desktop: Show uploaded desktop banner if present without zoom and scale */}
          {siteSettings?.heroBannerUrl ? (
            <div className="relative w-full h-full hidden md:flex justify-center items-center bg-brand-cream">
              <img
                src={getProxiedImageUrl(siteSettings.heroBannerUrl)}
                alt="Douaa & Basma Desktop Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain scale-100 opacity-95 brightness-[0.98] blur-[1.5px]"
              />
              {/* Soft, elegant layout protection gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cream/10 via-transparent to-brand-cream/10 pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 hidden md:block">
              {/* Moroccan luxury lattice pattern overlay */}
              <div className="absolute inset-0 arabesque-pattern opacity-40 mix-blend-multiply" />
              
              {/* Soft, beautiful floating radial accents of brand gold and warm royal purple */}
              <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
            </div>
          )}
        </div>

        {/* Hero content blocks and headlines */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0 md:pt-6 md:pb-8 flex flex-col justify-center w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-xl md:max-w-3xl md:mx-auto w-full space-y-2.5 text-right md:text-center"
          >
            {/* Text and title info inside an elegant glassmorphic frosted-glass frame */}
            <div className="bg-white/70 dark:bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-[32px] border border-brand-gold/15 shadow-xl shadow-royal-purple/5 space-y-3.5 w-full flex flex-col items-start md:items-center text-right md:text-center">
              {/* Sparkly sub-badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/15 text-brand-purple text-xs md:text-sm font-bold">
                <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                <span>{siteSettings?.promoBadgeText || "مشروع نسائي منزلي فاخر 100%"}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-royal-purple leading-tight drop-shadow-sm">
                {siteSettings?.heroTitle || "مذاق طبيعي... لا يقاوم"}<br />
                <span className="block mt-1.5 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  {siteSettings?.heroSubTitle || "جودة متالية بلمسة حب"}
                </span>
              </h2>

              <p className="text-xs md:text-base text-neutral-800 dark:text-gray-200 leading-relaxed font-semibold md:font-medium">
                {siteSettings?.heroDescription || "نحضر لكم أفخر وأجود العصائر الطبيعية الباردة والتحليات المنزلية الأصيلة، بمكونات طازجة مختارة بعناية وبمعايير تليق بكرم الضيافة ورفاهية أهليكم"}
              </p>
            </div>

            {/* Action buttons completely outside the card on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-3 sm:pb-0 items-center justify-center w-full">
              <button
                onClick={onOrderNowClick}
                className="w-full sm:w-72 px-8 py-4 bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/30 active:scale-95 transition-all text-sm cursor-pointer group"
              >
                <span>تصفح قائمة العصائر و التحليات</span>
                <ArrowDown className="w-4 h-4 text-white group-hover:translate-y-1 transition-transform" />
              </button>

              <button
                onClick={onExploreStory}
                className="w-full sm:w-72 px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 text-sm"
              >
                <span>اقرأ قصة مشروعنا ونشأتنا</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* SECOND FRAME AREA (Why Us: trust cards and delivery announcement) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
        
        {/* Crisp solid white container for clear professional readout */}
        <div className="bg-white dark:bg-neutral-900 rounded-[36px] p-6 md:p-10 shadow-2xl border border-brand-gold/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-sans">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-3">
              <Milk className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">مكونات طازجة</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">فواكه منتقاة بعناية لضمان أعلى فائدة وطزاجة مطلقة.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-soft/60 text-brand-purple flex items-center justify-center mb-3">
              <ChefHat className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">تحضير منزلي</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">شغف وحرفية عائلية نسائية فائقة الجودة والنظافة والتعقيم.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">جودة عالية</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">خالٍ تام من المنكهات الصناعية والمواد الحافظة الكيماوية.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-soft/60 text-brand-purple flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-brand-purple-light animate-pulse-slow" />
            </div>
            <h4 className="font-bold text-royal-purple text-sm">مذاق فاخر</h4>
            <p className="text-[11px] text-gray-500 mt-1">توليفات غنية ومميزة تمزج الحلويات التقليدية مع المشروبات العصرية.</p>
          </div>

          <div className="col-span-2 md:col-span-4 border-t border-gray-100 dark:border-neutral-800/40 pt-5 mt-2">
            <div className="w-full flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-xl md:text-2xl font-black text-brand-green flex items-center gap-2 justify-center">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                التوصيل ابتداءا من «0» درهم
              </span>
              <p className="text-xs md:text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 max-w-2xl leading-relaxed font-semibold">
                توصيل فائق السرعة مع الحفاظ التام على الطازجة والبرودة، ومجاني للطلبات فوق 100 DH و طلبات الأحياء القريبة.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
