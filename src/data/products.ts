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
    name: "Zaza Royal",
    arabicName: "زعزع الملكي الفاخر",
    description: "مزيج غني ولذيذ من الأفوكادو الطازج، فلان الكراميل البيتي، قطع الموز، واللوز المحمص المقرمش مع لمسة تزيين فاخرة.",
    price: 25,
    image: "/src/assets/images/product_zaza_1779343709922.png",
    category: "specials",
    rating: 4.9,
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "أفوكادو طازج",
      "موز غني",
      "فلان كراميل منزلي",
      "لوز محمص مقرمش",
      "حليب كامل الدسم",
      "مكسرات وفواكه جافة للتزيين"
    ]
  },
  {
    id: 2,
    name: "عصير الأفوكادو",
    arabicName: "عصير الأفوكادو",
    description: "أفوكادو مخفوق بعناية حتى الحصول على قوام كريمي ناعم، غني بالمكسرات والعسل الطبيعي لمذاق ونشاط مثالي.",
    price: 20,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.8,
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "أفوكادو طازج",
      "حليب طري و بارد",
      "سكر"
    ]
  },
  {
    id: 3,
    name: "عصير المانجو",
    arabicName: "عصير المانجو",
    description: "عصير مانجو استوائي نقي 100% غني بالألياف والفوائد، بنكهة غنية ومنعشة ومحضرة مباشرة عند الطلب.",
    price: 25,
    image: "/src/assets/images/product_mango_1779884896870.png",
    category: "juices",
    rating: 4.8,
    isFeatured: false,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "مانجو طازج",
      "حليب أو ماء بارد",
      "سكر طبيعي"
    ]
  },
  {
    id: 4,
    name: "عصير الموز مع التفاح",
    arabicName: "عصير الموز والتفاح",
    description: "مزيج منعش من الموز الحلو والتفاح الطازج، مخفوق مع الحليب الطارد لمذاق لذيذ ومغذي يدوم طويلاً.",
    price: 18,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.7,
    isFeatured: false,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "تفاح طازج",
      "موز حلو",
      "حليب بارد",
      "عسل طبيعي"
    ]
  },
  {
    id: 5,
    name: "عصير الدراغون مع الفواكه",
    arabicName: "عصير الدراغون مع الفواكه",
    description: "عصير استوائي فاخر من فاكهة التنين (الدراغون) الوردية المنعشة، مخلوط مع فواكه الموسم الطازجة لنشاط وحيوية متكاملة.",
    price: 30,
    image: "https://images.unsplash.com/photo-1525385341052-ac48da1e505b?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.9,
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "فاكهة التنين الوردية (دراغون)",
      "فواكه الموسم المشكلة",
      "عصير برتقال طبيعي",
      "ثلج مجروش"
    ]
  },
  {
    id: 6,
    name: "عصير البناشي",
    arabicName: "عصير البناشي الفاخر",
    description: "الكوكتيل المغربي الشعبي الغني بالفواكه المتنوعة والمكسرات الفاخرة والعسل، لتجربة مذاق غنية تجمع بين الحلويات والعصائر.",
    price: 22,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.8,
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "أفوكادو وموز",
      "تفاح وإجاص",
      "مكسرات مشكلة (لوز، جوز)",
      "تمر وعسل طبيعي"
    ]
  },
  {
    id: 7,
    name: "عصير البرتقال الطبيعي",
    arabicName: "عصير البرتقال الطبيعي",
    description: "عصير برتقال طبيعي 100% معصور طازجاً عند الطلب لضمان الحصول على أقصى قدر من الفيتامينات والانتعاش.",
    price: 15,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.6,
    isFeatured: false,
    isAvailable: true,
    prepTime: "3 - 5 دقائق",
    ingredients: [
      "برتقال طازج معصور"
    ]
  },
  {
    id: 8,
    name: "Pear & Pineapple Delight",
    arabicName: "بهجة الأناناس والإجاص",
    description: "مزيج استثنائي منعش ولذيذ يجمع حموضة الأناناس الاستوائي وحلاوة الإجاص (الكمثرى)، مثالي لأيام الصيف الدافئة.",
    price: 22,
    image: "https://images.unsplash.com/photo-1543083477-4f7db1adc02e?w=600&auto=format&fit=crop&q=80",
    category: "juices",
    rating: 4.7,
    isFeatured: false,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "أناناس استوائي طازج",
      "إجاص حلو ومنقى",
      "عصير ليمون خفيف",
      "ثلج"
    ]
  },
  {
    id: 9,
    name: "Caramel Flan with Almonds",
    arabicName: "فلان الكراميل باللوز",
    description: "تحلية فريدة تجمع الفلان الكريمي المصنع يدوياً بالكراميل الذهبي الفاخر مع حبات اللوز المحمصة لمزيج رائع من القوام والذوق.",
    price: 18,
    image: "/src/assets/images/product_flan_1779343731407.png",
    category: "desserts",
    rating: 4.9,
    isFeatured: true,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "بيض طازج وحليب مكثف",
      "كراميل سائل عالي الجودة",
      "لوز محمص مقشور ومكسر"
    ]
  },
  {
    id: 10,
    name: "Venezuelan Special Flan",
    arabicName: "الفلان الفنزويلي الخاص",
    description: "الفلان الفنزويلي الأصيل المحضر على أصوله بملمسه الكريمي الغني بالكراميل المكثف، لمذاق لا ينسى من الفخامة اللاتينية.",
    price: 20,
    image: "https://images.unsplash.com/photo-1528975604071-b4daaf306d88?w=600&auto=format&fit=crop&q=80",
    category: "desserts",
    rating: 4.9,
    isFeatured: false,
    isAvailable: true,
    prepTime: "5 - 10 دقائق",
    ingredients: [
      "حليب مكثف محلى",
      "فانيليا طبيعية غنية",
      "بيض بلدي",
      "لمسة كاكاو خفيفة للتزيين"
    ]
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
