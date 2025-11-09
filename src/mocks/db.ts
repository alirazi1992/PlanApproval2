import { Project, Document, Comment, Meeting } from '../features/projects/types';

export const mockAvatars = [
  {
    id: '1',
    name: 'کاربر ۱',
    avatar: 'https://i.pravatar.cc/150?img=1',
    count: 3,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'کاربر ۲',
    avatar: 'https://i.pravatar.cc/150?img=2',
    count: 0,
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'کاربر ۳',
    avatar: 'https://i.pravatar.cc/150?img=3',
    count: 5,
    color: 'bg-red-500'
  },
  {
    id: '4',
    name: 'کاربر ۴',
    avatar: 'https://i.pravatar.cc/150?img=4',
    count: 2,
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'کاربر ۵',
    avatar: 'https://i.pravatar.cc/150?img=5',
    count: 0,
    color: 'bg-purple-500'
  },
  {
    id: '6',
    name: 'کاربر ۶',
    avatar: 'https://i.pravatar.cc/150?img=6',
    count: 8,
    color: 'bg-red-500'
  },
  {
    id: '7',
    name: 'کاربر ۷',
    avatar: 'https://i.pravatar.cc/150?img=7',
    count: 0,
    color: 'bg-yellow-500'
  },
  {
    id: '8',
    name: 'کاربر ۸',
    avatar: 'https://i.pravatar.cc/150?img=8',
    count: 4,
    color: 'bg-sky-500'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'سامانه ورود مشتری',
    status: 'active',
    date: '۱۴۰۲/۱۰/۲۵',
    owner: 'سارا جعفری',
    progress: 75
  },
  {
    id: '2',
    name: 'یکپارچه‌سازی درگاه پرداخت',
    status: 'active',
    date: '۱۴۰۲/۱۱/۰۱',
    owner: 'مهدی چن',
    progress: 60
  },
  {
    id: '3',
    name: 'بازطراحی اپلیکیشن موبایل',
    status: 'pending',
    date: '۱۴۰۲/۱۱/۱۲',
    owner: 'الهام نادری',
    progress: 30
  },
  {
    id: '4',
    name: 'مستندات API نسل بعد',
    status: 'completed',
    date: '۱۴۰۲/۱۰/۲۰',
    owner: 'حسین سمیعی',
    progress: 100
  },
  {
    id: '5',
    name: 'ممیزی امنیتی سراسری',
    status: 'active',
    date: '۱۴۰۲/۱۱/۰۵',
    owner: 'لیلا وانگ',
    progress: 45
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'طرح پیشنهادی.pdf',
    type: 'PDF',
    size: '۲.۴ مگابایت',
    uploadedAt: '۱۴۰۲/۱۰/۲۵',
    uploadedBy: 'سارا جعفری'
  },
  {
    id: '2',
    name: 'مشخصات فنی.docx',
    type: 'DOCX',
    size: '۱.۸ مگابایت',
    uploadedAt: '۱۴۰۲/۱۰/۲۶',
    uploadedBy: 'مهدی چن'
  },
  {
    id: '3',
    name: 'نمونه طراحی.fig',
    type: 'Figma',
    size: '۵.۲ مگابایت',
    uploadedAt: '۱۴۰۲/۱۰/۲۸',
    uploadedBy: 'الهام نادری'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'سارا جعفری',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'پیشرفت پروژه عالی بوده، همین ریتم را حفظ کنیم.',
    timestamp: '۲ ساعت پیش'
  },
  {
    id: '2',
    author: 'مهدی چن',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'برای مستندات API چند سؤال دارم، لطفاً جلسه هماهنگ شود.',
    timestamp: '۵ ساعت پیش'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'جلسه آغاز پروژه',
    date: '۱۴۰۲/۱۱/۰۱',
    time: '۱۰:۰۰',
    attendees: ['سارا', 'مهدی', 'الهام']
  },
  {
    id: '2',
    title: 'بازبینی اسپرینت',
    date: '۱۴۰۲/۱۱/۰۵',
    time: '۱۴:۰۰',
    attendees: ['سارا', 'حسین', 'لیلا']
  }
];
