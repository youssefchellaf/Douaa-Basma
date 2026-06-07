import { Product, Category, Testimonial, Coupon } from '../types';
import productZaza from '../assets/images/product_zaza_1779343709922.png';
import productMangoUploaded from '../assets/images/product_mango_uploaded_1779885224824.png';
import productFlan from '../assets/images/product_flan_1779343731407.png';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'الكل',
    description: 'جميع المشروبات والتحليات الفاخرة',
    icon: 'Sparkles',
  },
  {
    id: 'juices',
    name: 'عصائر طبيعية',
    description: 'عصائر طازجة محضرة بأجود أنواع الفواكه الطبيعية',
    icon: 'Milk',
  },
  {
    id: 'desserts',
    name: 'تحليات أصيلة',
    description: 'فلانات وحلويات منزلية فاخرة بنكهات أصيلة',
    icon: 'Dessert',
  },
  {
    id: 'specials',
    name: 'عروض خاصة',
    description: 'خصومات حصرية وتشكيلة عروض فريدة',
    icon: 'Percent',
  },
  {
    id: 'events',
    name: 'الأفراح و المناسبات',
    description: 'حلويات وعصائر مناسباتكم السعيدة وأفراحكم بكل فخامة وبهاء',
    icon: 'PartyPopper',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Zaza Royal",
    arabicName: "زعزع الملكي الفاخر",
    description: "مزيج غني ولذيذ من الأفوكادو الطازج، فلان الكراميل البيتي، قطع الموز، واللوز المحمص المقرمش مع لمسة تزيين فاخرة.",
    price: 25,
    image: productZaza,
    category: "desserts",
    size: "300g",
    isFeatured: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["أفوكادو طازج", "موز غني", "فلان كراميل منزلي", "لوز محمص مقرمش", "حليب كامل الدسم", "مكسرات وفواكه جافة للتزيين"]
  },
  {
    id: 2,
    name: "Creamy Avocado Shake",
    arabicName: "عصير الأفوكادو الملكي",
    description: "أفوكادو مخفوق بعناية حتى الحصول على قوام كريمي ناعم، غني بالمكسرات والعسل الطبيعي لمذاق ونشاط مثالي.",
    price: 25,
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "350ml",
    isFeatured: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["أفوكادو ممتاز", "حليب طازج", "عسل حر طبيعي", "لوز مطحون"]
  },
  {
    id: 3,
    name: "Golden Mango Nectar",
    arabicName: "عصير المانجو",
    description: "عصير مانجو استوائي نقي 100% غني بالألياف والفوائد، بنكهة غنية ومنعشة ومحضرة مباشرة عند الطلب.",
    price: 25,
    image: productMangoUploaded,
    category: "juices",
    size: "350ml",
    isFeatured: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["أفخر أنواع المانجو", "قطع ثلج خفيفة", "لمسة نعناع طازج"]
  },
  {
    id: 4,
    name: "Banana & Apple Fusion",
    arabicName: "عصير الموز والتفاح اللطيف",
    description: "مزيج متناغم ورائع من الموز الحلو الغني بالبوتاسيوم والتفاح الطازج، مخفوق بحليب خفيف لمذاق متوازن ومغذي.",
    price: 20,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "350ml",
    prepTime: "5 - 10 دقائق",
    ingredients: ["موز ناضج حُلو", "تفاح طازج مقشر", "حليب بارد", "قرفة مطحونة اختيارية"]
  },
  {
    id: 5,
    name: "Mystic Dragon Fruit Juice",
    arabicName: "عصير دراغون المخملي",
    description: "عصير فريد من ثمرة الفاكهة التنينية الوردية المنعشة، لمظهر جذاب خلّاب ومذاق استثنائي يجمع بين الحلاوة والانتعاش العظيم.",
    price: 25,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "350ml",
    isFeatured: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["ثمرة التنين (Dragon Fruit) حمراء", "مستخلص الليمون الحامض", "ماء جوز الهند لمنعش ممتع"]
  },
  {
    id: 6,
    name: "Classic Panache Juices",
    arabicName: "عصير البناشي الأصيل",
    description: "الكوكتيل المغربي الكلاسيكي الشهير، توليفة ممتازة وغنية من الفواكه الموسمية المختلطة والحليب، طاقة وحيوية في كل رشفة.",
    price: 25,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "400ml",
    prepTime: "5 - 10 دقائق",
    ingredients: ["موز، تفاح، خوخ، مكسرات متكاملة", "برتقال ناعم", "حليب طازج"]
  },
  {
    id: 7,
    name: "Fresh Orange Sunshine",
    arabicName: "عصير البرتقال الطبيعي المنعش",
    description: "عصير برتقال طبيعي مصفي 100% معصور يدوياً وبكل عناية من أجود مزارع الموالح، غني بفيتامين C ومنعش بامتياز.",
    price: 20,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "350ml",
    prepTime: "5 - 10 دقائق",
    ingredients: ["برتقال مغربي طازج 100%", "بدون مياه مضافة", "بدون سكر مضاف"]
  },
  {
    id: 8,
    name: "Pear & Pineapple Delight",
    arabicName: "عصير الإجاص والأناناس المتميز",
    description: "اندماج فريد ومنعش يجمع بين رقة الإجاص وحلاوة الأناناس الاستوائي، يعطيك شعوراً لا يوصف بالانتعاش الفوري.",
    price: 25,
    image: "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=600",
    category: "juices",
    size: "350ml",
    prepTime: "5 - 10 دقائق",
    ingredients: ["إجاص طري", "أناناس ناضج غني بالشراب", "رشة بنكهة الزنجبيل الطازج"]
  },
  {
    id: 9,
    name: "Caramel Flan with Almonds",
    arabicName: "فلان كراميل باللوز الفاخر (تورون)",
    description: "تحلية مغربية أندلسية كلاسيكية محبوبة، محضر من حليب وقشدة بيضاء طازجة ومزين بطبقة غنية من التورون ورقائق اللوز المقرمشة.",
    price: 15,
    image: productFlan,
    category: "desserts",
    size: "200g",
    isFeatured: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["حليب مكثف", "قشدة طازجة", "عسل وكراميل ذهبي محروق برقة", "رقائق اللوز والتورون الأندلسي الفاخر"]
  },
  {
    id: 10,
    name: "Venezuelan Special Flan",
    arabicName: "الفلان الفنزويلي المخملي",
    description: "فلان مخبوز ببطء غني بمستخلص الفانيليا وقشر الليمون الخفيف، ناعم جداً وبطعم مكثف يذوب في الفم بسعادة.",
    price: 12,
    image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&q=80&w=600",
    category: "desserts",
    size: "180g",
    prepTime: "5 - 10 دقائق",
    ingredients: ["بيض طازج", "حليب مكثف ومبخر", "فانيليا مدغشقرية طبيعية", "كراميل سائل"]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "فاطمة",
    city: "حي الشبار",
    rating: 5,
    comment: "عصير الأفوكادو باللوز طعمه في غاية الروعة ومذاقه طبيعي ولذيذ جداً ومحضر بإتقان ونظافة تامة. التوصيل سريع، الله يوفقكم!",
    date: "•زبون"
  },
  {
    id: 2,
    name: "يوسف",
    city: "حي بنديبان",
    rating: 5,
    comment: "عصير الموز مع التفاح لذيذ ومنعش للغاية، الفواكه طازجة وطعمها ممتع ومثالي للانتعاش اليومي. جودة الخدمة ممتازة وسريعة.",
    date: "•زبون"
  },
  {
    id: 3,
    name: "سلوى",
    city: "حي أغطاس",
    rating: 5,
    comment: "جربت عصير بناشي وهو كوكتيل الفواكه، المذاق رائع وممتاز جداً وقوامه متناسق ولذيذ. يصل المشروب بارداً ومنعشاً كأنه محضر للتو!",
    date: "•زبون"
  },
  {
    id: 4,
    name: "أحمد",
    city: "الحي الجديد",
    rating: 5,
    comment: "عصير البرتقال الطازج طعمه طبيعي مائة بالمائة ومنعش جداً. النظافة استثنائية والتوصيل سريع وبطريقة تحفظ البرودة المثالية.",
    date: "•زبون"
  },
  {
    id: 5,
    name: "سهام",
    city: "ريفيين",
    rating: 5,
    comment: "عصير فاكهة الدراغون غاية في الأناقة والانتعاش والمذاق متميز وفريد جداً. تجربة رائعة وسأواصل الطلب والتعامل معكم بالتأكيد.",
    date: "•زبون"
  },
  {
    id: 6,
    name: "ياسين",
    city: "حي الباطيو",
    rating: 5,
    comment: "عصير الفراولة مع الإجاص لذيذ جداً ومنسجم بمذاق خفيف ورائع يفوق التوقعات. مشروب عالي الجودة وخالٍ من أي إضافات، بالصحة والراحة.",
    date: "•زبون"
  }
];

export const APP_COUPONS: Coupon[] = [
  { code: "RAMADAN2026", discountPercent: 15, active: true },
  { code: "DB2026", discountPercent: 10, active: true, minOrder: 50 },
  { code: "FREEPASS", discountPercent: 100, active: false } // Admin testing
];

export const DELIVERY_ZONES = [
  // Free delivery places (توصيل مجاني)
  { id: "new_neighborhood", name: "الحي الجديد", cost: 0, description: "الحي الجديد (توصيل سريع بالمجان)" },
  { id: "shabar", name: "حي الشبار", cost: 0, description: "حي الشبار (توصيل سريع بالمجان)" },
  { id: "sabila", name: "حي سبيلة", cost: 0, description: "حي سبيلة (توصيل سريع بالمجان)" },
  { id: "zawiya", name: "حي الزاوية", cost: 0, description: "حي الزاوية (توصيل سريع بالمجان)" },
  { id: "fawqiya", name: "حومة الفوقية", cost: 0, description: "حومة الفوقية (توصيل سريع بالمجان)" },

  // 5 DH places
  { id: "baisa", name: "حي بايصة", cost: 5, description: "حي بايصة (توصيل سريع بـ 5 دراهم)" },
  { id: "amira", name: "حي الاميرة", cost: 5, description: "حي الاميرة (توصيل سريع بـ 5 دراهم)" },
  { id: "ras_louta", name: "حي رأس لوطا", cost: 5, description: "حي رأس لوطا (توصيل سريع بـ 5 دراهم)" },
  { id: "kandissa", name: "حي كنديسة", cost: 5, description: "حي كنديسة (توصيل سريع بـ 5 دراهم)" },
  { id: "aghattas", name: "حي أغطاس", cost: 5, description: "حي أغطاس (توصيل سريع بـ 5 دراهم)" },
  { id: "sidi_boughaba", name: "حي سيدي بوغابة", cost: 5, description: "حي سيدي بوغابة (توصيل سريع بـ 5 دراهم)" },
  { id: "merja", name: "حي المرجة", cost: 5, description: "حي المرجة (توصيل سريع بـ 5 دراهم)" },
  { id: "ceramica", name: "حي سيراميكا", cost: 5, description: "حي سيراميكا (توصيل سريع بـ 5 دراهم)" },
  { id: "patio", name: "حي الباطيو", cost: 5, description: "حي الباطيو (توصيل سريع بـ 5 دراهم)" },
  { id: "buosito", name: "حي بوسيطو", cost: 5, description: "حي بوسيطو (توصيل سريع بـ 5 دراهم)" },
  { id: "bahr", name: "حومة د بحر", cost: 5, description: "حومة د بحر (توصيل سريع بـ 5 دراهم)" },
  { id: "wad", name: "حومة د الواد", cost: 5, description: "حومة د الواد (توصيل سريع بـ 5 دراهم)" },

  // 10 DH places
  { id: "bendiban", name: "حي بنديبان", cost: 10, description: "حي بنديبان (توصيل سريع بـ 10 دراهم)" },
  { id: "bararek", name: "حي برارك", cost: 10, description: "حي برارك (توصيل سريع بـ 10 دراهم)" },
  { id: "haydra", name: "حيضرة", cost: 10, description: "حيضرة (توصيل سريع بـ 10 دراهم)" },
  { id: "riffien", name: "ريفيين", cost: 10, description: "ريفيين (توصيل سريع بـ 10 دراهم)" },
  { id: "dawiat", name: "واد داويات", cost: 10, description: "واد داويات (توصيل سريع بـ 10 دراهم)" },
  { id: "mamzla", name: "ممزلة", cost: 10, description: "ممزلة (توصيل سريع بـ 10 دراهم)" },

  // Negotiated places
  { id: "remote", name: "الأماكن الأكثر بعداً (التفاهم حسب العنوان)", cost: 0, description: "المناطق والمدن الأكثر بعداً سيتم التواصل معك والاتفاق على تكلفة التوصيل وموقعه بالتحديد عبر الواتساب" }
];
