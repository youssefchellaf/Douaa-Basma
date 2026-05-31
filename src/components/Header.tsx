import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Award, Sparkles, MapPin, Phone, Settings, Milk, Heart, MessageCircle, Menu, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  currentView: string;
  onSetView: (view: string) => void;
  cartItems: CartItem[];
  cartCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCart: () => void;
  isAdminUnlocked: boolean;
  onUnlockAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSetView,
  cartItems,
  cartCount,
  darkMode,
  onToggleDarkMode,
  onOpenCart,
  isAdminUnlocked,
  onUnlockAdmin,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    onSetView('home');
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      onUnlockAdmin();
      setLogoClicks(0);
    } else {
      setLogoClicks(nextClicks);
    }
    // Auto reset click counts after 3 seconds of inactivity
    const timeoutId = setTimeout(() => {
      setLogoClicks(0);
    }, 3000);
    return () => clearTimeout(timeoutId);
  };

  const baseNavLinks = [
    { view: 'home', label: 'الرئيسية' },
    { view: 'about', label: 'من نحن' },
    { view: 'delivery', label: 'التوصيل' },
    { view: 'contact', label: 'اتصل بنا' },
    { view: 'track', label: 'تتبع الطلب' },
    { view: 'admin', label: 'لوحة التحكم', isSpecial: true },
  ];

  const navLinks = isAdminUnlocked
    ? baseNavLinks
    : baseNavLinks.filter(l => l.view !== 'admin');

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-brand-gold/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Dropdown Menu (Right-hand/Left-hand side of header depending on flow) */}
        <div className="flex items-center">
          {/* Unified Premium Dropdown Menu for all screen sizes */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isDropdownOpen
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-light text-white shadow-md shadow-brand-gold/20'
                  : 'bg-brand-cream border border-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700/80'
              }`}
              id="nav-dropdown-btn"
              title="تصفح أقسام الموقع"
            >
              {isDropdownOpen ? (
                <X className="w-5.5 h-5.5 text-white" />
              ) : (
                <Menu className="w-5.5 h-5.5 text-brand-purple dark:text-brand-gold" />
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop overlay to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Card - opens aligned right to current position */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 overflow-hidden mt-3 w-72 z-50 bg-white dark:bg-neutral-950 rounded-3xl shadow-xl border border-brand-gold/20 p-3 flex flex-col gap-1 text-align-start"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-neutral-800 mb-2">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">بوابة التنقل السريع</span>
                      <span className="text-xs text-brand-gold-dark font-black">اختر وجهتك من هنا:</span>
                    </div>

                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        let LinkIcon = Sparkles;
                        let desc = "تصفح القائمة الرئيسية للتحليات والعصائر";
                        if (link.view === 'home') {
                          LinkIcon = Milk;
                          desc = "الرئيسية وقائمة العصائر والزعزع";
                        } else if (link.view === 'about') {
                          LinkIcon = Heart;
                          desc = "نشأتنا كواليس التحضير الطبيعي المتقن";
                        } else if (link.view === 'delivery') {
                          LinkIcon = MapPin;
                          desc = "مناطق التوصيل وشروط التوصيل المجاني";
                        } else if (link.view === 'contact') {
                          LinkIcon = Phone;
                          desc = "اتصل بنا لطلبات الأفراح والمناسبات الفخمة";
                        } else if (link.view === 'track') {
                          LinkIcon = Award;
                          desc = "تتبع حالة طلبك الفوري عبر واتساب";
                        } else if (link.view === 'admin') {
                          LinkIcon = Settings;
                          desc = "لوحة التحكم لإدارة الكوبونات والطلبات";
                        }

                        const isCurrent = currentView === link.view;

                        return (
                          <button
                            key={link.view}
                            onClick={() => {
                              onSetView(link.view);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-2xl flex items-start gap-4 transition-all cursor-pointer text-align-start ${
                              isCurrent
                                ? 'bg-brand-purple text-white shadow-md'
                                : 'hover:bg-brand-cream dark:hover:bg-neutral-900 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isCurrent 
                                ? 'bg-white/20 text-white' 
                                : link.isSpecial 
                                  ? 'bg-brand-gold-soft text-brand-gold-dark' 
                                  : 'bg-brand-purple-soft text-brand-purple'
                            }`}>
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black block">{link.label}</span>
                                {link.isSpecial && !isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-gold-soft text-brand-gold-dark font-black">
                                    ادارة
                                  </span>
                                )}
                              </div>
                              <span className={`text-[9px] block leading-normal mt-0.5 ${isCurrent ? 'text-white/80' : 'text-gray-400'}`}>
                                {desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Brand Logo - Perfectly Centered absolutely */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer select-none z-10" 
          onClick={handleLogoClick}
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1cYQT6KkaEIOteCG9UCK5BveNNbPulRUd" 
            alt="Logo" 
            className="w-32 h-32 md:w-36 md:h-36 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Action Controls & Cart Trigger on the Opposite Side */}
        <div className="flex items-center gap-3">
          
          {/* Support quick message button */}
          <a
            href="https://wa.me/212705908383"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer shadow-sm hidden sm:flex items-center gap-1.5 text-xs font-bold"
            title="تحدث مباشرة مع دعاء وبسمة"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span>طلب فوري</span>
          </a>

          {/* Dynamic Interactive Cart trigger with bounce notification count */}
          <button
            onClick={onOpenCart}
            className={`w-12 h-12 rounded-2xl relative flex items-center justify-center transition-all cursor-pointer ${
              cartItems.length > 0 
                ? 'bg-gradient-to-r from-brand-gold to-brand-gold-light text-white shadow-md shadow-brand-gold/20' 
                : 'bg-brand-cream border border-gray-100 text-gray-600 hover:bg-gray-100'
            }`}
            title="فتح سلة العقود والطلبات"
          >
            <ShoppingCart className="w-5.5 h-5.5" />
            
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -left-1.5 bg-brand-purple text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-bounce"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>

      </div>
    </header>
  );
};
