import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShoppingCart, Leaf } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: number) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-panel group rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-300 flex flex-col justify-between h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Available Status Badge */}
      {product.isAvailable !== false ? (
        <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          <span>متوفر</span>
        </span>
      ) : (
        <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-rose-500 to-red-650 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-rose-200 rounded-full"></span>
          <span>غير متوفر</span>
        </span>
      )}

      <div>
        {/* Product Image Section */}
        <div 
          onClick={() => onViewDetails(product.id)}
          className="relative aspect-square w-full overflow-hidden bg-brand-purple-soft/50 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.arabicName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Subtle bottom gradient to merge into card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-gold" />
            <span>{product.prepTime}</span>
          </div>

          {/* Organic / Quality Leaf tag */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-gray-100" title="طبيعي 100%">
            <Leaf className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
          </div>
        </div>

        {/* Product Content Section */}
        <div className="p-5 md:p-6 text-align-start">
          {/* Rating & Category tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-brand-purple uppercase">
              {product.category === 'juices' ? 'عصير طبيعي' : product.category === 'desserts' ? 'تحلية أصيلة' : product.category === 'events' ? 'الأفراح و المناسبات' : 'عروض خاصة'}
            </span>
            {product.size && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-700">الحجم:</span>
                <div className="bg-emerald-900 border border-brand-gold/30 px-2.5 py-1 rounded-xl">
                  <span className="text-xs font-black text-brand-gold-light">{product.size}</span>
                </div>
              </div>
            )}
          </div>

          <h3 
            onClick={() => onViewDetails(product.id)}
            className="font-display font-bold text-lg md:text-xl text-royal-purple hover:text-brand-purple duration-200 cursor-pointer"
          >
            {product.arabicName}
          </h3>
          
          <p className="text-sm text-gray-700 font-medium line-clamp-2 mt-2 leading-relaxed min-h-[44px] h-auto">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-3">
            {product.ingredients.slice(0, 3).map((ing, idx) => (
              <span key={idx} className="bg-gray-100 text-[11px] text-gray-500 rounded-lg px-2 py-0.5 font-medium">
                {ing}
              </span>
            ))}
            {product.ingredients.length > 3 && (
              <span className="text-[11px] text-gray-400 font-medium px-1">+{product.ingredients.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-5 md:p-6 pt-0 mt-2 border-t border-brand-gold/10 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">السعر الكلي</span>
          <span className="text-xl md:text-2xl font-black text-royal-purple">
            {product.price} <span className="text-sm font-bold text-brand-gold">DH</span>
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            className={`px-4 py-2 font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-xs cursor-pointer ${
              product.isAvailable !== false
                ? 'bg-gradient-to-r from-brand-purple to-royal-purple hover:from-brand-purple-light hover:to-brand-purple text-white shadow-brand-purple/10'
                : 'bg-gray-150 border border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-current" />
            <span>{product.isAvailable !== false ? 'طلب الآن' : 'عرض التفاصيل'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
