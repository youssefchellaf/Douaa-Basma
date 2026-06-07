import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, ShoppingBag, Plus, Minus, ChefHat, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  productId: number | null;
  products: Product[];
  onClose: () => void;
  onAddToCartWithCustomization: (product: Product, quantity: number, instructions: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  products,
  onClose,
  onAddToCartWithCustomization,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (productId) {
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setQuantity(1);
        setInstructions('');
        setSuccessMsg(false);
      }
    } else {
      setProduct(null);
    }
  }, [productId]);

  useEffect(() => {
    if (!product) {
      setRecommendations([]);
      return;
    }

    // Filter candidate products of categories 'desserts' or 'juices' excluding the current one
    let candidates = products.filter(
      (p) => p.id !== product.id && (p.category === 'desserts' || p.category === 'juices')
    );

    // If we have fewer than 3, fall back to any products other than the current one
    if (candidates.length < 3) {
      candidates = products.filter((p) => p.id !== product.id);
    }

    // Pick 3 random candidate recommended products by shuffling
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 3));
  }, [product, products]);

  if (!productId || !product) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    onAddToCartWithCustomization(product, quantity, instructions);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          id="product-details-modal"
        >
          {/* Header Action bar */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/95 text-gray-800 flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-0">
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Image panel */}
              <div className="md:col-span-5 aspect-square relative w-full bg-brand-purple-soft/50">
                <img
                  src={product.image}
                  alt={product.arabicName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none md:bg-gradient-to-l" />
                <div className="absolute bottom-6 right-6 left-6 text-white text-align-start">
                  <span className="bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase inline-block mb-2">
                    {product.category === 'juices' ? 'عصائر طبيعية' : product.category === 'desserts' ? 'تحليات أصيلة' : product.category === 'events' ? 'الأفراح و المناسبات' : 'عروض خاصة'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-white drop-shadow-md">
                    {product.arabicName}
                  </h2>
                </div>
              </div>

              {/* Informative panel */}
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between text-align-start font-sans">
                <div>
                  {/* Rating / Prep estimation */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    {product.size && (
                      <div className="flex items-center gap-2 bg-emerald-900 border border-brand-gold/30 px-3 py-1.5 rounded-xl">
                        <span className="text-xs font-bold text-brand-gold-light">
                          {(product.size.toLowerCase().includes('g') || product.size.toLowerCase().includes('gr')) ? 'الوزن:' : 'الحجم:'}
                        </span>
                        <span className="text-sm font-black text-brand-gold-light">{product.size}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold">
                        <Clock className="w-4 h-4 text-brand-purple" />
                        <span>زمن التحضير: {product.prepTime}</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                        product.isAvailable !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailable !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        <span>{product.isAvailable !== false ? 'متوفر' : 'غير متوفر'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Slogan details and long decscription */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-500">الوصف</h4>
                      <p className="text-gray-800 leading-relaxed mt-1 text-base font-medium">
                        {product.description}
                      </p>
                    </div>

                    {/* Ingredients list */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">المكونات</h4>
                      <div className="grid grid-cols-2 gap-2 bg-brand-beige/50 p-4 rounded-2xl border border-brand-gold/10">
                        {product.ingredients.map((ing, idx) => (
                          <span key={idx} className="flex items-center gap-1.5 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instruction Box */}
                    <div>
                      <label className="text-sm font-bold text-gray-400 block mb-1">
                        تخصيص مكونات الطلب (اختياري)
                      </label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="أضف تعليماتك، مثل: (بلا سكر، بدون لوز، ناقص حلاوة، خفيف ولا تقيل، الى اخره...)"
                        className="w-full h-18 p-3 rounded-xl border border-gray-200 focus:border-brand-purple outline-none text-sm leading-relaxed text-gray-700 resize-none bg-brand-cream"
                      />
                    </div>
                  </div>
                </div>

                {/* Adding action and item quantity */}
                <div className="border-t border-gray-100 pt-6 mt-6 flex flex-col sm:flex-row shadow-sm sm:shadow-none bg-white p-4 sm:p-0 rounded-2xl sm:rounded-none gap-4 justify-between items-center">
                  
                  {/* Quantity and absolute price */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <div className="border border-gray-200 rounded-2xl p-1 flex items-center bg-gray-50">
                      <button
                        onClick={handleDecrement}
                        className="w-9 h-9 rounded-xl hover:bg-white text-gray-600 flex items-center justify-center transition-colors font-bold cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-10 text-center font-bold text-royal-purple text-lg">
                        {quantity}
                      </span>

                      <button
                        onClick={handleIncrement}
                        className="w-9 h-9 rounded-xl hover:bg-white text-gray-600 flex items-center justify-center transition-colors font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-semibold">المجموع</span>
                      <span className="text-2xl font-black text-royal-purple">
                        {product.price * quantity} <span className="text-sm font-bold text-brand-gold">DH</span>
                      </span>
                    </div>
                  </div>

                  {/* Add action */}
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={handleAdd}
                      disabled={successMsg || product.isAvailable === false}
                      className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all text-sm cursor-pointer ${
                        product.isAvailable === false
                          ? 'bg-gray-400 cursor-not-allowed shadow-none'
                          : successMsg
                          ? 'bg-emerald-500 shadow-emerald-200'
                          : 'bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:shadow-brand-gold/20'
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
                          <span>تـم إضافته للسلة بنجاح!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5 text-white" />
                          <span>أضف للسلة ({quantity})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Recommendations segment */}
            <div className="bg-brand-cream p-6 md:p-8 border-t border-gray-100 text-align-start font-sans">
              <h3 className="text-lg font-bold text-royal-purple border-r-3 border-brand-gold pr-2.5 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                عصائر وتحليات ننصحك بها لتكتمل المتعة
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => setProduct(rec)}
                    className="bg-white p-3.5 rounded-2xl border border-gray-100 hover:border-brand-purple/20 shadow-sm cursor-pointer transition-all flex items-center gap-3 active:scale-95 group"
                  >
                    <img
                      src={rec.image}
                      alt={rec.arabicName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="w-full">
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-purple line-clamp-1">
                        {rec.arabicName}
                      </h4>
                      <p className="text-xs text-brand-gold-dark font-extrabold mt-1">{rec.price} DH</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
