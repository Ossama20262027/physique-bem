import { Exercise, QuizQuestion, VideoItem, Badge } from '../types';

export const INITIAL_VIDEOS: VideoItem[] = [
  // ==========================================
  // 1. الظواهر الكهربائية (PHÉNOMÈNES ÉLECTRIQUES)
  // ==========================================

  // elec-1-1: التكهرب وطرق التكهرب
  {
    id: 'v-elec-1-1-1',
    lessonId: 'elec-1-1',
    title: 'شرح درس التكهرب والشحنة الكهربائية بالتفصيل للسنة الرابعة متوسط',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: '2BVDN3TgAmE',
    duration: '18:24',
    thumbnail: 'https://img.youtube.com/vi/2BVDN3TgAmE/hqdefault.jpg',
    views: '85K مشاهدة',
    publishedAt: '2024-10-12'
  },
  {
    id: 'v-elec-1-1-2',
    lessonId: 'elec-1-1',
    title: 'الشحنة الكهربائية والنموذج المبسط للذرة (الدرس 1) للسنة الرابعة متوسط',
    channelTitle: 'الأستاذ زكرياء مومني',
    isTeacherChannel: false,
    videoId: 'bxhrPYKQiJI',
    duration: '14:50',
    thumbnail: 'https://img.youtube.com/vi/bxhrPYKQiJI/hqdefault.jpg',
    views: '42K مشاهدة',
    publishedAt: '2024-11-05'
  },
  {
    id: 'v-elec-1-1-3',
    lessonId: 'elec-1-1',
    title: 'الدرس01: التكهرب بالدلك و التكهرب باللمس + تجارب توضيحية',
    channelTitle: 'نوافذ التعليمية - NAWAFID',
    isTeacherChannel: false,
    videoId: 'zSHGuU3anF0',
    duration: '16:15',
    thumbnail: 'https://img.youtube.com/vi/zSHGuU3anF0/hqdefault.jpg',
    views: '38K مشاهدة',
    publishedAt: '2024-10-18'
  },
  {
    id: 'v-elec-1-1-4',
    lessonId: 'elec-1-1',
    title: 'المراجعة الشاملة في الفيزياء سنة رابعة متوسط تحضيرا bem blanc',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'ecXwyLwAyj4',
    duration: '32:10',
    thumbnail: 'https://img.youtube.com/vi/ecXwyLwAyj4/hqdefault.jpg',
    views: '140K مشاهدة',
    publishedAt: '2025-01-05'
  },

  // elec-1-2: الفعلان المتبادلان بين جسمين مشحونين
  {
    id: 'v-elec-1-2-1',
    lessonId: 'elec-1-2',
    title: '02 - درس الفعلين المتبادلين 🤛 BEM 🤜',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'scv07SaUvY8',
    duration: '21:04',
    thumbnail: 'https://img.youtube.com/vi/scv07SaUvY8/hqdefault.jpg',
    views: '76K مشاهدة',
    publishedAt: '2024-10-20'
  },
  {
    id: 'v-elec-1-2-2',
    lessonId: 'elec-1-2',
    title: 'الدرس02: التكهرب بالتأثير والكاشف الكهربائي للسنة الرابعة متوسط',
    channelTitle: 'نوافذ التعليمية - NAWAFID',
    isTeacherChannel: false,
    videoId: 'KzlgiDrmbD8',
    duration: '15:42',
    thumbnail: 'https://img.youtube.com/vi/KzlgiDrmbD8/hqdefault.jpg',
    views: '51K مشاهدة',
    publishedAt: '2024-10-25'
  },

  // elec-2-1: نموذج الذرة
  {
    id: 'v-elec-2-1-1',
    lessonId: 'elec-2-1',
    title: 'الدرس الأول سنة رابعة متوسط النموذج المبسط للذرة والشحنة الكهربائية',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'wqLmqevT2Ds',
    duration: '23:10',
    thumbnail: 'https://img.youtube.com/vi/wqLmqevT2Ds/hqdefault.jpg',
    views: '92K مشاهدة',
    publishedAt: '2024-10-15'
  },
  {
    id: 'v-elec-2-1-2',
    lessonId: 'elec-2-1',
    title: 'الذرة و التكهرب (النموذج الكوكبي للذرة والشحنة الكهربائية) BEM',
    channelTitle: 'الأستاذ مهيدي للرياضيات و الفيزياء',
    isTeacherChannel: false,
    videoId: 's-ht3vAxG-I',
    duration: '19:45',
    thumbnail: 'https://img.youtube.com/vi/s-ht3vAxG-I/hqdefault.jpg',
    views: '35K مشاهدة',
    publishedAt: '2024-10-28'
  },

  // elec-2-2: تفسير ظاهرة التكهرب
  {
    id: 'v-elec-2-2-1',
    lessonId: 'elec-2-2',
    title: 'تعلّم التفسير خطوة بخطوة لظاهرة التكهرب فيزياء الرابعة متوسط BEM 2026',
    channelTitle: 'prof ihab I الأستاذ إيهاب',
    isTeacherChannel: false,
    videoId: 'dp9tL47DSRM',
    duration: '17:30',
    thumbnail: 'https://img.youtube.com/vi/dp9tL47DSRM/hqdefault.jpg',
    views: '64K مشاهدة',
    publishedAt: '2024-11-02'
  },
  {
    id: 'v-elec-2-2-2',
    lessonId: 'elec-2-2',
    title: 'كل دروس التكهرب 🔥 [ BEM 2026 ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'vlvtequACKo',
    duration: '28:15',
    thumbnail: 'https://img.youtube.com/vi/vlvtequACKo/hqdefault.jpg',
    views: '120K مشاهدة',
    publishedAt: '2024-11-10'
  },

  // elec-2-3: النواقل والعوازل
  {
    id: 'v-elec-2-3-1',
    lessonId: 'elec-2-3',
    title: '05 - النواقل والعوازل ⛔️ [ BEM ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'o_rVF6Bv_vc',
    duration: '16:50',
    thumbnail: 'https://img.youtube.com/vi/o_rVF6Bv_vc/hqdefault.jpg',
    views: '58K مشاهدة',
    publishedAt: '2024-11-15'
  },
  {
    id: 'v-elec-2-3-2',
    lessonId: 'elec-2-3',
    title: 'النواقل والعوازل (الظواهر الكهربائية) للسنة الرابعة متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'ekW7uBPyhWA',
    duration: '14:20',
    thumbnail: 'https://img.youtube.com/vi/ekW7uBPyhWA/hqdefault.jpg',
    views: '44K مشاهدة',
    publishedAt: '2024-11-18'
  },

  // elec-3-1: إنتاج تيار كهربائي متناوب
  {
    id: 'v-elec-3-1-1',
    lessonId: 'elec-3-1',
    title: 'كل دروس التيار الكهربائي المتناوب والتحريض ⚡️ [ BEM ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'yWbXGU9Wp_w',
    duration: '31:40',
    thumbnail: 'https://img.youtube.com/vi/yWbXGU9Wp_w/hqdefault.jpg',
    views: '135K مشاهدة',
    publishedAt: '2024-11-20'
  },
  {
    id: 'v-elec-3-1-2',
    lessonId: 'elec-3-1',
    title: 'شرح درس التيار الكهربائي المتناوب مع كل القوانين | BEM',
    channelTitle: 'الأستاذ ريان',
    isTeacherChannel: false,
    videoId: 'cPz98USIzKk',
    duration: '18:55',
    thumbnail: 'https://img.youtube.com/vi/cPz98USIzKk/hqdefault.jpg',
    views: '49K مشاهدة',
    publishedAt: '2024-11-24'
  },

  // elec-3-2: معاينة التوتر الكهربائي
  {
    id: 'v-elec-3-2-1',
    lessonId: 'elec-3-2',
    title: 'معاينة التوتر الكهربائي براسم الاهتزاز المهبطي + التحريض الكهرومغناطيسي',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'pjomUhbsZ1M',
    duration: '22:15',
    thumbnail: 'https://img.youtube.com/vi/pjomUhbsZ1M/hqdefault.jpg',
    views: '67K مشاهدة',
    publishedAt: '2024-11-28'
  },
  {
    id: 'v-elec-3-2-2',
    lessonId: 'elec-3-2',
    title: 'معاينة التوتر الكهربائي براسم الاهتزاز المهبطي للسنة الرابعة متوسط',
    channelTitle: 'الأستاذ دخيسي عادل للفيزياء',
    isTeacherChannel: false,
    videoId: 'OgfYhTaNaCs',
    duration: '19:30',
    thumbnail: 'https://img.youtube.com/vi/OgfYhTaNaCs/hqdefault.jpg',
    views: '33K مشاهدة',
    publishedAt: '2024-12-02'
  },

  // elec-3-3: خصائص التوتر الكهربائي المتناوب
  {
    id: 'v-elec-3-3-1',
    lessonId: 'elec-3-3',
    title: 'التيار المتناوب :حساب التوتر الأعظمي ,التوتر الفعال ,الدور والتردد للسنة الرابعة متوسط',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'PNRSSbaf-2k',
    duration: '22:15',
    thumbnail: 'https://img.youtube.com/vi/PNRSSbaf-2k/hqdefault.jpg',
    views: '98K مشاهدة',
    publishedAt: '2024-11-18'
  },
  {
    id: 'v-elec-3-3-2',
    lessonId: 'elec-3-3',
    title: 'المراجعة النهائية في الفيزياء للسنة 4 متوسط/ التيار المتناوب /تمارين محلولة',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: '5gJ8c8rtsMw',
    duration: '20:30',
    thumbnail: 'https://img.youtube.com/vi/5gJ8c8rtsMw/hqdefault.jpg',
    views: '115K مشاهدة',
    publishedAt: '2024-12-05'
  },
  {
    id: 'v-elec-3-3-3',
    lessonId: 'elec-3-3',
    title: 'كل قوانين وحسابات التيار المتناوب Umax و Ueff و الدور والتواتر',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'yWbXGU9Wp_w',
    duration: '25:10',
    thumbnail: 'https://img.youtube.com/vi/yWbXGU9Wp_w/hqdefault.jpg',
    views: '105K مشاهدة',
    publishedAt: '2024-12-10'
  },

  // elec-4-1: مأخذ التوتر الكهربائي
  {
    id: 'v-elec-4-1-1',
    lessonId: 'elec-4-1',
    title: '01 - مأخذ التوتر الكهربائي والطور والحيادي والأرضي 🔌 [ BEM ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'frg0vIGJzZA',
    duration: '15:20',
    thumbnail: 'https://img.youtube.com/vi/frg0vIGJzZA/hqdefault.jpg',
    views: '70K مشاهدة',
    publishedAt: '2024-12-12'
  },
  {
    id: 'v-elec-4-1-2',
    lessonId: 'elec-4-1',
    title: 'الأمن الكهربائي - مأخذ التوتر الكهربائي للسنة الرابعة متوسط',
    channelTitle: 'الأستاذ دخيسي عادل للفيزياء',
    isTeacherChannel: false,
    videoId: '8WS2wMb2K_A',
    duration: '16:40',
    thumbnail: 'https://img.youtube.com/vi/8WS2wMb2K_A/hqdefault.jpg',
    views: '39K مشاهدة',
    publishedAt: '2024-12-15'
  },

  // elec-4-2: حماية الدارة والأشخاص
  {
    id: 'v-elec-4-2-1',
    lessonId: 'elec-4-2',
    title: 'حل وضعية إدماجية للأمن الكهربائي الرابعة متوسط فيزياء مراجعة للإختبار والشهادة',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'ZOJrHAtTjtA',
    duration: '25:40',
    thumbnail: 'https://img.youtube.com/vi/ZOJrHAtTjtA/hqdefault.jpg',
    views: '102K مشاهدة',
    publishedAt: '2024-12-01'
  },
  {
    id: 'v-elec-4-2-2',
    lessonId: 'elec-4-2',
    title: 'حماية الدارة الكهربائية و الأشخاص - رابعة متوسط',
    channelTitle: 'الأستاذ دخيسي عادل للفيزياء',
    isTeacherChannel: false,
    videoId: 'EhWnaTbKMbE',
    duration: '18:10',
    thumbnail: 'https://img.youtube.com/vi/EhWnaTbKMbE/hqdefault.jpg',
    views: '41K مشاهدة',
    publishedAt: '2024-12-08'
  },

  // elec-4-3: قواعد الأمن الكهربائي
  {
    id: 'v-elec-4-3-1',
    lessonId: 'elec-4-3',
    title: '02 - الأمن الكهربائي 🔴 شرح كامل وقواعد الحماية 🔥',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'vDowbJe1kP0',
    duration: '27:14',
    thumbnail: 'https://img.youtube.com/vi/vDowbJe1kP0/hqdefault.jpg',
    views: '145K مشاهدة',
    publishedAt: '2024-12-20'
  },
  {
    id: 'v-elec-4-3-2',
    lessonId: 'elec-4-3',
    title: 'الأمن الكهربائي السنة الرابعة متوسط بشرح مبسط جدا للشهادة',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: '8v-FyFf6gEA',
    duration: '21:30',
    thumbnail: 'https://img.youtube.com/vi/8v-FyFf6gEA/hqdefault.jpg',
    views: '88K مشاهدة',
    publishedAt: '2024-12-25'
  },

  // ==========================================
  // 2. المادة وتحولاتها (LA MATIÈRE ET SES TRANSFORMATIONS)
  // ==========================================

  // mat-1-1: الشاردة والمحلول الشاردي (1)
  {
    id: 'v-mat-1-1-1',
    lessonId: 'mat-1-1',
    title: '01- الشاردة و المحلول الشاردي [يا تفهم يا تفهم 🫡]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'BQBRYnREqbU',
    duration: '19:10',
    thumbnail: 'https://img.youtube.com/vi/BQBRYnREqbU/hqdefault.jpg',
    views: '64K مشاهدة',
    publishedAt: '2025-01-10'
  },
  {
    id: 'v-mat-1-1-2',
    lessonId: 'mat-1-1',
    title: 'الشاردة و المحلول الشاردي للسنة الرابعة متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'BrawqmNGVfU',
    duration: '24:45',
    thumbnail: 'https://img.youtube.com/vi/BrawqmNGVfU/hqdefault.jpg',
    views: '75K مشاهدة',
    publishedAt: '2025-01-14'
  },

  // mat-1-2: الشاردة والمحلول الشاردي (2)
  {
    id: 'v-mat-1-2-1',
    lessonId: 'mat-1-2',
    title: 'الدرس 14 : الشاردة و المحلول الشاردي (الجزء الثاني)',
    channelTitle: 'نوافذ التعليمية - NAWAFID',
    isTeacherChannel: false,
    videoId: 'kroRGJ1gfJU',
    duration: '18:15',
    thumbnail: 'https://img.youtube.com/vi/kroRGJ1gfJU/hqdefault.jpg',
    views: '43K مشاهدة',
    publishedAt: '2025-01-18'
  },
  {
    id: 'v-mat-1-2-2',
    lessonId: 'mat-1-2',
    title: 'الصيغة الإحصائية والصيغة الشاردية للمركبات الكيميائية 4 متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'BrawqmNGVfU',
    duration: '20:10',
    thumbnail: 'https://img.youtube.com/vi/BrawqmNGVfU/hqdefault.jpg',
    views: '61K مشاهدة',
    publishedAt: '2025-01-20'
  },

  // mat-2-1: النقل الكهربائي في المحاليل
  {
    id: 'v-mat-2-1-1',
    lessonId: 'mat-2-1',
    title: 'الشاردة والمحلول الشاردي (النقل الكهربائي في المحاليل المائية)',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'Iv8BjGnKosA',
    duration: '21:05',
    thumbnail: 'https://img.youtube.com/vi/Iv8BjGnKosA/hqdefault.jpg',
    views: '52K مشاهدة',
    publishedAt: '2025-01-22'
  },
  {
    id: 'v-mat-2-1-2',
    lessonId: 'mat-2-1',
    title: 'حركة الشوارد والهجرة الكهربائية نحو المسريين في المحاليل',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'BQBRYnREqbU',
    duration: '22:40',
    thumbnail: 'https://img.youtube.com/vi/BQBRYnREqbU/hqdefault.jpg',
    views: '80K مشاهدة',
    publishedAt: '2025-01-24'
  },

  // mat-2-2: التحليل الكهربائي البسيط لمحلول كلور الزنك
  {
    id: 'v-mat-2-2-1',
    lessonId: 'mat-2-2',
    title: '03- التحليل الكهربائي البسيط لكلور الزنك [ أقوى شرح ستصادفه 🔥 ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: '3Zo6WZnPX4o',
    duration: '26:30',
    thumbnail: 'https://img.youtube.com/vi/3Zo6WZnPX4o/hqdefault.jpg',
    views: '112K مشاهدة',
    publishedAt: '2025-01-26'
  },
  {
    id: 'v-mat-2-2-2',
    lessonId: 'mat-2-2',
    title: 'التحليل الكهربائي البسيط وتفسير المهبط والمصعد 4 متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: '9fl9LWX589w',
    duration: '23:15',
    thumbnail: 'https://img.youtube.com/vi/9fl9LWX589w/hqdefault.jpg',
    views: '73K مشاهدة',
    publishedAt: '2025-01-30'
  },

  // mat-3-1: التحولات الكيميائية في المحاليل الشاردية (1) - حمض مع معدن
  {
    id: 'v-mat-3-1-1',
    lessonId: 'mat-3-1',
    title: '04 - تفاعل محلول حمضي مع معدن [ تفهم باذن الله ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'isVYVkKXzIA',
    duration: '24:18',
    thumbnail: 'https://img.youtube.com/vi/isVYVkKXzIA/hqdefault.jpg',
    views: '95K مشاهدة',
    publishedAt: '2025-02-02'
  },
  {
    id: 'v-mat-3-1-2',
    lessonId: 'mat-3-1',
    title: 'ملخص التفاعلات الكيميائية في المحاليل الشاردية للرابعة متوسط',
    channelTitle: 'الأستاذ دقيش إبراهيم للفيزياء',
    isTeacherChannel: false,
    videoId: 'YVUqgbcssJ8',
    duration: '24:18',
    thumbnail: 'https://img.youtube.com/vi/YVUqgbcssJ8/hqdefault.jpg',
    views: '71K مشاهدة',
    publishedAt: '2025-02-04'
  },
  {
    id: 'v-mat-3-1-3',
    lessonId: 'mat-3-1',
    title: 'تجربة مع الشرح لتفاعل حمض كلور الماء مع مسحوق الزنك ومعادلات التفاعل',
    channelTitle: 'الأستاذ بوكرون كريم للعلوم الفيزيائية',
    isTeacherChannel: false,
    videoId: 'OSt5QkfEHXU',
    duration: '15:40',
    thumbnail: 'https://img.youtube.com/vi/OSt5QkfEHXU/hqdefault.jpg',
    views: '46K مشاهدة',
    publishedAt: '2025-02-06'
  },

  // mat-3-2: التحولات الكيميائية في المحاليل الشاردية (2) - ملح مع معدن
  {
    id: 'v-mat-3-2-1',
    lessonId: 'mat-3-2',
    title: '05 - تفاعل محلول ملحي مع معدن [ شرح الدرس كاملا ✨️]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'obd7bkNojGo',
    duration: '22:15',
    thumbnail: 'https://img.youtube.com/vi/obd7bkNojGo/hqdefault.jpg',
    views: '84K مشاهدة',
    publishedAt: '2025-02-08'
  },
  {
    id: 'v-mat-3-2-2',
    lessonId: 'mat-3-2',
    title: 'تفاعل محلول ملحي مع معدن للسنة الرابعة متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'dST_xcXT2oo',
    duration: '20:30',
    thumbnail: 'https://img.youtube.com/vi/dST_xcXT2oo/hqdefault.jpg',
    views: '59K مشاهدة',
    publishedAt: '2025-02-10'
  },

  // mat-3-3: التحولات الكيميائية في المحاليل الشاردية (3) - حمض مع كربونات الكالسيوم
  {
    id: 'v-mat-3-3-1',
    lessonId: 'mat-3-3',
    title: '06 - تفاعل محلول حمضي مع ملح كربونات الكالسيوم CaCO3 [ تخرج فاهم ✅️ ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'U9k16Oa4egM',
    duration: '23:45',
    thumbnail: 'https://img.youtube.com/vi/U9k16Oa4egM/hqdefault.jpg',
    views: '88K مشاهدة',
    publishedAt: '2025-02-12'
  },
  {
    id: 'v-mat-3-3-2',
    lessonId: 'mat-3-3',
    title: 'تفاعل حمض كلور الماء مع كربونات الكالسيوم والكشف عن الغاز',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'ev0jgR2HP-M',
    duration: '18:50',
    thumbnail: 'https://img.youtube.com/vi/ev0jgR2HP-M/hqdefault.jpg',
    views: '65K مشاهدة',
    publishedAt: '2025-02-14'
  },

  // ==========================================
  // 3. الظواهر الميكانيكية (PHÉNOMÈNES MÉCANIQUES)
  // ==========================================

  // mech-1-1: مفهوم الجملة الميكانيكية
  {
    id: 'v-mech-1-1-1',
    lessonId: 'mech-1-1',
    title: 'الظواهر الميكانيكية للسنة الرابعة متوسط : مفهوم الجملة الميكانيكية',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'fUd_j5mqALQ',
    duration: '17:15',
    thumbnail: 'https://img.youtube.com/vi/fUd_j5mqALQ/hqdefault.jpg',
    views: '73K مشاهدة',
    publishedAt: '2025-02-16'
  },
  {
    id: 'v-mech-1-1-2',
    lessonId: 'mech-1-1',
    title: '01 - الدّرس الأول في الميكانيك : المقاربة الاولية للقوة ⬆️',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'ECUA1uh7oHs',
    duration: '21:30',
    thumbnail: 'https://img.youtube.com/vi/ECUA1uh7oHs/hqdefault.jpg',
    views: '94K مشاهدة',
    publishedAt: '2025-02-18'
  },

  // mech-1-2: القوة ونمذجتها بشعاع
  {
    id: 'v-mech-1-2-1',
    lessonId: 'mech-1-2',
    title: 'الظواهر الميكانيكية للسنة الرابعة متوسط : القوة ونمذجتها بشعاع',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: '8SdB5OJb9RA',
    duration: '19:40',
    thumbnail: 'https://img.youtube.com/vi/8SdB5OJb9RA/hqdefault.jpg',
    views: '68K مشاهدة',
    publishedAt: '2025-02-20'
  },
  {
    id: 'v-mech-1-2-2',
    lessonId: 'mech-1-2',
    title: 'الدرس 20 : مخطط الأجسام المتأثرة - شعاع القوة | الظواهر الميكانيكية',
    channelTitle: 'نوافذ التعليمية - NAWAFID',
    isTeacherChannel: false,
    videoId: 'cOrk7OREvl0',
    duration: '18:10',
    thumbnail: 'https://img.youtube.com/vi/cOrk7OREvl0/hqdefault.jpg',
    views: '45K مشاهدة',
    publishedAt: '2025-02-22'
  },

  // mech-1-3: الفعلان المتبادلان للقوى
  {
    id: 'v-mech-1-3-1',
    lessonId: 'mech-1-3',
    title: '02 - درس الفعلين المتبادلين 🤛 BEM 🤜',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'scv07SaUvY8',
    duration: '21:04',
    thumbnail: 'https://img.youtube.com/vi/scv07SaUvY8/hqdefault.jpg',
    views: '76K مشاهدة',
    publishedAt: '2025-02-24'
  },
  {
    id: 'v-mech-1-3-2',
    lessonId: 'mech-1-3',
    title: 'مبدأ الفعلين المتبادلين (الظواهر الميكانيكية) للسنة الرابعة متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'aX8J8DgvzBk',
    duration: '16:50',
    thumbnail: 'https://img.youtube.com/vi/aX8J8DgvzBk/hqdefault.jpg',
    views: '53K مشاهدة',
    publishedAt: '2025-02-26'
  },

  // mech-2-1: خصائص الثقل
  {
    id: 'v-mech-2-1-1',
    lessonId: 'mech-2-1',
    title: 'فعل الأرض على جملة ميكانيكية(الثقل) الدرس الرابع من الظواهر الميكانيكية',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'KHkod_RIONk',
    duration: '17:35',
    thumbnail: 'https://img.youtube.com/vi/KHkod_RIONk/hqdefault.jpg',
    views: '89K مشاهدة',
    publishedAt: '2025-02-15'
  },
  {
    id: 'v-mech-2-1-2',
    lessonId: 'mech-2-1',
    title: 'خصائص فعل الأرض على الجملة الميكانيكية | تمثيل الثقل بشعاع',
    channelTitle: 'الأستاذ لخضر سيف الله',
    isTeacherChannel: false,
    videoId: '3WCHXs7fNJo',
    duration: '15:20',
    thumbnail: 'https://img.youtube.com/vi/3WCHXs7fNJo/hqdefault.jpg',
    views: '37K مشاهدة',
    publishedAt: '2025-02-28'
  },

  // mech-2-2: حساب الثقل
  {
    id: 'v-mech-2-2-1',
    lessonId: 'mech-2-2',
    title: 'حساب الثقل وتطبيقات العلاقة P = m x g مع التحويلات والتمارين',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'KHkod_RIONk',
    duration: '17:35',
    thumbnail: 'https://img.youtube.com/vi/KHkod_RIONk/hqdefault.jpg',
    views: '89K مشاهدة',
    publishedAt: '2025-02-15'
  },
  {
    id: 'v-mech-2-2-2',
    lessonId: 'mech-2-2',
    title: 'المراجعة الشاملة في الفيزياء وتطبيقات الثقل ودافعة أرخميدس',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'ecXwyLwAyj4',
    duration: '32:10',
    thumbnail: 'https://img.youtube.com/vi/ecXwyLwAyj4/hqdefault.jpg',
    views: '140K مشاهدة',
    publishedAt: '2025-03-01'
  },

  // mech-3-1: توازن جسم صلب خاضع لفعل قوتين
  {
    id: 'v-mech-3-1-1',
    lessonId: 'mech-3-1',
    title: '04 - توازن جسم صلب خاضع لقوتين ➡️ BEM ⬅️',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'YbEwPZh6fz8',
    duration: '24:10',
    thumbnail: 'https://img.youtube.com/vi/YbEwPZh6fz8/hqdefault.jpg',
    views: '91K مشاهدة',
    publishedAt: '2025-03-03'
  },
  {
    id: 'v-mech-3-1-2',
    lessonId: 'mech-3-1',
    title: 'توازن جسم صلب خاضع لقوتين للسنة الرابعة متوسط bem',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'tZNHH0VVOjw',
    duration: '18:25',
    thumbnail: 'https://img.youtube.com/vi/tZNHH0VVOjw/hqdefault.jpg',
    views: '62K مشاهدة',
    publishedAt: '2025-03-05'
  },

  // mech-3-2: توازن جسم صلب خاضع لفعل ثلاث قوى غير متوازية
  {
    id: 'v-mech-3-2-1',
    lessonId: 'mech-3-2',
    title: '05 - توازن جسم خاضع لثلاث قوى 🔑 مع حل تمرين [ شرح كامل 🫵 ]',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'vW6kVgSliSI',
    duration: '27:40',
    thumbnail: 'https://img.youtube.com/vi/vW6kVgSliSI/hqdefault.jpg',
    views: '83K مشاهدة',
    publishedAt: '2025-03-07'
  },
  {
    id: 'v-mech-3-2-2',
    lessonId: 'mech-3-2',
    title: 'توازن جسم صلب خاضع لثلاث قوى غير متوازية للسنة الرابعة متوسط',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'tegMGGszRgk',
    duration: '22:15',
    thumbnail: 'https://img.youtube.com/vi/tegMGGszRgk/hqdefault.jpg',
    views: '57K مشاهدة',
    publishedAt: '2025-03-09'
  },

  // mech-4-1: قياس شدة دافعة أرخميدس
  {
    id: 'v-mech-4-1-1',
    lessonId: 'mech-4-1',
    title: '08 - دافعة أرخميدس 🌊 [ BEM ] وحساب الثقل الحقيقي والظاهري',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'SsnczWPgvo8',
    duration: '26:12',
    thumbnail: 'https://img.youtube.com/vi/SsnczWPgvo8/hqdefault.jpg',
    views: '110K مشاهدة',
    publishedAt: '2025-03-10'
  },
  {
    id: 'v-mech-4-1-2',
    lessonId: 'mech-4-1',
    title: 'تمرين مقترح بقوة دافعة ارخميدس للفصل الثالث في مادة الفيزياء -4 متوسط',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'WAYApQwrQT0',
    duration: '19:40',
    thumbnail: 'https://img.youtube.com/vi/WAYApQwrQT0/hqdefault.jpg',
    views: '78K مشاهدة',
    publishedAt: '2025-03-12'
  },
  {
    id: 'v-mech-4-1-3',
    lessonId: 'mech-4-1',
    title: 'الحصة رقم 1 دافعة ارخميدس #السنة4متوسط التحضير لشهادة BEM',
    channelTitle: 'الاستاذ ربحي إدريس',
    isTeacherChannel: false,
    videoId: 'GOGzXdi5riw',
    duration: '20:15',
    thumbnail: 'https://img.youtube.com/vi/GOGzXdi5riw/hqdefault.jpg',
    views: '45K مشاهدة',
    publishedAt: '2025-03-14'
  },

  // mech-4-2: شرط توازن جسم مغمور في سائل
  {
    id: 'v-mech-4-2-1',
    lessonId: 'mech-4-2',
    title: '10 - شرط توازن جسم في سائل 💧 [ BEM ] (الطفو والغوص والعلوق)',
    channelTitle: 'الأستاذ زوطاط يونس',
    isTeacherChannel: false,
    videoId: 'GIYDkJSNrUM',
    duration: '25:30',
    thumbnail: 'https://img.youtube.com/vi/GIYDkJSNrUM/hqdefault.jpg',
    views: '86K مشاهدة',
    publishedAt: '2025-03-16'
  },
  {
    id: 'v-mech-4-2-2',
    lessonId: 'mech-4-2',
    title: 'شرح درس دافعة أرخميذس كاملا مع شرط توازن جسم صلب في سائل | BEM',
    channelTitle: 'الأستاذ ريان',
    isTeacherChannel: false,
    videoId: 'hMaemsBplYo',
    duration: '21:10',
    thumbnail: 'https://img.youtube.com/vi/hMaemsBplYo/hqdefault.jpg',
    views: '54K مشاهدة',
    publishedAt: '2025-03-18'
  },

  // ==========================================
  // 4. الظواهر الضوئية (PHÉNOMÈNES OPTIQUES)
  // ==========================================

  // opt-1-1: اختلاف أبعاد منظر الشيء حسب زوايا النظر
  {
    id: 'v-opt-1-1-1',
    lessonId: 'opt-1-1',
    title: 'حل تمارين فيزياء الرابعة متوسط طريقة التصويب .إيجاد إرتفاع شجرة.حساب زاوية النظر',
    channelTitle: 'دروسي على النت',
    isTeacherChannel: true,
    videoId: 'YzaDOjEhl1E',
    duration: '16:45',
    thumbnail: 'https://img.youtube.com/vi/YzaDOjEhl1E/hqdefault.jpg',
    views: '58K مشاهدة',
    publishedAt: '2025-03-22'
  },
  {
    id: 'v-opt-1-1-2',
    lessonId: 'opt-1-1',
    title: 'الظواهر الضوئية للسنة الرابعة متوسط في أقوى ملخص الجزء الاول bm',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'XhReJ4eh9v4',
    duration: '18:50',
    thumbnail: 'https://img.youtube.com/vi/XhReJ4eh9v4/hqdefault.jpg',
    views: '65K مشاهدة',
    publishedAt: '2025-03-25'
  },

  // opt-2-1: صورة جسم معطاة بمرآة مستوية
  {
    id: 'v-opt-2-1-1',
    lessonId: 'opt-2-1',
    title: 'صورة جسم معطاة بمرآة مستوية + مجال المرآة المستوية فيزياء 4 متوسط',
    channelTitle: 'رحمة نور اليقين للفيزياء و الرياضيات',
    isTeacherChannel: false,
    videoId: 'aU02pF6vZP4',
    duration: '19:20',
    thumbnail: 'https://img.youtube.com/vi/aU02pF6vZP4/hqdefault.jpg',
    views: '47K مشاهدة',
    publishedAt: '2025-03-27'
  },
  {
    id: 'v-opt-2-1-2',
    lessonId: 'opt-2-1',
    title: 'صورة جسم معطاة بمرآة مستوية و قانونا الانعكاس - الظواهر الضوئية رابعة متوسط',
    channelTitle: 'الأستاذة مبرك فيزياء',
    isTeacherChannel: false,
    videoId: 'IxN3PYqIZH4',
    duration: '16:10',
    thumbnail: 'https://img.youtube.com/vi/IxN3PYqIZH4/hqdefault.jpg',
    views: '32K مشاهدة',
    publishedAt: '2025-03-29'
  },

  // opt-2-2: قانون الانعكاس
  {
    id: 'v-opt-2-2-1',
    lessonId: 'opt-2-2',
    title: 'قانونا الإنعكاس : فيزياء الرابعة متوسط ( بيام BEM )',
    channelTitle: 'dorouscom',
    isTeacherChannel: false,
    videoId: 'hpbryYWG4d4',
    duration: '15:30',
    thumbnail: 'https://img.youtube.com/vi/hpbryYWG4d4/hqdefault.jpg',
    views: '38K مشاهدة',
    publishedAt: '2025-04-02'
  },
  {
    id: 'v-opt-2-2-2',
    lessonId: 'opt-2-2',
    title: 'قانونا الانعكاس ورسم الأشعة الضوئية والزوايا في المرآة المستوية',
    channelTitle: 'الاستاذ حمياني للفيزياء',
    isTeacherChannel: false,
    videoId: 'XhReJ4eh9v4',
    duration: '18:50',
    thumbnail: 'https://img.youtube.com/vi/XhReJ4eh9v4/hqdefault.jpg',
    views: '65K مشاهدة',
    publishedAt: '2025-04-05'
  },

  // opt-2-3: مجال المرآة المستوية
  {
    id: 'v-opt-2-3-1',
    lessonId: 'opt-2-3',
    title: 'مجال المرآة المستوية : فيزياء الرابعة متوسط ( بيام BEM )',
    channelTitle: 'dorouscom',
    isTeacherChannel: false,
    videoId: 'x4e4qeM4LE8',
    duration: '17:40',
    thumbnail: 'https://img.youtube.com/vi/x4e4qeM4LE8/hqdefault.jpg',
    views: '41K مشاهدة',
    publishedAt: '2025-04-08'
  },
  {
    id: 'v-opt-2-3-2',
    lessonId: 'opt-2-3',
    title: 'مجال المرآة المستوية وتحديد موقع المراقب والأجسام المرئية',
    channelTitle: 'رحمة نور اليقين للفيزياء و الرياضيات',
    isTeacherChannel: false,
    videoId: 'aU02pF6vZP4',
    duration: '19:20',
    thumbnail: 'https://img.youtube.com/vi/aU02pF6vZP4/hqdefault.jpg',
    views: '47K مشاهدة',
    publishedAt: '2025-04-10'
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-elec-1',
    lessonId: 'elec-3-3',
    fieldId: 'electricity',
    title: 'تمرين شامل: قراءة منحنى راسم الاهتزاز المهبطي وحساب خصائص التوتر المتناوب',
    difficulty: 'bem',
    text: 'قام أستاذ في المخبر بربط مولد لتيار كهربائي متناوب بمدخلي راسم اهتزاز مهبطي، فظهر على الشاشة منحنى جيبي. أعطيت المعطيات التالية:\n- الحساسية الشاقولية: Sv = 3 V/div\n- الحساسية الأفقية: Sh = 5 ms/div\n- عدد التدريجات الشاقولية من المحور إلى أقصى قمة: Y = 4 div\n- عدد التدريجات الأفقية لنوبة موجبة ونوبة سالبة متتاليتين: X = 4 div\n\nالمطلوب:\n1. احسب التوتر الأعظمي Umax.\n2. احسب التوتر الفعال Ueff الذي سيشير إليه الفولطمتر.\n3. احسب دور هذا التوتر T بالثواني.\n4. استنتج تواتره (تردده) f.',
    hints: [
      'طبق القانون Umax = Y × Sv لحساب التوتر الأعظمي.',
      'احذر: Umax = Ueff × √2 أي Ueff = Umax / 1.414.',
      'لتحويل الدور من الميلي ثانية (ms) إلى الثانية (s)، اقسم على 1000 قبل حساب التواتر f = 1/T.'
    ],
    expectedFormulas: ['Umax = Y × Sv', 'Ueff = Umax / √2', 'T = X × Sh', 'f = 1 / T'],
    points: 20,
    fullSolution: {
      givens: [
        'الحساسية الشاقولية: Sv = 3 V/div',
        'عدد التدريجات الشاقولية: Y = 4 div',
        'الحساسية الأفقية: Sh = 5 ms/div',
        'عدد التدريجات الأفقية لدور كامل: X = 4 div'
      ],
      required: [
        '1. حساب التوتر الأعظمي Umax',
        '2. حساب التوتر الفعال Ueff',
        '3. حساب الدور T بالثانية',
        '4. حساب التواتر f بالهرتز'
      ],
      formula: '1) Umax = Y × Sv\n2) Ueff = Umax / √2\n3) T = X × Sh\n4) f = 1 / T',
      substitution: '1) Umax = 4 div × 3 V/div\n2) Ueff = 12 / 1.414\n3) T = 4 div × 5 ms/div = 20 ms = 20 × 10^-3 s\n4) f = 1 / 0.02 s',
      calculation: '1) Umax = 12 V\n2) Ueff ≈ 8.48 V\n3) T = 0.02 s\n4) f = 50 Hz',
      result: 'Umax = 12 V ، Ueff = 8.48 V ، T = 0.02 s ، f = 50 Hz',
      unit: 'فولط (V) للتوتر، ثانية (s) للدور، هرتز (Hz) للتواتر.',
      verification: 'النتيجة منطقية تماماً وتتوافق مع التواتر الصناعي المعتمد 50Hz.'
    }
  },
  {
    id: 'ex-elec-2',
    lessonId: 'elec-4-2',
    fieldId: 'electricity',
    title: 'وضعية إدماجية: معالجة مشكلات الأمن الكهربائي في مطبخ منزل',
    difficulty: 'hard',
    text: 'اشترت عائلة غسالة كهربائية جديدة (هيكلها معدني) وركبتها في مأخذ المطبخ. لاحظت الأم حادثتين:\n1. عند ملامستها للهيكل المعدني للغسالة أثناء اشتغالها تشعر بصدمة كهربائية خفيفة.\n2. عند تشغيل الغسالة والفرن الكهربائي والمكواة في نفس الوقت، ينقطع التيار الكهربائي عن المنزل كلياً بفعل القاطع التفاضلي الرئيسي، بالرغم من سلامة جميع الأجهزة.\n\nالمطلوب:\n1. فسر سبب إصابة الأم بالصعق الكهربائي واقترح حلاً تقنياً فورياً.\n2. فسر سبب انقطاع التيار الكهربائي عند تشغيل الأجهزة معاً واقترح الحل المناسب.\n3. أين يجب تركيب المنصهرة والقاطعة بالنسبة لسلكي الطور والحيادي؟ علل.',
    hints: [
      'الصدمة الكهربائية تعني ملامسة سلك الطور العاري للهيكل المعدني مع انعدام المأخذ الأرضي.',
      'انقطاع القاطع عند تشغيل عدة أجهزة معاً ناتج عن الحمولة الزائدة (الشدة الكلية تتجاوز شدة القاطع).'
    ],
    expectedFormulas: ['P_totale = P1 + P2 + P3', 'I_total = P_total / U'],
    points: 20,
    fullSolution: {
      givens: [
        'هيكل الغسالة معدني ناقل للكهرباء.',
        'شعور بصدمة خفيفة عند اللمس أثناء الاشتغال.',
        'انقطاع التيار عن كل المنزل عند التشغيل المتزامن للأجهزة الكهرومنزلية.'
      ],
      required: [
        '1. تفسير سبب الصدمة والحل المقترح.',
        '2. تفسير سبب فصل القاطع والحل المناسب.',
        '3. موضع تركيب المنصهرة والقاطعة مع التعليل.'
      ],
      formula: 'قواعد الأمن الكهربائي والتوصيل الأرضي وحماية الدارات.',
      substitution: 'تحليل الوضعية استناداً إلى المنظومة المعيارية للتركيبات المنزلية.',
      calculation: 'لا تتطلب حسابات رقمية مباشرة بل تفسيراً علمياً تقنياً دقيقاً.',
      result: '1) السبب: ملامسة سلك الطور العاري لهيكل الغسالة وعدم توصيل المأخذ بالأرض. الحل: تغليف السلك العازل وربط هيكل الغسالة بالمأخذ الأرضي.\n2) السبب: حمولة زائدة (I_total > I_disjoncteur). الحل: ضبط زر القاطع التفاضلي على شدة أعلى تناسب الاستهلاك أو تشغيل الأجهزة بالتناوب.\n3) الموضع: على سلك الطور دوماً لضمان عزل التوتر كلياً عند الفتح أو الانصهار.',
      unit: 'مفاهيم نوعية تقنية.',
      verification: 'الحلول المقترحة تضمن سلامة الأشخاص من الصعق وحماية الأجهزة من الاحتراق والحرائق.'
    }
  },
  {
    id: 'ex-mat-1',
    lessonId: 'mat-2-2',
    fieldId: 'matter',
    title: 'تمرين التحليل الكهربائي البسيط لمحلول كلور القصدير SnCl2',
    difficulty: 'medium',
    text: 'نحقق دارة التحليل الكهربائي البسيط لمحلول كلور القصدير (Sn2+ + 2Cl-) باستعمال وعاء تحليل مسرياه (A) و (B) من الفحم (الغرافيت). المسرى (A) متصل بالقطب الموجب للمولد والمسرى (B) متصل بالقطب السالب.\n\nالمطلوب:\n1. سمّ المسرى (A) والمسرى (B).\n2. صف ما يحدث عيانياً بجوار كل مسرى عند غلق القاطعة.\n3. اكتب المعادلة النصفية الحادثة عند كل مسرى مبيناً الحالة الفيزيائية للأفراد.\n4. استنتج المعادلة الإجمالية لهذا التحليل الكهربائي.',
    hints: [
      'المسرى الموصول بالقطب الموجب هو المصعد (Anode) وتتجه إليه الأنيونات السالبة Cl-.',
      'المسرى الموصول بالقطب السالب هو المهبط (Cathode) وتتجه إليه الكاتيونات الموجبة Sn2+.'
    ],
    expectedFormulas: ['2Cl-(aq) -> Cl2(g) + 2e-', 'Sn2+(aq) + 2e- -> Sn(s)'],
    points: 20,
    fullSolution: {
      givens: [
        'المحلول: كلور القصدير (Sn2+ + 2Cl-)',
        'المسرى (A) متصل بالقطب الموجب للمولد.',
        'المسرى (B) متصل بالقطب السالب للمولد.',
        'المسريان من الغرافيت (فحم مصمت لا يتآكل).'
      ],
      required: [
        '1. تسمية المسرى A و B.',
        '2. الملاحظات العيانية عند المسريين.',
        '3. المعادلتان النصفيتان عند المصعد والمهبط.',
        '4. المعادلة الإجمالية.'
      ],
      formula: 'معادلات الأكسدة والإرجاع الكهروكيميائي البسيط.',
      substitution: 'المهبط يكتسب إلكترونات، والمصعد يفقد إلكترونات.',
      calculation: 'موازنة الإلكترونات: 2e- مفقودة عند المصعد تقابلها 2e- مكتسبة عند المهبط.',
      result: '1) المسرى A هو المصعد (Anode)، والمسرى B هو المهبط (Cathode).\n2) الملاحظات: عند المصعد انطلاق فقاعات غازية لكلور Cl2 ذي اللون الأخضر المصفر؛ عند المهبط ترسب شعيرات معدن القصدير الصلب Sn.\n3) المعادلة عند المصعد: 2Cl-(aq) -> Cl2(g) + 2e-\nالمعادلة عند المهبط: Sn2+(aq) + 2e- -> Sn(s)\n4) المعادلة الإجمالية: (Sn2+ + 2Cl-)(aq) -> Sn(s) + Cl2(g)',
      unit: 'حالات فيزيائية: (aq) لمحلول مائي، (g) لغاز، (s) لجسم صلب.',
      verification: 'المعادلة محققة لقانون انحفاظ الكتلة (الذرات) وانحفاظ الشحنة الكهربائية.'
    }
  },
  {
    id: 'ex-mech-1',
    lessonId: 'mech-2-2',
    fieldId: 'mechanics',
    title: 'تمرين الثقل والكتلة وتوازن جسم صلب معلق بنابض',
    difficulty: 'medium',
    text: 'نعلق كرية حديدية (S) كتلتها m = 400 g بنهاية نابض مرن مثبت إلى حامل. تأخذ الكرية وضع التوازن. يعطى: g = 10 N/kg.\n\nالمطلوب:\n1. اذكر القوى المؤثرة على الكرية (S).\n2. احسب شدة ثقل الكرية P.\n3. اذكر شرط توازن الكرية (S) واستنتج شدة قوة توتر النابض T.\n4. مثل القوتين على الشكل باختيار سلم رسم مناسب: 1 cm لكل 2 N.',
    hints: [
      'تذكر تحويل الكتلة m من الغرام إلى الكيلوغرام بالقسمة على 1000 قبل حساب الثقل.',
      'في حالة التوازن، قوة شد النابض T تساوي ثقل الجسم P في الشدة وتعكسها في الاتجاه.'
    ],
    expectedFormulas: ['P = m × g', 'P_vec + T_vec = 0_vec', 'T = P'],
    points: 20,
    fullSolution: {
      givens: [
        'الكتلة: m = 400 g',
        'الجاذبية: g = 10 N/kg',
        'الكرية في حالة توازن ساكن.',
        'سلم الرسم: 1 cm يمثل 2 N.'
      ],
      required: [
        '1. جرد القوى المؤثرة على الكرية.',
        '2. حساب شدة الثقل P.',
        '3. كتابة شرط التوازن واستنتاج شدة توتر النابض T.',
        '4. تحديد طول الشعاعين ورسمهما.'
      ],
      formula: 'P = m × g ، شرط التوازن: P_vec + T_vec = 0_vec',
      substitution: 'm = 400 / 1000 = 0.4 kg\nP = 0.4 kg × 10 N/kg\nT = P = 4 N\nطول الشعاع = 4 N / (2 N/cm) = 2 cm',
      calculation: 'P = 4 N ، T = 4 N ، طول الشعاع = 2 cm',
      result: '1) القوى المؤثرة: ثقل الكرية P (فعل بعدي للأرض) وقوة توتر النابض T (فعل تلامسي للنابض).\n2) شدة الثقل: P = 4 N.\n3) شرط التوازن: القوتان لهما نفس الحامل الشاقولي، ومجموعهما الشعاعي معدوم P_vec + T_vec = 0_vec، إذن: T = P = 4 N.\n4) طول كل من شعاع الثقل وشعاع توتر النابض هو 2 cm.',
      unit: 'الشدة بالنيوتن (N)، الطول بالسنتيمتر (cm).',
      verification: 'القوتان متساويتان ومتعاكستان وشاقوليتان، والجسم في سكون مستقر.'
    }
  },
  {
    id: 'ex-mech-2',
    lessonId: 'mech-4-1',
    fieldId: 'mechanics',
    title: 'مسألة دافعة أرخميدس وطفو الأجسام BEM نموذجية',
    difficulty: 'bem',
    text: 'نعلق جسماً صلباً متجانساً (S) بربيعة في الهواء، فتشير إلى القيمة P = 5 N. ثم نغمره كلياً داخل مخبار مدرج يحتوي على ماء نقي كتلته الحجمية ρ = 1000 kg/m³، فتشير الربيعة إلى القيمة P\' = 3.2 N. يعطى: g = 10 N/kg.\n\nالمطلوب:\n1. ماذا تمثل كل من القراءتين P و P\'؟\n2. احسب شدة دافعة أرخميدس Fa المطبقة من طرف الماء على الجسم.\n3. احسب حجم الجسم الصلب V (علماً أنه مغمور كلياً).\n4. استنتج كتلة الماء المزاح m_eau.',
    hints: [
      'القراءة في الهواء هي الثقل الحقيقي P، والقراءة في السائل هي الثقل الظاهري P\'.',
      'Fa = P - P\' وأيضاً Fa = ρ × V × g.',
      'حجم الجسم المغمور كلياً يساوي حجم السائل المزاح تماماً.'
    ],
    expectedFormulas: ['Fa = P - P\'', 'Fa = ρ × V × g => V = Fa / (ρ × g)', 'Fa = m_liq × g'],
    points: 20,
    fullSolution: {
      givens: [
        'الثقل الحقيقي في الهواء: P = 5 N',
        'الثقل الظاهري في الماء: P\' = 3.2 N',
        'الكتلة الحجمية للماء: ρ = 1000 kg/m³',
        'تسارع الجاذبية: g = 10 N/kg'
      ],
      required: [
        '1. دلالة P و P\'',
        '2. حساب دافعة أرخميدس Fa',
        '3. حساب حجم الجسم V بالمتر المكعب والسنتيمتر المكعب',
        '4. حساب كتلة الماء المزاح m_eau'
      ],
      formula: '1) Fa = P - P\'\n2) Fa = ρ × V × g  =>  V = Fa / (ρ × g)\n3) Fa = m_eau × g  =>  m_eau = Fa / g',
      substitution: 'Fa = 5 N - 3.2 N\nV = 1.8 / (1000 × 10)\nm_eau = 1.8 / 10',
      calculation: 'Fa = 1.8 N\nV = 1.8 / 10000 = 1.8 × 10^-4 m³ = 180 cm³\nm_eau = 0.18 kg = 180 g',
      result: '1) P: الثقل الحقيقي، P\': الثقل الظاهري.\n2) Fa = 1.8 N.\n3) V = 1.8 × 10^-4 m³ (أو 180 cm³).\n4) كتلة الماء المزاح: m_eau = 0.18 kg (أو 180 g).',
      unit: 'Fa بالنيوتن N، V بالمتر المكعب m³، الكتلة بالكيلوغرام kg.',
      verification: 'كتلة الماء المزاح 180 g في حجم 180 cm³ تعطي كثافة 1 g/cm³ تماماً للماء النقي.'
    }
  },
  {
    id: 'ex-opt-1',
    lessonId: 'opt-2-2',
    fieldId: 'optics',
    title: 'تمرين قانونا الانعكاس لديكارت والمرآة المستوية',
    difficulty: 'easy',
    text: 'يسقط شعاع ضوئي وارد على سطح مرآة مستوية (M) بحيث يصنع زاوية قدرها 35° مع سطح المرآة نفسها.\n\nالمطلوب:\n1. احسب زاوية الورود i للشعاع الضوئي.\n2. اذكر نص قانون الانعكاس الثاني لديكارت، واستنتج قيمة زاوية الانعكاس r.\n3. احسب الزاوية المحصورة بين الشعاع الوارد والشعاع المنعكس.',
    hints: [
      'انتبه جيداً: زاوية الورود i تقاس بالنسبة للناظم العمودي (الزاوية القائمة 90° مع المرآة)، وليس مع سطح المرآة!',
      'قانون ديكارت الثاني: زاوية الورود تساوي زاوية الانعكاس i = r.'
    ],
    expectedFormulas: ['i = 90° - 35° = 55°', 'r = i = 55°', 'Angle_total = i + r'],
    points: 20,
    fullSolution: {
      givens: [
        'الزاوية بين الشعاع الوارد وسطح المرآة = 35°.',
        'المستقيم الناظم N عمودي تماماً على سطح المرآة (يصنع زاوية 90°).'
      ],
      required: [
        '1. حساب زاوية الورود i.',
        '2. ذكر قانون الانعكاس الثاني واستنتاج زاوية الانعكاس r.',
        '3. حساب الزاوية الكلية بين الشعاعين.'
      ],
      formula: 'i = 90° - α_surface ، r = i ، Angle = i + r',
      substitution: 'i = 90° - 35° = 55°\nr = 55°\nAngle = 55° + 55°',
      calculation: 'i = 55° ، r = 55° ، Angle = 110°',
      result: '1) زاوية الورود i = 55°.\n2) قانون ديكارت الثاني: زاوية الانعكاس r تساوي دوماً زاوية الورود i، ومنه r = 55°.\n3) الزاوية بين الشعاع الوارد والمنعكس هي 110°.',
      unit: 'الدرجة الزاوية (°).',
      verification: 'الزاوية بين الشعاعين متناظرة تماماً حول خط الناظم العمودي.'
    }
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    lessonId: 'elec-1-1',
    fieldId: 'electricity',
    type: 'mcq',
    difficulty: 'easy',
    question: 'عند دلك قضيب من البلاستيك أو الإيبونيت بقطعة صوف، فإنه يكتسب شحنة كهربائية:',
    options: ['موجبة (+)', 'سالبة (-)', 'معدومة (0)', 'متناوبة'],
    correctAnswerIndex: 1,
    explanation: 'قضيب الإيبونيت أو البلاستيك يكتسب إلكترونات إضافية عند دلكه بالصوف، وبالتالي تصبح شحنته سالبة (-).',
    conceptToReview: 'طرق التكهرب وشحنة الإيبونيت والزجاج'
  },
  {
    id: 'q-2',
    lessonId: 'elec-3-3',
    fieldId: 'electricity',
    type: 'calculation',
    difficulty: 'medium',
    question: 'إذا كان التوتر الأعظمي Umax = 14.14 V، فما القيمة التي يشير إليها جهاز الفولطمتر (Ueff)؟',
    options: ['14.14 V', '20 V', '10 V', '28.28 V'],
    correctAnswerIndex: 2,
    explanation: 'الفولطمتر يقيس التوتر الفعال Ueff = Umax / √2 = 14.14 / 1.414 = 10 V.',
    conceptToReview: 'العلاقة بين التوتر الأعظمي Umax والفعال Ueff'
  },
  {
    id: 'q-3',
    lessonId: 'elec-4-2',
    fieldId: 'electricity',
    type: 'situation_analysis',
    difficulty: 'hard',
    question: 'أين يجب توصيل المنصهرة والقاطعة في الدارة الكهربائية المنزلية لحماية الأجهزة والأشخاص؟',
    options: [
      'على سلك الحيادي حصراً',
      'على سلك الطور حصراً',
      'على سلك المأخذ الأرضي',
      'لا يهم، كلاهما يعطي نفس النتيجة'
    ],
    correctAnswerIndex: 1,
    explanation: 'يجب تركيب المنصهرة والقاطعة على سلك الطور دائماً لعزل الجهاز كلياً عن التوتر الخطر 230V عند فتح القاطعة أو انصهار المنصهرة.',
    conceptToReview: 'قواعد الأمن الكهربائي وتوصيل المنصهرة'
  },
  {
    id: 'q-4',
    lessonId: 'mat-1-1',
    fieldId: 'matter',
    type: 'true_false',
    difficulty: 'easy',
    question: 'المحلول المائي السكري ينقل التيار الكهربائي لاحتوائه على شوارد حرة.',
    options: ['صحيح', 'خطأ'],
    correctAnswerIndex: 1,
    explanation: 'خطأ! المحلول السكري محلول جزيئي لا يحتوي على شوارد حرة ولا ينقل الكهرباء. المحاليل الشاردية فقط هي التي تنقل التيار.',
    conceptToReview: 'الفرق بين المحاليل الشاردية والجزيئية'
  },
  {
    id: 'q-5',
    lessonId: 'mat-2-2',
    fieldId: 'matter',
    type: 'formula_choice',
    difficulty: 'medium',
    question: 'ما هي المعادلة النصفية الصحيحة الحادثة عند المصعد (القطب الموجب) في التحليل الكهربائي لمحلول كلور الزنك؟',
    options: [
      'Zn2+(aq) + 2e- -> Zn(s)',
      '2Cl-(aq) -> Cl2(g) + 2e-',
      'Cl2(g) + 2e- -> 2Cl-(aq)',
      'Zn(s) -> Zn2+(aq) + 2e-'
    ],
    correctAnswerIndex: 1,
    explanation: 'عند المصعد الموجب، تفقد شوارد الكلور السالبة Cl- إلكتروناتها لتنطلق على شكل غاز الكلور: 2Cl-(aq) -> Cl2(g) + 2e-.',
    conceptToReview: 'المعادلات النصفية في التحليل الكهربائي البسيط'
  },
  {
    id: 'q-6',
    lessonId: 'mat-3-1',
    fieldId: 'matter',
    type: 'mcq',
    difficulty: 'easy',
    question: 'عند تفاعل حمض كلور الماء مع معدن الحديد، ما هو الغاز المنطلق وكيف نكشف عنه؟',
    options: [
      'غاز ثنائي أكسيد الكربون CO2 (يعكر رائق الكلس)',
      'غاز الأكسجين O2 (يزيد اشتعال عود ثقاب)',
      'غاز الهيدروجين H2 (يحدث فرقعة خفيفة بلهب أزرق عند تقريب عود ثقاب)',
      'غاز الكلور Cl2 (يخنق ويزيل لون النيلة)'
    ],
    correctAnswerIndex: 2,
    explanation: 'الغاز المنطلق في تفاعل الأحماض مع المعادن هو غاز الهيدروجين H2 الذي نكشف عنه بحدوث فرقعة خفيفة عند تقريب لهب.',
    conceptToReview: 'تفاعل حمض كلور الماء مع المعادن والكشف عن الغازات'
  },
  {
    id: 'q-7',
    lessonId: 'mech-2-2',
    fieldId: 'mechanics',
    type: 'calculation',
    difficulty: 'medium',
    question: 'جسم كتلته m = 300 g، إذا علمت أن الجاذبية الأرضية g = 10 N/kg، فما هي شدة ثقله P؟',
    options: ['3000 N', '30 N', '3 N', '0.3 N'],
    correctAnswerIndex: 2,
    explanation: 'أولاً نحول الكتلة: m = 300 / 1000 = 0.3 kg. ثم نحسب: P = m × g = 0.3 × 10 = 3 N.',
    conceptToReview: 'قانون حساب الثقل والتحويل الإلزامي للكيلوغرام'
  },
  {
    id: 'q-8',
    lessonId: 'mech-3-1',
    fieldId: 'mechanics',
    type: 'formula_choice',
    difficulty: 'medium',
    question: 'أي من الشروط التالية يمثل شرط توازن جسم صلب خاضع لقوتين F1 و F2؟',
    options: [
      'القوتان لهما نفس المنحى والمجموع الشعاعي F1_vec + F2_vec = 0_vec',
      'القوتان لهما حاملان متعامدان و F1 = F2',
      'القوتان في نفس الاتجاه و F1 + F2 = 10 N',
      'القوة الأولى تساوي نصف القوة الثانية'
    ],
    correctAnswerIndex: 0,
    explanation: 'شرطا توازن جسم خاضع لقوتين هما: نفس الحامل (خط التأثير)، ومجموعهما الشعاعي يساوي الشعاع المعدوم (F1 = F2 ومتعاكستان اتجاهاً).',
    conceptToReview: 'شرطا توازن جسم صلب خاضع لقوتين'
  },
  {
    id: 'q-9',
    lessonId: 'mech-4-1',
    fieldId: 'mechanics',
    type: 'calculation',
    difficulty: 'hard',
    question: 'جسم ثقله في الهواء P = 6 N وثقله الظاهري داخل سائل P\' = 4.2 N. ما هي شدة دافعة أرخميدس Fa؟',
    options: ['10.2 N', '1.8 N', '2.4 N', '25.2 N'],
    correctAnswerIndex: 1,
    explanation: 'Fa = P (الحقيقي) - P\' (الظاهري) = 6 - 4.2 = 1.8 N.',
    conceptToReview: 'حساب دافعة أرخميدس باستعمال الثقل الظاهري'
  },
  {
    id: 'q-10',
    lessonId: 'opt-2-2',
    fieldId: 'optics',
    type: 'mcq',
    difficulty: 'easy',
    question: 'إذا سقط شعاع ضوئي على مرآة مستوية بزاوية ورود i = 40° مع الناظم، فما هي زاوية الانعكاس r؟',
    options: ['50°', '40°', '80°', '90°'],
    correctAnswerIndex: 1,
    explanation: 'وفق قانون ديكارت الثاني للانعكاس: زاوية الانعكاس r تساوي دوماً زاوية الورود i، إذن r = 40°.',
    conceptToReview: 'قانونا الانعكاس لديكارت'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-lesson',
    title: 'أول خطوة في النجاح',
    description: 'أكملت مراجعة أول درس في مادة الفيزياء.',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'progress'
  },
  {
    id: 'badge-ten-exercises',
    title: 'بطل التمارين',
    description: 'قمت بحل 5 تمارين فيزيائية بنجاح.',
    icon: 'Award',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'progress'
  },
  {
    id: 'badge-electricity-master',
    title: 'خبير الكهرباء',
    description: 'أتقنت ميدان الظواهر الكهربائية وحصلت على علامة ممتازة.',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'mastery'
  },
  {
    id: 'badge-mechanics-master',
    title: 'بطل الميكانيك',
    description: 'أتقنت حسابات الثقل والقوى وتوازن الأجسام ودافعة أرخميدس.',
    icon: 'Cog',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'mastery'
  },
  {
    id: 'badge-streak-3',
    title: 'عزيمة لا تلين 🔥',
    description: 'حافظت على سلسلة مراجعة متتالية لمدة 3 أيام.',
    icon: 'Flame',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: 'streak'
  },
  {
    id: 'badge-bem-ready',
    title: 'مستعد للـ BEM 🏆',
    description: 'أتممت اختباراً شاملاً بنتيجة تفوق 16/20.',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    category: 'quiz'
  }
];
