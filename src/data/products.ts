import { Product, Category, Testimonial, Coupon } from '../types';

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
    name: "عصير الأفوكادو باللوز",
    arabicName: "عصير الأفوكادو باللوز",
    description: "مزيج فاخر يجمع بين نعومة الأفوكادو وغنى اللوز المحمص، مع لمسة كريمية من الحليب الطري لمذاق استثنائي.",
    price: 25,
    image: "https://lh3.googleusercontent.com/d/1YGUuIfsYGpxzrJ6-TvlCAbVe1IS7r3z3",
    category: "juices",
    size: "400ml",
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["فاكهة أفوكادو طازجة", "لوز محمص ومقرمش", "حليب طري وبارد"]
  },
  {
    id: 2,
    name: "عصير زعزع الملكي الفاخر",
    arabicName: "عصير زعزع الملكي الفاخر",
    description: "عصير زعزع الملكي الأسطوري والغني بقطع الفواكه الطازجة، الشوكولاتة الفاخرة، والمكسرات المحمصة المقرمشة لمذاق يأخذك لعالم آخر من المتعة والتألق.",
    price: 30,
    image: "/src/assets/images/product_zaza_1779343709922.png",
    category: "juices",
    size: "400ml",
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: ["أفوكادو طازج ممتاز", "قطع فواكه موسمية", "مكسرات محمصة مقرمشة", "شوكولاتة نوتيلا وكيت كات غنية", "كريمة مخفوقة حلواني"]
  },
  {
    id: 3,
    name: "تحلية فلان كراميل باللوز",
    arabicName: "تحلية فلان كراميل باللوز",
    description: "تحلية فلان الكراميل المنزلية الأصيلة بقوامها الحريري الرائع ومذاق الكراميل الغني الممتاز، مزينة بقطع اللوز المحمص المقرمش لتقديم تجربة تليق بضيافتكم.",
    price: 20,
    image: "/src/assets/images/product_flan_1779343731407.png",
    category: "desserts",
    size: "حجم وسط عائلي",
    isFeatured: true,
    isAvailable: true,
    prepTime: "10 - 15 دقيقة",
    ingredients: ["حليب طبيعي طازج", "بيض طري طازج", "لوز بلدي محمص مقرمش", "كراميل مكثف معد منزلياً بلمسة حب"]
  },
  {
    id: 4,
    name: "عصير المانجو الطبيعي الممتاز",
    arabicName: "عصير المانجو الطبيعي الممتاز",
    description: "عصير مانجو استوائي طبيعي 100% منعش للغاية وغني بالفيتامينات وطعم المانجو الطبيعي الخالص بنعومة فائقة، خال تماماً من المواد الحافظة.",
    price: 22,
    image: "/src/assets/images/product_mango_uploaded_1779885224824.png",
    category: "juices",
    size: "400ml",
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 دقائق",
    ingredients: ["مانجو استوائي طازج حبة حبة", "ثلج مجروش منعش", "عصير مانجو مركز طبيعي"]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "يوسف الشلاف",
    city: "تطوان",
    rating: 5,
    comment: "أفخم محل عصائر في تطوان! عصير زعزع الملكي تجربة خيالية وطعم رائع جداً، والمكونات طازجة والمكسرات مقرمشة ولذيذة للغاية. أنصح به بشدة لكل من يحب الانتعاش والجودة الرفيعة.",
    date: "2026-06-01"
  },
  {
    id: 2,
    name: "سارة التطواني",
    city: "مرتيل",
    rating: 5,
    comment: "فلان الكراميل باللوز تحفة فنية حقيقية! القوام كريمي ناعم جداً ومذاق الكراميل ممتاز ومتوازن مع قرمشة اللوز الغنية. بالإضافة للتوصيل السريع والمعاملة الراقية.",
    date: "2026-06-03"
  },
  {
    id: 3,
    name: "محمد العروي",
    city: "تطوان",
    rating: 5,
    comment: "عصائر طبيعية منعشة ولذيذة عند الطلب، عصير الأفوكادو خفيف وصحي ومغذي والمانجو منعش للغاية. خدمة التوصيل متقنة وسريعة جداً ووصول دافئ ومنظم.",
    date: "2026-06-05"
  }
];

export const DELIVERY_ZONES = [
  {
    id: 'centre',
    name: 'تطوان وسط المدينة / Tetouan Centre',
    cost: 0,
    description: 'توصيل مجاني تماماً لوسط المدينة والمناطق المحيطة بها في غضون 15-30 دقيقة.'
  },
  {
    id: 'nearby',
    name: 'أحياء تطوان القريبة / Tetouan Nearby',
    cost: 5,
    description: 'توصيل سريع للأحياء السكنية القريبة بـ 5 دراهم فقط خلال 30-45 دقيقة.'
  },
  {
    id: 'far',
    name: 'أحياء تطوان البعيدة / Tetouan Suburbs',
    cost: 10,
    description: 'توصيل خلال ساعة للأحياء البعيدة بـ 10 دراهم للمحافظة على العصائر باردة ومنعشة.'
  },
  {
    id: 'remote',
    name: 'المناطق المجاورة (مرتيل والمضيق) / Martil & M\'diq',
    cost: 15,
    description: 'توصيل خاص للمناطق الساحلية المجاورة (مرتيل والمضيق) بـ 15 درهم لضمان أقصى حماية وجودة للعصير.'
  }
];

export const APP_COUPONS: Coupon[] = [
  {
    code: 'RAMADAN20',
    discountPercent: 20,
    active: true,
  },
  {
    code: 'DOUAA10',
    discountPercent: 10,
    active: true,
  },
  {
    code: 'BASMA15',
    discountPercent: 15,
    active: true,
  },
];
