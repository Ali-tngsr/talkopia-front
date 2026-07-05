// Mock data for Talkotopia — simulates backend data structure
// All Persian text uses proper Persian digits & formatting

export type CourseCategory = 'art' | 'language' | 'math' | 'music' | 'science' | 'coding';

export interface Lesson {
  id: string;
  titleEn: string;
  titleFa: string;
  duration: number; // minutes
  isPreview: boolean;
  videoUrl: string; // mock
  watched?: boolean;
}

export interface Chapter {
  id: string;
  titleEn: string;
  titleFa: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  titleEn: string;
  titleFa: string;
  subtitleEn: string;
  subtitleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  instructorEn: string;
  instructorFa: string;
  instructorBioEn: string;
  instructorBioFa: string;
  category: CourseCategory;
  ageGroup: string;
  price: number; // toman
  priceLabel: string;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  emoji: string;
  tagEn: string;
  tagFa: string;
  whatYouLearnEn: string[];
  whatYouLearnFa: string[];
  requirementsEn: string[];
  requirementsFa: string[];
  attachments: { nameEn: string; nameFa: string; size: string }[];
  comments: { author: string; avatar: string; textEn: string; textFa: string; date: string; likes: number }[];
  chapters: Chapter[];
}

const sampleChapters = (chapterCount: number, lessonsPerChapter: number): Chapter[] => {
  const chapters: Chapter[] = [];
  for (let c = 1; c <= chapterCount; c++) {
    const lessons: Lesson[] = [];
    for (let l = 1; l <= lessonsPerChapter; l++) {
      lessons.push({
        id: `c${c}-l${l}`,
        titleEn: `Lesson ${c}.${l} — Discovering New Things`,
        titleFa: `درس ${c}.${l} — کشف چیزهای جدید`,
        duration: 8 + ((c * 3 + l * 5) % 12),
        isPreview: c === 1 && l === 1,
        videoUrl: '/videos/sample.mp4',
        watched: c === 1 && l <= 2,
      });
    }
    chapters.push({
      id: `chapter-${c}`,
      titleEn: `Chapter ${c}: The Friendly Beginning`,
      titleFa: `فصل ${c}: شروعی دوستانه`,
      lessons,
    });
  }
  return chapters;
};

export const courses: Course[] = [
  {
    slug: 'painting-with-tako',
    titleEn: 'Painting with Tako',
    titleFa: 'نقاشی با تاکو',
    subtitleEn: 'Colors, brushes and happy accidents',
    subtitleFa: 'رنگ‌ها، قلم‌موها و اشتباهات خوشبخت',
    descriptionEn:
      'A playful introduction to painting for young artists. Tako the octopus guides children through color mixing, brush techniques, and the joy of making happy accidents on paper. Each lesson is short, hands-on, and ends with a small art piece to display on the fridge.',
    descriptionFa:
      'آشنایی شاد با نقاشی برای هنرمندان جوان. تاکو هشت‌پا کودکان را در میان ترکیب رنگ‌ها، تکنیک‌های قلم‌مو و شادی اشتباهات خوشبخت روی کاغذ راهنمایی می‌کند. هر درس کوتاه، عملی و با یک نقاشی کوچک برای یخچال تمام می‌شود.',
    instructorEn: 'Ms. Laleh Karimi',
    instructorFa: 'خانم لاله کریمی',
    instructorBioEn: 'Laleh is an illustrator and art teacher with 12 years of experience guiding young creative minds. Her studio in Isfahan hosts weekly children workshops.',
    instructorBioFa: 'لاله تصویرگر و مدرس هنر با ۱۲ سال تجربه در راهنمایی ذهن‌های خلاق جوان است. کارگاهش در اصفهان میزبان کارگاه‌های هفتگی کودکان است.',
    category: 'art',
    ageGroup: '6-10',
    price: 320000,
    priceLabel: '320,000',
    rating: 4.9,
    ratingCount: 248,
    studentsCount: 1240,
    emoji: '🦊',
    tagEn: 'Ages 6-10',
    tagFa: '۶ تا ۱۰ سال',
    whatYouLearnEn: [
      'Mix primary colors to create a full palette',
      'Hold and control brushes of different sizes',
      'Turn "mistakes" into creative features',
      'Paint a complete scene by the final lesson',
    ],
    whatYouLearnFa: [
      'رنگ‌های اصلی را ترکیب کن و یک پالت کامل بساز',
      'قلم‌موهای مختلف را در دست بگیر و کنترل کن',
      '«اشتباهات» را به ویژگی‌های خلاقانه تبدیل کن',
      'تا درس آخر یک صحنهٔ کامل نقاشی کن',
    ],
    requirementsEn: ['Watercolor set', '3 brushes (small, medium, large)', 'Thick paper (A4)', 'A cup of water and a smile'],
    requirementsFa: ['ست آبرنگ', '۳ قلم‌مو (ریز، متوسط، درشت)', 'کاغذ ضخیم (A4)', 'یک لیوان آب و یک لبخند'],
    attachments: [
      { nameEn: 'Color wheel printable', nameFa: 'چرخ رنگ قابل چاپ', size: '480 KB' },
      { nameEn: 'Brush guide PDF', nameFa: 'راهنمای قلم‌مو PDF', size: '1.2 MB' },
    ],
    comments: [
      { author: 'Sara M.', avatar: '🦋', textEn: 'My daughter asks for this course every afternoon. The happy accidents lesson changed everything!', textFa: 'دخترم هر عصر این دوره را می‌خواهد. درس اشتباهات خوشبخت همه چیز را تغییر داد!', date: '2 days ago', likes: 24 },
      { author: 'Reza K.', avatar: '🐯', textEn: 'Tako is so cute. Great pacing for kids.', textFa: 'تاکو خیلی بامزه‌ست. ریتم عالی برای بچه‌ها.', date: '1 week ago', likes: 12 },
    ],
    chapters: sampleChapters(4, 5),
  },
  {
    slug: 'english-adventures',
    titleEn: 'English Adventures',
    titleFa: 'ماجراجویی انگلیسی',
    subtitleEn: 'Phonics to first sentences',
    subtitleFa: 'از فونتیک تا جمله‌های اول',
    descriptionEn:
      'A gentle, story-based English course that takes absolute beginners from alphabet sounds to their first full sentences. Tako and friends travel through Letter Land, meeting friendly characters who each teach a new sound.',
    descriptionFa:
      'یک دورهٔ انگلیسی داستان‌محور و ملایم که مبتدی‌های کامل را از صدای الفبا تا اولین جمله‌های کامل می‌برد. تاکو و دوستان از سرزمین حروف عبور می‌کنند و با کاراکترهای دوستانه‌ای آشنا می‌شوند که هر کدام یک صدای جدید یاد می‌دهند.',
    instructorEn: 'Mr. Daniel Ross',
    instructorFa: 'آقای دانیل راس',
    instructorBioEn: 'Daniel is a TEFL-certified teacher from Vancouver who has taught young learners in Tehran and Istanbul. He specializes in phonics-first approaches.',
    instructorBioFa: 'دانیل مدرس TEFL از ونکوور است که در تهران و استانبول به کودکان تدریس کرده. تخصصش رویکرد فونتیک-اول است.',
    category: 'language',
    ageGroup: '7-12',
    price: 450000,
    priceLabel: '450,000',
    rating: 4.8,
    ratingCount: 412,
    studentsCount: 2380,
    emoji: '🐼',
    tagEn: 'Ages 7-12',
    tagFa: '۷ تا ۱۲ سال',
    whatYouLearnEn: [
      'Master all 44 phonics sounds',
      'Blend sounds into words confidently',
      'Build first simple sentences',
      'Recognize 200+ high-frequency words',
    ],
    whatYouLearnFa: [
      'تمام ۴۴ صدای فونتیک را یاد بگیر',
      'صداها را با اعتماد به کلمات ترکیب کن',
      'اولین جمله‌های ساده را بساز',
      'بیش از ۲۰۰ کلمه پرکاربرد را بشناس',
    ],
    requirementsEn: ['No prior English needed', 'A quiet space to repeat sounds aloud', 'Optional: printed flashcards'],
    requirementsFa: ['به انگلیسی قبلی نیاز نیست', 'یک فضای آرام برای تکرار صداها', 'اختیاری: فلش‌کارت چاپ‌شده'],
    attachments: [
      { nameEn: 'Phonics chart', nameFa: 'جدول فونتیک', size: '720 KB' },
      { nameEn: 'Flashcards PDF (printable)', nameFa: 'فلش‌کارت PDF (قابل چاپ)', size: '3.4 MB' },
      { nameEn: 'Audio companion tracks', nameFa: 'فایل‌های صوتی همراه', size: '18 MB' },
    ],
    comments: [
      { author: 'Maryam T.', avatar: '🌸', textEn: 'Finally my son reads English with confidence. The phonics approach is magic.', textFa: 'بالاخره پسرم با اعتماد به نفس انگلیسی می‌خواند. رویکرد فونتیک جادوست.', date: '3 days ago', likes: 38 },
      { author: 'Omid R.', avatar: '🦉', textEn: 'The Letter Land story is brilliant. Keeps kids hooked.', textFa: 'داستان سرزمین حروف فوق‌العاده‌ست. بچه‌ها را میخکوب می‌کند.', date: '5 days ago', likes: 19 },
    ],
    chapters: sampleChapters(5, 4),
  },
  {
    slug: 'math-quest',
    titleEn: 'Math Quest',
    titleFa: 'جستجوی ریاضی',
    subtitleEn: 'Numbers tell a story',
    subtitleFa: 'اعداد داستانی برای گفتن دارند',
    descriptionEn:
      'Math Quest turns numbers into adventures. Each lesson is a small puzzle that Tako and learners solve together — counting treasures, sharing pies fairly, and finding patterns in stars. By the end, math feels like a friend, not a fear.',
    descriptionFa:
      'جستجوی ریاضی اعداد را به ماجراجویی تبدیل می‌کند. هر درس یک معمای کوچک است که تاکو و یادگیرندگان با هم حل می‌کنند — شمارش گنجینه‌ها، تقسیم عادلانه پیتزا و یافتن الگوها در ستاره‌ها. در پایان، ریاضی مثل یک دوست حس می‌شود، نه یک ترس.',
    instructorEn: 'Dr. Sina Mehrabi',
    instructorFa: 'دکتر سینا محرابی',
    instructorBioEn: 'Sina holds a PhD in mathematics education. He researches how children build number sense through storytelling and play.',
    instructorBioFa: 'سینا دکترای آموزش ریاضی دارد. تحقیقاتش روی نحوهٔ ساخت درک عددی کودکان از طریق داستان‌گویی و بازی است.',
    category: 'math',
    ageGroup: '8-13',
    price: 380000,
    priceLabel: '380,000',
    rating: 4.7,
    ratingCount: 186,
    studentsCount: 980,
    emoji: '🦁',
    tagEn: 'Ages 8-13',
    tagFa: '۸ تا ۱۳ سال',
    whatYouLearnEn: [
      'Build strong number sense to 1000',
      'Add and subtract with mental strategies',
      'Understand fractions through fair sharing',
      'Spot patterns and use them to solve puzzles',
    ],
    whatYouLearnFa: [
      'درک عددی قوی تا ۱۰۰۰ بساز',
      'با استراتژی‌های ذهنی جمع و تفریق کن',
      'کسرها را از طریق تقسیم عادلانه درک کن',
      'الگوها را پیدا کن و برای حل معماها استفاده کن',
    ],
    requirementsEn: ['Paper and pencil', 'Optional: small objects for counting (beans, buttons)'],
    requirementsFa: ['کاغذ و مداد', 'اختیاری: اشیای کوچک برای شمارش (لوبیا، دکمه)'],
    attachments: [
      { nameEn: 'Printable number line', nameFa: 'خط اعداد قابل چاپ', size: '320 KB' },
      { nameEn: 'Puzzle workbook', nameFa: 'دفترچه معما', size: '2.1 MB' },
    ],
    comments: [
      { author: 'Niloo F.', avatar: '🦊', textEn: 'My son used to cry at math. Now he asks for Math Quest after school.', textFa: 'پسرم از ریاضی گریه می‌زد. حالا بعد از مدرسه جستجوی ریاضی می‌خواهد.', date: '1 day ago', likes: 41 },
    ],
    chapters: sampleChapters(4, 6),
  },
  {
    slug: 'music-garden',
    titleEn: 'Music Garden',
    titleFa: 'باغ موسیقی',
    subtitleEn: 'First rhythms and songs',
    subtitleFa: 'اولین ریتم‌ها و ترانه‌ها',
    descriptionEn:
      'Music Garden introduces children to rhythm, melody and song through clapping games, body percussion, and singing circles. No instrument required — just hands, voice, and joy.',
    descriptionFa:
      'باغ موسیقی کودکان را با ریتم، ملودی و ترانه از طریق بازی‌های دست زدن، پرکوشن بدنی و حلقه‌های آواز آشنا می‌کند. نیازی به ساز نیست — فقط دست‌ها، صدا و شادی.',
    instructorEn: 'Ms. Ava Tehrani',
    instructorFa: 'خانم آوا تهرانی',
    instructorBioEn: 'Ava is a music therapist and Orff-certified educator. She runs inclusive music circles for children of all abilities in Tehran.',
    instructorBioFa: 'آوا موسیقی‌درمانگر و مدرس گواهی‌گرفتهٔ اورف است. حلقه‌های موسیقی فراگیر برای کودکان با هر سطح توانایی در تهران برگزار می‌کند.',
    category: 'music',
    ageGroup: '5-9',
    price: 290000,
    priceLabel: '290,000',
    rating: 4.9,
    ratingCount: 152,
    studentsCount: 760,
    emoji: '🐰',
    tagEn: 'Ages 5-9',
    tagFa: '۵ تا ۹ سال',
    whatYouLearnEn: [
      'Keep a steady beat with body and voice',
      'Sing 10+ traditional and original songs',
      'Read basic rhythm notation (ta, ti-ti, rest)',
      'Compose a short rhythmic pattern',
    ],
    whatYouLearnFa: [
      'ریتم ثابت را با بدن و صدا نگه دار',
      'بیش از ۱۰ ترانهٔ سنتی و اصلی را بخوان',
      'نماد اولیهٔ ریتم را بخوان (تا، تی‌تی، سکوت)',
      'یک الگوی ریتمیک کوتاه بساز',
    ],
    requirementsEn: ['No instrument needed', 'A space where singing aloud is welcome'],
    requirementsFa: ['به ساز نیازی نیست', 'فضایی که آواز خواندن در آن آزاد باشد'],
    attachments: [
      { nameEn: 'Song lyrics PDF', nameFa: 'متن ترانه‌ها PDF', size: '540 KB' },
      { nameEn: 'Rhythm cards (printable)', nameFa: 'کارت‌های ریتم (قابل چاپ)', size: '880 KB' },
    ],
    comments: [
      { author: 'Hana Z.', avatar: '🌷', textEn: 'Ava is so warm. My twins beg for Music Garden every morning.', textFa: 'آوا خیلی گرم است. دوقلوهایم هر صبح باغ موسیقی می‌خواهند.', date: '4 days ago', likes: 27 },
    ],
    chapters: sampleChapters(3, 5),
  },
  {
    slug: 'coding-friends',
    titleEn: 'Coding Friends',
    titleFa: 'دوستان کدنویس',
    subtitleEn: 'First steps in logical thinking',
    subtitleFa: 'اولین قدم‌ها در تفکر منطقی',
    descriptionEn:
      'Coding Friends introduces children to logical thinking through block-based puzzles, no reading required. Tako needs help reaching treasures — kids build the path with simple commands.',
    descriptionFa:
      'دوستان کدنویس کودکان را با تفکر منطقی از طریق معماهای بلوکی آشنا می‌کند، بدون نیاز به خواندن. تاکو برای رسیدن به گنجینه‌ها کمک می‌خواهد — بچه‌ها مسیر را با دستورات ساده می‌سازند.',
    instructorEn: 'Mr. Omid Nazari',
    instructorFa: 'آقان امید نظری',
    instructorBioEn: 'Omid is a software engineer turned educator. He runs free coding circles in underserved schools across Iran.',
    instructorBioFa: 'امید مهندس نرم‌افزار و مدرس شده است. حلقه‌های کدنویسی رایگان در مدارس کم‌برخوردار سراسر ایران برگزار می‌کند.',
    category: 'coding',
    ageGroup: '7-11',
    price: 410000,
    priceLabel: '410,000',
    rating: 4.8,
    ratingCount: 98,
    studentsCount: 540,
    emoji: '🐢',
    tagEn: 'Ages 7-11',
    tagFa: '۷ تا ۱۱ سال',
    whatYouLearnEn: [
      'Sequence commands to reach a goal',
      'Use loops to repeat actions',
      'Debug simple logic errors',
      'Decompose a problem into smaller steps',
    ],
    whatYouLearnFa: [
      'دستورات را به‌ترتیب برای رسیدن به هدف بچین',
      'از حلقه‌ها برای تکرار استفاده کن',
      'خطاهای منطقی ساده را رفع کن',
      'یک مسئله را به قدم‌های کوچک‌تر تجزیه کن',
    ],
    requirementsEn: ['A tablet or computer with a browser', 'No reading required'],
    requirementsFa: ['یک تبلت یا کامپیوتر با مرورگر', 'نیازی به خواندن نیست'],
    attachments: [
      { nameEn: 'Unplugged activity cards', nameFa: 'کارت‌های فعالیت بدون کامپیوتر', size: '1.5 MB' },
    ],
    comments: [
      { author: 'Pooya A.', avatar: '🐙', textEn: 'My 7-year-old now thinks in steps. Amazing.', textFa: 'پسر ۷ ساله‌ام حالا قدم‌به‌قدم فکر می‌کند. فوق‌العاده.', date: '6 days ago', likes: 16 },
    ],
    chapters: sampleChapters(4, 4),
  },
  {
    slug: 'science-safari',
    titleEn: 'Science Safari',
    titleFa: 'سافاری علوم',
    subtitleEn: 'Hands-on experiments at home',
    subtitleFa: 'آزمایش‌های دستی در خانه',
    descriptionEn:
      'Science Safari brings the wonder of discovery into the kitchen. Each lesson uses everyday household items to explore chemistry, physics, and biology. Safe, supervised, and surprisingly magical.',
    descriptionFa:
      'سافاری علوم شگفتی کشف را به آشپزخانه می‌آورد. هر درس از وسایل روزمره خانگی برای کاوش در شیمی، فیزیک و زیست‌شناسی استفاده می‌کند. ایمن، تحت نظارت و به‌طرز غافلگیرکننده‌ای جادویی.',
    instructorEn: 'Dr. Kimia Rostami',
    instructorFa: 'دکتر کیمیا رستمی',
    instructorBioEn: 'Kimia is a biochemist who left the lab to make science accessible to children. Her YouTube channel has 200k+ subscribers.',
    instructorBioFa: 'کیمیا بیوشیمی‌دانی است که آزمایشگاه را ترک کرد تا علم را برای کودکان قابل‌دسترس کند. کانال یوتیوب او بیش از ۲۰۰ هزار مشترک دارد.',
    category: 'science',
    ageGroup: '8-12',
    price: 350000,
    priceLabel: '350,000',
    rating: 4.9,
    ratingCount: 224,
    studentsCount: 1120,
    emoji: '🦉',
    tagEn: 'Ages 8-12',
    tagFa: '۸ تا ۱۲ سال',
    whatYouLearnEn: [
      'Run 20 safe experiments with household items',
      'Understand states of matter through play',
      'Observe and record like a real scientist',
      'Build a science journal by the end',
    ],
    whatYouLearnFa: [
      '۲۰ آزمایش ایمن با وسایل خانگی انجام بده',
      'حالت‌های ماده را از طریق بازی درک کن',
      'مثل یک دانشمند واقعی مشاهده و ثبت کن',
      'تا پایان یک دفترچهٔ علم بساز',
    ],
    requirementsEn: ['Common household items (list provided)', 'A notebook for observations', 'Adult supervision recommended'],
    requirementsFa: ['وسایل خانگی رایج (لیست داده می‌شود)', 'یک دفتر برای مشاهده‌ها', 'نظارت بزرگسال توصیه می‌شود'],
    attachments: [
      { nameEn: 'Materials checklist', nameFa: 'چک‌لیست مواد', size: '210 KB' },
      { nameEn: 'Science journal template', nameFa: 'قالب دفترچهٔ علم', size: '960 KB' },
    ],
    comments: [
      { author: 'Bahram N.', avatar: '🦅', textEn: 'Volcano experiment blew my kids minds. Worth every toman.', textFa: 'آزمایش آتشفشان ذهن بچه‌هام رو برد. هر تومنش می‌ارزع.', date: '1 week ago', likes: 33 },
    ],
    chapters: sampleChapters(5, 4),
  },
];

export const getCourseBySlug = (slug: string): Course | undefined => courses.find((c) => c.slug === slug);

// Student dashboard mock data
export const enrolledCourses = [
  {
    slug: 'painting-with-tako',
    progress: 65,
    lastWatched: 'Lesson 3.2',
    hoursLearned: 6.5,
  },
  {
    slug: 'english-adventures',
    progress: 100,
    lastWatched: 'Completed',
    hoursLearned: 12,
  },
  {
    slug: 'math-quest',
    progress: 25,
    lastWatched: 'Lesson 1.3',
    hoursLearned: 2,
  },
];

export const paymentHistory = [
  { id: 'INV-2026-0089', date: '2026-06-15', courseEn: 'Painting with Tako', courseFa: 'نقاشی با تاکو', amount: 320000, amountLabel: '320,000', status: 'paid', method: 'Zarinpal' },
  { id: 'INV-2026-0042', date: '2026-05-02', courseEn: 'English Adventures', courseFa: 'ماجراجویی انگلیسی', amount: 450000, amountLabel: '450,000', status: 'paid', method: 'Wallet' },
  { id: 'INV-2026-0011', date: '2026-04-18', courseEn: 'Math Quest', courseFa: 'جستجوی ریاضی', amount: 380000, amountLabel: '380,000', status: 'paid', method: 'Zarinpal' },
  { id: 'INV-2026-0003', date: '2026-03-30', courseEn: 'Music Garden (Refunded)', courseFa: 'باغ موسیقی (برگشت خورده)', amount: 290000, amountLabel: '290,000', status: 'refunded', method: 'Wallet' },
];

// Teacher dashboard mock data
export const teacherStats = {
  totalStudents: 1248,
  totalRevenue: 184600000,
  totalRevenueLabel: '184,600,000',
  activeCourses: 6,
  avgRating: 4.8,
};

export const teacherMonthlyRevenue = [
  { month: 'Jan', monthFa: 'ژان', revenue: 12.4 },
  { month: 'Feb', monthFa: 'فور', revenue: 14.8 },
  { month: 'Mar', monthFa: 'مار', revenue: 18.2 },
  { month: 'Apr', monthFa: 'آور', revenue: 16.5 },
  { month: 'May', monthFa: 'ماه', revenue: 22.1 },
  { month: 'Jun', monthFa: 'ژوئ', revenue: 28.7 },
];

export const teacherTopCourses = [
  { slug: 'painting-with-tako', students: 1240, revenue: 39680000, revenueLabel: '39,680,000' },
  { slug: 'english-adventures', students: 2380, revenue: 107100000, revenueLabel: '107,100,000' },
  { slug: 'music-garden', students: 760, revenue: 22040000, revenueLabel: '22,040,000' },
];

// Admin dashboard mock data
export const adminStats = {
  totalUsers: 18420,
  totalRevenue: 1240000000,
  totalRevenueLabel: '1,240,000,000',
  activeCourses: 142,
  completionRate: 78,
};

export const adminUsers = [
  { id: 'u1', nameEn: 'Sara Mohammadi', nameFa: 'سارا محمدی', email: 'sara.m@example.com', roleEn: 'Student', roleFa: 'دانش‌آموز', joined: '2026-04-12', status: 'active' },
  { id: 'u2', nameEn: 'Laleh Karimi', nameFa: 'لاله کریمی', email: 'laleh@example.com', roleEn: 'Teacher', roleFa: 'مدرس', joined: '2025-11-03', status: 'active' },
  { id: 'u3', nameEn: 'Omid Nazari', nameFa: 'امید نظری', email: 'omid.n@example.com', roleEn: 'Teacher', roleFa: 'مدرس', joined: '2025-08-21', status: 'active' },
  { id: 'u4', nameEn: 'Reza Karimi', nameFa: 'رضا کریمی', email: 'reza@example.com', roleEn: 'Student', roleFa: 'دانش‌آموز', joined: '2026-06-01', status: 'suspended' },
  { id: 'u5', nameEn: 'Kimia Rostami', nameFa: 'کیمیا رستمی', email: 'kimia@example.com', roleEn: 'Teacher', roleFa: 'مدرس', joined: '2026-02-14', status: 'active' },
  { id: 'u6', nameEn: 'Maryam Tehrani', nameFa: 'مریم تهرانی', email: 'maryam@example.com', roleEn: 'Student', roleFa: 'دانش‌آموز', joined: '2026-05-20', status: 'active' },
];

export const adminCourses = [
  { slug: 'painting-with-tako', instructorEn: 'Ms. Laleh Karimi', instructorFa: 'خانم لاله کریمی', students: 1240, revenue: 39680000, revenueLabel: '39,680,000', status: 'published' },
  { slug: 'english-adventures', instructorEn: 'Mr. Daniel Ross', instructorFa: 'آقای دانیل راس', students: 2380, revenue: 107100000, revenueLabel: '107,100,000', status: 'published' },
  { slug: 'coding-friends', instructorEn: 'Mr. Omid Nazari', instructorFa: 'آقان امید نظری', students: 540, revenue: 22140000, revenueLabel: '22,140,000', status: 'pending' },
  { slug: 'science-safari', instructorEn: 'Dr. Kimia Rostami', instructorFa: 'دکتر کیمیا رستمی', students: 1120, revenue: 39200000, revenueLabel: '39,200,000', status: 'published' },
];

export const adminMonthlyFinance = [
  { month: 'Jan', monthFa: 'ژان', gross: 84, platform: 21, teacher: 63, refunds: 2, net: 82 },
  { month: 'Feb', monthFa: 'فور', gross: 102, platform: 25.5, teacher: 76.5, refunds: 3, net: 99 },
  { month: 'Mar', monthFa: 'مار', gross: 118, platform: 29.5, teacher: 88.5, refunds: 1.5, net: 116.5 },
  { month: 'Apr', monthFa: 'آور', gross: 96, platform: 24, teacher: 72, refunds: 2.5, net: 93.5 },
  { month: 'May', monthFa: 'ماه', gross: 134, platform: 33.5, teacher: 100.5, refunds: 1, net: 133 },
  { month: 'Jun', monthFa: 'ژوئ', gross: 168, platform: 42, teacher: 126, refunds: 2, net: 166 },
];

// Certificate mock data
export const validCertificates: Record<string, { holderEn: string; holderFa: string; courseEn: string; courseFa: string; issueDate: string; score: number }> = {
  'TKP-2026-00123': {
    holderEn: 'Sara Mohammadi',
    holderFa: 'سارا محمدی',
    courseEn: 'English Adventures',
    courseFa: 'ماجراجویی انگلیسی',
    issueDate: '2026-06-18',
    score: 95,
  },
  'TKP-2026-00045': {
    holderEn: 'Reza Karimi',
    holderFa: 'رضا کریمی',
    courseEn: 'Painting with Tako',
    courseFa: 'نقاشی با تاکو',
    issueDate: '2026-05-12',
    score: 88,
  },
};
