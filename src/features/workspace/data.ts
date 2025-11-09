import { Island } from '../projects/types';
import {
  WorkspaceSnapshot,
  WorkspaceTab,
  WorkspaceTabId
} from './types';

const avatar = (id: number) =>
  `https://i.pravatar.cc/150?img=${((id - 1) % 70) + 1}`;

const createIsland = (
  id: string,
  title: string,
  variant: 'light' | 'dark',
  tasks: Array<{
    id: string;
    title: string;
    subtitle?: string;
    avatarIndex: number;
    hasMenu?: boolean;
    hasCheck?: boolean;
    hasCalendar?: boolean;
  }>
): Island => ({
  id,
  title,
  variant,
  position: { x: 0, y: 0 },
  tasks: tasks.map((task, order) => ({
    id: `${id}-${task.id}`,
    title: task.title,
    subtitle: task.subtitle,
    avatar: avatar(task.avatarIndex),
    islandId: id,
    order,
    hasMenu: task.hasMenu ?? true,
    hasCheck: task.hasCheck,
    hasCalendar: task.hasCalendar
  }))
});

const casesIslands: Island[] = [
  createIsland('issue-identification', 'تشخیص مسئله', 'light', [
    { id: 'category', title: 'تعیین دسته‌بندی مشکل', avatarIndex: 1, hasCheck: true },
    { id: 'severity', title: 'ارزیابی شدت مسئله', avatarIndex: 2, hasCheck: true },
    { id: 'impact', title: 'بررسی اثر بر مشتری', avatarIndex: 3, hasCalendar: true },
    { id: 'allocate', title: 'ارجاع به تیم حل مسئله', avatarIndex: 4 },
    { id: 'advise', title: 'اعلام برآورد اولیه به مشتری', avatarIndex: 5 }
  ]),
  createIsland('technical-resolution', 'حل فنی', 'light', [
    { id: 'dependencies', title: 'شناسایی وابستگی‌ها', subtitle: 'در حال انجام', avatarIndex: 6, hasMenu: false },
    { id: 'resolution', title: 'انتخاب راهکار فنی', avatarIndex: 7, hasMenu: false },
    { id: 'estimate', title: 'برآورد زمان رفع', avatarIndex: 8 },
    { id: 'notify-estimate', title: 'به‌روزرسانی مشتری از ETA', avatarIndex: 9 },
    { id: 'confirm', title: 'تأیید کیفیت با تیم تضمین', avatarIndex: 10 }
  ]),
  createIsland('request-processing', 'پردازش درخواست', 'dark', [
    { id: 'problem', title: 'رفع ریشه‌ای مشکل', avatarIndex: 11 },
    { id: 'communication', title: 'ارتباط با مشتری', avatarIndex: 12 },
    { id: 'testing', title: 'آزمون و اعتبارسنجی', avatarIndex: 13 },
    { id: 'notification', title: 'اطلاع‌رسانی نهایی', avatarIndex: 14 },
    { id: 'satisfaction', title: 'سنجش رضایت مشتری', avatarIndex: 15 }
  ])
];

const relationshipIslands: Island[] = [
  createIsland('account-health', 'سلامت حساب', 'light', [
    { id: 'pulse', title: 'نبض هفتگی موفقیت', subtitle: 'نیازمند پیگیری', avatarIndex: 16, hasCheck: true },
    { id: 'champions', title: 'شناسایی حامیان جدید', avatarIndex: 17 },
    { id: 'advocacy', title: 'ثبت داستان‌های موفقیت', avatarIndex: 18 },
    { id: 'success-plan', title: 'به‌روزرسانی طرح موفقیت', avatarIndex: 19 },
    { id: 'exec', title: 'آماده‌سازی جلسه مدیران', avatarIndex: 20 }
  ]),
  createIsland('engagement', 'تعامل هدفمند', 'light', [
    { id: 'touchpoints', title: 'تعریف نقاط تماس مرور فصلی', avatarIndex: 21, hasMenu: false },
    { id: 'adoption', title: 'شناسایی شکاف‌های پذیرش', avatarIndex: 22 },
    { id: 'education', title: 'زمان‌بندی آموزش مشتری', avatarIndex: 23, hasCalendar: true },
    { id: 'story', title: 'اشتراک داستان نقشه‌راه', avatarIndex: 24 },
    { id: 'feedback', title: 'جمع‌آوری بازخورد محصول', avatarIndex: 25 }
  ]),
  createIsland('escalation', 'مسیر تشدید', 'dark', [
    { id: 'signals', title: 'رصد سیگنال‌های ریسک', avatarIndex: 26 },
    { id: 'alignment', title: 'هم‌راستایی داخلی', avatarIndex: 27 },
    { id: 'exec-brief', title: 'گزارش برای مدیران ارشد', avatarIndex: 28 },
    { id: 'action', title: 'بررسی برنامه اقدام', avatarIndex: 29 },
    { id: 'closure', title: 'جمع‌بندی و درس‌آموخته', avatarIndex: 30 }
  ])
];

const opportunitiesIslands: Island[] = [
  createIsland('discovery', 'ورود درخواست', 'light', [
    { id: 'triage', title: 'اولویت‌بندی ورودی‌ها', avatarIndex: 31, hasCheck: true },
    { id: 'goals', title: 'شفاف‌سازی اهداف پروژه', avatarIndex: 32 },
    { id: 'stakeholders', title: 'نقشه ذی‌نفعان', avatarIndex: 33 },
    { id: 'constraints', title: 'ثبت محدودیت‌ها', avatarIndex: 34 },
    { id: 'timeline', title: 'هم‌راستایی بر سر زمان‌بندی', avatarIndex: 35 }
  ]),
  createIsland('solution', 'طراحی راهکار', 'light', [
    { id: 'workshop', title: 'برگزاری کارگاه راهکار', avatarIndex: 36, hasCalendar: true },
    { id: 'prototype', title: 'نمونه‌سازی جریان اصلی', avatarIndex: 37 },
    { id: 'estimate', title: 'برآورد اجرا', avatarIndex: 38 },
    { id: 'dependencies', title: 'علامت‌گذاری وابستگی‌ها', avatarIndex: 39 },
    { id: 'review', title: 'بازبینی داخلی', avatarIndex: 40 }
  ]),
  createIsland('commercial', 'هماهنگی تجاری', 'dark', [
    { id: 'pricing', title: 'تهیه مدل قیمت‌گذاری', avatarIndex: 41 },
    { id: 'approvals', title: 'دریافت تأییدیه‌ها', avatarIndex: 42 },
    { id: 'proposal', title: 'ارسال پیشنهاد بومی‌سازی‌شده', avatarIndex: 43 },
    { id: 'negotiation', title: 'دور مذاکره', avatarIndex: 44 },
    { id: 'signature', title: 'هدف‌گذاری امضا', avatarIndex: 45 }
  ])
];

const leadsIslands: Island[] = [
  createIsland('inbound', 'صف ورودی', 'light', [
    { id: 'capture', title: 'ثبت کانال و زمینه', avatarIndex: 46 },
    { id: 'dedupe', title: 'حذف رکورد تکراری', avatarIndex: 47, hasCheck: true },
    { id: 'assign', title: 'اختصاص مالک', avatarIndex: 48 },
    { id: 'respond', title: 'بررسی پاسخ خودکار', avatarIndex: 49 },
    { id: 'nurture', title: 'ورود به کمپین پرورش', avatarIndex: 50 }
  ]),
  createIsland('qualification', 'پالایش سرنخ', 'light', [
    { id: 'meet', title: 'تماس اکتشافی', avatarIndex: 51 },
    { id: 'budget', title: 'تأیید بودجه', avatarIndex: 52 },
    { id: 'authority', title: 'تشخیص تصمیم‌گیرنده', avatarIndex: 53 },
    { id: 'needs', title: 'مستندسازی نیازها', avatarIndex: 54 },
    { id: 'timeline', title: 'تثبیت بازه زمانی', avatarIndex: 55 }
  ]),
  createIsland('handoff', 'تحویل به فروش', 'dark', [
    { id: 'package', title: 'جمع‌بندی یافته‌ها', avatarIndex: 56 },
    { id: 'brief', title: 'جلسه توجیهی با AE', avatarIndex: 57 },
    { id: 'invite', title: 'دعوت از متخصصان', avatarIndex: 58 },
    { id: 'sync', title: 'هم‌راستایی داخلی', avatarIndex: 59 },
    { id: 'kickoff', title: 'تنظیم جلسه آغازین', avatarIndex: 60 }
  ])
];

const calendarIslands: Island[] = [
  createIsland('events', 'رویدادهای پیش‌رو', 'light', [
    { id: 'sync', title: 'هماهنگی مشتری (اروپا)', avatarIndex: 61, hasCalendar: true },
    { id: 'design', title: 'تحویل طراحی', avatarIndex: 62 },
    { id: 'advisory', title: 'آمادگی هیئت مشاور', avatarIndex: 63 },
    { id: 'office-hours', title: 'ساعت اداری باز', avatarIndex: 64 },
    { id: 'retro', title: 'رترو فصلی', avatarIndex: 65 }
  ]),
  createIsland('workshops', 'کارگاه‌ها', 'light', [
    { id: 'scope', title: 'مرور دامنه', avatarIndex: 66 },
    { id: 'enablement', title: 'سری توانمندسازی', avatarIndex: 67 },
    { id: 'onsite', title: 'لجستیک حضور در محل', avatarIndex: 68 },
    { id: 'briefing', title: 'بریف مدیران', avatarIndex: 69 },
    { id: 'followup', title: 'بسته پیگیری', avatarIndex: 70 }
  ]),
  createIsland('tasks', 'بازدیدهای میدانی', 'dark', [
    { id: 'travel', title: 'تأیید سفر', avatarIndex: 71 },
    { id: 'itinerary', title: 'اشتراک برنامه سفر', avatarIndex: 72 },
    { id: 'demos', title: 'آماده‌سازی دمو', avatarIndex: 73 },
    { id: 'recap', title: 'گزارش بازدید', avatarIndex: 74 },
    { id: 'insights', title: 'انتشار بینش‌ها', avatarIndex: 75 }
  ])
];

const reportsIslands: Island[] = [
  createIsland('data', 'جمع‌آوری داده', 'light', [
    { id: 'sources', title: 'به‌روزرسانی منابع داده', avatarIndex: 76 },
    { id: 'quality', title: 'کنترل کیفیت', avatarIndex: 77 },
    { id: 'benchmarks', title: 'اعمال بنچمارک', avatarIndex: 78 },
    { id: 'signals', title: 'شناسایی ناهنجاری', avatarIndex: 79 },
    { id: 'snapshot', title: 'ثبت خروجی نهایی', avatarIndex: 80 }
  ]),
  createIsland('story', 'ساخت روایت', 'light', [
    { id: 'insights', title: 'نگارش بینش‌های کلیدی', avatarIndex: 81 },
    { id: 'visuals', title: 'طراحی بصری', avatarIndex: 82 },
    { id: 'narrative', title: 'چکیده داستان', avatarIndex: 83 },
    { id: 'review', title: 'بازبینی همتا', avatarIndex: 84 },
    { id: 'dryrun', title: 'اجرای آزمایشی', avatarIndex: 85 }
  ]),
  createIsland('exec', 'بررسی مدیران', 'dark', [
    { id: 'pack', title: 'نهایی‌سازی دک', avatarIndex: 86 },
    { id: 'brief', title: 'توجیه ارائه‌دهندگان', avatarIndex: 87 },
    { id: 'questions', title: 'پیش‌بینی سؤالات', avatarIndex: 88 },
    { id: 'delivery', title: 'تمرین ارائه', avatarIndex: 89 },
    { id: 'signoff', title: 'تأیید و توزیع', avatarIndex: 90 }
  ])
];

const quotesIslands: Island[] = [
  createIsland('intake', 'دریافت قیمت‌گذاری', 'light', [
    { id: 'capture', title: 'ثبت دامنه و یادداشت‌ها', avatarIndex: 91 },
    { id: 'tiers', title: 'تطبیق سطح قیمت', avatarIndex: 92 },
    { id: 'usage', title: 'مدل‌سازی مصرف', avatarIndex: 93 },
    { id: 'discount', title: 'درخواست تخفیف', avatarIndex: 94 },
    { id: 'contracts', title: 'علامت‌گذاری شروط قرارداد', avatarIndex: 95 }
  ]),
  createIsland('approval', 'تأییدها', 'light', [
    { id: 'review', title: 'بازبینی مالی', avatarIndex: 96 },
    { id: 'legal', title: 'ایست بازرسی حقوقی', avatarIndex: 97 },
    { id: 'leadership', title: 'تأیید مدیریت ارشد', avatarIndex: 98 },
    { id: 'edits', title: 'اعمال اصلاحات', avatarIndex: 99 },
    { id: 'final', title: 'تولید پیشنهاد نهایی', avatarIndex: 23 }
  ]),
  createIsland('handoff', 'تحویل به مشتری', 'dark', [
    { id: 'package', title: 'بسته‌بندی مستندات', avatarIndex: 24 },
    { id: 'walkthrough', title: 'زمان‌بندی جلسه توضیح', avatarIndex: 25 },
    { id: 'signature', title: 'پیگیری امضا', avatarIndex: 26 },
    { id: 'celebrate', title: 'جشن موفقیت', avatarIndex: 27 },
    { id: 'transition', title: 'انتقال به تیم استقرار', avatarIndex: 28 }
  ])
];

export const workspaceTabs: WorkspaceTab[] = [
  {
    id: 'relationship',
    label: 'روابط',
    description: 'سلامت حساب‌های کلیدی را پایش کنید',
    accent: 'from-rose-100 via-white to-white/50'
  },
  {
    id: 'opportunities',
    label: 'فرصت‌ها',
    description: 'روایت راهکار را شکل دهید',
    accent: 'from-amber-100 via-white to-white/60'
  },
  {
    id: 'leads',
    label: 'سرنخ‌ها',
    description: 'ورودی‌ها را سریع پالایش کنید',
    accent: 'from-sky-100 via-white to-white/60'
  },
  {
    id: 'calendar',
    label: 'تقویم',
    description: 'آیین‌ها و رویدادها را هماهنگ کنید',
    accent: 'from-violet-100 via-white to-white/60'
  },
  {
    id: 'cases',
    label: 'پرونده‌ها',
    description: 'سفرهای پشتیبانی مشتری',
    accent: 'from-gray-50 via-white to-white/60'
  },
  {
    id: 'reports',
    label: 'گزارش‌ها',
    description: 'تحلیل و ارتباطات مدیریتی',
    accent: 'from-indigo-100 via-white to-white/60'
  },
  {
    id: 'quotes',
    label: 'پیشنهاد قیمت',
    description: 'هماهنگی قیمت و تأییدها',
    accent: 'from-emerald-100 via-white to-white/60'
  }
];

export const workspaceSnapshots: Record<WorkspaceTabId, WorkspaceSnapshot> = {
  relationship: {
    id: 'relationship',
    headline: 'بازی‌نامه روابط استراتژیک',
    subline: 'پیش از جلسات مدیران، نبض احساس مشتریان را در دست بگیرید.',
    priority: 'رویداد پیش‌رو: مرور کسب‌وکار فصلی – ۱۸ آبان',
    islands: relationshipIslands,
    metrics: [
      { id: 'rel-health', label: 'حساب‌های سالم', value: '۱۲', trend: { value: '+۳ این هفته', isPositive: true } },
      { id: 'rel-risk', label: 'در معرض ریسک', value: '۲', trend: { value: 'بدون تغییر', isPositive: true } },
      { id: 'rel-qbr', label: 'پوشش QBR', value: '۸۶%', trend: { value: '+۴ واحد', isPositive: true } }
    ],
    reminders: [
      { id: 'rel-1', title: 'ارسال دک خلاصه برای بانک آرورا', owner: 'نوح', due: 'امروز ۱۵:۰۰' },
      { id: 'rel-2', title: 'تأیید سخنرانان رویداد سلامت', owner: 'لیا', due: 'فردا' }
    ]
  },
  opportunities: {
    id: 'opportunities',
    headline: 'استودیوی فرصت‌ها',
    subline: 'یادداشت‌های اکتشافی را به روایت راهکار تبدیل کنید.',
    priority: 'اولویت بالا: بازطراحی Beta Cloud',
    islands: opportunitiesIslands,
    metrics: [
      { id: 'opp-active', label: 'فرصت‌های فعال', value: '۸', trend: { value: '+۱ جدید', isPositive: true } },
      { id: 'opp-stage', label: 'میانگین زمان مرحله', value: '۱۱ روز', trend: { value: '-۲ روز نسبت به هدف', isPositive: true } },
      { id: 'opp-rate', label: 'نرخ برد', value: '۴۲%', trend: { value: '+۵ واحد', isPositive: true } }
    ],
    reminders: [
      { id: 'opp-1', title: 'آماده‌سازی کارگاه طراحی برای Northwind', owner: 'آوا', due: 'پنجشنبه ۱۰:۰۰' },
      { id: 'opp-2', title: 'تأیید مدیریتی دامنه Beta Cloud', owner: 'عمر', due: 'جمعه' }
    ]
  },
  leads: {
    id: 'leads',
    headline: 'کارخانه سرنخ',
    subline: 'SLA پالایش و تحویل را کنترل کنید.',
    priority: 'تمرکز: کاهش زمان صف به کمتر از ۲ ساعت',
    islands: leadsIslands,
    metrics: [
      { id: 'leads-fresh', label: 'سرنخ‌های امروز', value: '۵۴', trend: { value: '+۸ نسبت به میانگین', isPositive: false } },
      { id: 'leads-sla', label: 'ریسک نقض SLA', value: '۶', trend: { value: '-۳', isPositive: true } },
      { id: 'leads-conv', label: 'تبدیل به فرصت', value: '۲۷%', trend: { value: '+۲ واحد', isPositive: true } }
    ],
    reminders: [
      { id: 'leads-1', title: 'بازتوزیع صف APAC در غیاب گریز', owner: 'مایا', due: '۳۰ دقیقه دیگر' },
      { id: 'leads-2', title: 'انتشار گزارش کیفیت سرنخ هفتگی', owner: 'لیو', due: 'امروز' }
    ]
  },
  calendar: {
    id: 'calendar',
    headline: 'تقویم و آیین‌ها',
    subline: 'کارگاه‌ها، بازدیدها و برنامه‌های توانمندسازی را هم‌راستا کنید.',
    priority: 'رویداد کلیدی بعدی: روز میدانی پلتفرم – ۱۱ آذر',
    islands: calendarIslands,
    metrics: [
      { id: 'cal-events', label: 'رویدادهای این هفته', value: '۱۱', trend: { value: '+۲ نسبت به برنامه', isPositive: false } },
      { id: 'cal-onsite', label: 'بازدیدهای قطعی', value: '۴', trend: { value: 'پایدار', isPositive: true } },
      { id: 'cal-capacity', label: 'ظرفیت تیم', value: '۷۴%', trend: { value: '-۶ واحد', isPositive: false } }
    ],
    reminders: [
      { id: 'cal-1', title: 'ارسال چک‌لیست لجستیک برلین', owner: 'جان', due: 'فردا' },
      { id: 'cal-2', title: 'تأیید تسهیل‌گران توانمندسازی', owner: 'رها', due: 'جمعه ۱۳:۰۰' }
    ]
  },
  cases: {
    id: 'cases',
    headline: 'میز مدیریت پرونده‌های جدید',
    subline: 'از تشخیص تا حل فنی و ارتباطات را دنبال کنید.',
    priority: 'لیست پایش: عقب‌ماندگی پردازش درخواست‌ها',
    islands: casesIslands,
    metrics: [
      { id: 'cases-active', label: 'پرونده‌های فعال', value: '۱۸', trend: { value: '-۳ مورد حل شده', isPositive: true } },
      { id: 'cases-risk', label: 'پرونده در ریسک SLA', value: '۵', trend: { value: '+۲ نسبت به هفته قبل', isPositive: false } },
      { id: 'cases-nps', label: 'اثر بر NPS مشتری', value: '-۱۲%', trend: { value: 'پایدار شده', isPositive: true } }
    ],
    reminders: [
      { id: 'cases-1', title: 'نیاز به ETA برای شرکت دلتا', owner: 'سارا', due: '۲ ساعت دیگر' },
      { id: 'cases-2', title: 'تأیید QA برای رفع مشکل FinCorp', owner: 'الکس', due: 'امروز ۱۷:۰۰' }
    ]
  },
  reports: {
    id: 'reports',
    headline: 'استودیوی گزارش‌دهی',
    subline: 'داده‌ها را به پیام مدیریتی تبدیل کنید.',
    priority: 'تحویل بسته عملکرد فصل چهارم تا ۲۵ آبان',
    islands: reportsIslands,
    metrics: [
      { id: 'rep-drafts', label: 'پیش‌نویس‌های در صف بازبینی', value: '۶', trend: { value: '+۱', isPositive: false } },
      { id: 'rep-accuracy', label: 'دقت داده', value: '۹۹.۱%', trend: { value: '+۰.۴ واحد', isPositive: true } },
      { id: 'rep-consumption', label: 'نرخ مطالعه گزارش', value: '۶۷%', trend: { value: '+۵ واحد', isPositive: true } }
    ],
    reminders: [
      { id: 'rep-1', title: 'همگام‌سازی با تیم علم داده درباره ناهنجاری', owner: 'اُمـا', due: 'امروز ۱۶:۰۰' },
      { id: 'rep-2', title: 'تنظیم تمرین ارائه با مدیران', owner: 'کالب', due: 'پنجشنبه' }
    ]
  },
  quotes: {
    id: 'quotes',
    headline: 'میز پیشنهاد قیمت',
    subline: 'تجاری‌سازی، تأییدها و تحویل به مشتری را سینک کنید.',
    priority: 'تسریع پیشنهاد توسعه FastTrack',
    islands: quotesIslands,
    metrics: [
      { id: 'quotes-open', label: 'پیشنهادهای باز', value: '۹', trend: { value: '-۲', isPositive: true } },
      { id: 'quotes-cycle', label: 'میانگین چرخه', value: '۳.۴ روز', trend: { value: '-۰.۸ روز', isPositive: true } },
      { id: 'quotes-discounts', label: 'میانگین تخفیف', value: '۷%', trend: { value: '+۱ واحد', isPositive: false } }
    ],
    reminders: [
      { id: 'quotes-1', title: 'اعمال اصلاحات حقوقی برای Stellar Freight', owner: 'تیم', due: 'امروز' },
      { id: 'quotes-2', title: 'تعیین زمان استقرار پس از امضا', owner: 'میلا', due: 'فردا' }
    ]
  }
};

const cloneIslands = (islands: Island[]) =>
  islands.map(island => ({
    ...island,
    tasks: island.tasks.map(task => ({ ...task }))
  }));

export const createInitialJourneyState = (): Record<WorkspaceTabId, Island[]> =>
  Object.entries(workspaceSnapshots).reduce((acc, [key, snapshot]) => {
    acc[key as WorkspaceTabId] = cloneIslands(snapshot.islands);
    return acc;
  }, {} as Record<WorkspaceTabId, Island[]>);

export const getSnapshotIslands = (id: WorkspaceTabId): Island[] =>
  cloneIslands(workspaceSnapshots[id].islands);
