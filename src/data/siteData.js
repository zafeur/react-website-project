import {
  CircleHelp,
  ClipboardList,
  Clock3,
  Gift,
  Home,
  MapPin,
  Phone,
  Settings,
  Shirt,
  Store,
  SquareX,
  User,
  Wallet,
} from 'lucide-react';
import coffeeBeansImage from '../assets/images/coffee-beans.jpg';
import dailyDessertImage from '../assets/images/daily-dessert.jpg';
import galleryDiningImage from '../assets/images/gallery-dining.jpg';
import galleryRestaurantImage from '../assets/images/gallery-restaurant.jpg';
import gallerySaladImage from '../assets/images/gallery-salad.jpg';
import galleryTableImage from '../assets/images/gallery-table.jpg';
import icedAmericanoImage from '../assets/images/iced-americano.jpg';
import restaurantMenuImage from '../assets/images/restaurant-menu.jpg';
import skinCareImage from '../assets/images/skin-care.jpg';
import sunglassesImage from '../assets/images/sunglasses.jpg';
import vrGameImage from '../assets/images/vr-game.jpg';

const getImageSrc = (image) => image?.src || image;

export const navLinks = [
  'صفحه اصلی',
  'هدایا',
  'کسب‌وکارها',
  'فروشگاهی',
  'باشگاه مشتریان',
  'درباره ما',
  'تماس با ما',
];

export const dashboardNavLinks = [
  'صفحه اصلی',
  'سوالات',
  'کسب‌وکارها',
  'فروشگاهی',
  'باشگاه مشتریان',
  'خبرها',
  'تماس با ما',
];

export const tabs = [
  'درباره ما',
  'محصولات و خدمات',
  'هدایا',
  'گالری',
  'نظرات کاربران',
  'موقعیت',
];

export const infoCards = [
  {
    icon: MapPin,
    text: 'کرج، خیابان المهدی، نبش خیابان گل',
  },
  {
    icon: Clock3,
    title: 'ساعات کاری',
    text: '۱۲:۰۰ - ۲۳:۰۰',
  },
  {
    icon: Phone,
    text: '۰۹۱۲ ۲۴۵ ۶۷۸۹',
  },
];

export const gifts = [
  {
    title: 'آیس آمریکانو رایگان',
    place: 'کافه در ملل',
    badge: 'رایگان',
    badgeClass: 'gift-free',
    image: getImageSrc(icedAmericanoImage),
  },
  {
    title: 'دسر روز رایگان',
    place: 'رستوران ملل',
    badge: 'رایگان',
    badgeClass: 'gift-free',
    image: getImageSrc(dailyDessertImage),
  },
  {
    title: '٪۲۰ تخفیف روی کل منو',
    place: 'رستوران ملل',
    badge: 'تخفیف',
    badgeClass: 'gift-discount',
    image: getImageSrc(restaurantMenuImage),
  },
];

export const galleryImages = [
  getImageSrc(galleryDiningImage),
  getImageSrc(gallerySaladImage),
  getImageSrc(galleryTableImage),
  getImageSrc(galleryRestaurantImage),
];

export const stars = Array.from({ length: 5 });

export const businessProfiles = [
  {
    id: 'melal',
    slug: 'melal',
    aliases: ['restaurant', 'رستوران ملل', 'ملل'],
    title: 'رستوران ملل',
    shortTitle: 'ملل',
    logoText: 'ملل',
    logoSmall: 'RESTAURANT',
    category: 'رستوران',
    specialty: 'غذاهای ایرانی',
    rating: '۴.۸',
    votes: '۲۳۴ رای',
    image: '/home/img/restaurant-melal.png',
    walletBalance: 0,
    walletBalanceLabel: '۰ تومان',
    walletStatus: 'هنوز کیف پول این مجموعه شارژ نشده',
    points: '۰ امتیاز',
    description: 'رستوران ملل با بیش از ۱۰ سال تجربه در ارائه بهترین غذاهای ایرانی، دریایی و فرنگی، در فضایی دلنشین و صمیمی آماده پذیرایی از شما عزیزان است.',
  },
  {
    id: 'ibamo',
    slug: 'ibamo',
    aliases: ['ایبامو'],
    title: 'ایبامو',
    shortTitle: 'ایبامو',
    category: 'فروشگاه',
    specialty: 'پوشاک خانواده',
    rating: '۴.۷',
    votes: '۱۸۹ رای',
    image: '/home/img/logo ibamo.jpg',
    walletBalance: 300000,
    walletBalanceLabel: '۳۰۰,۰۰۰ تومان',
    walletStatus: 'قابل استفاده در ایبامو',
    discountCode: 'IBAMO72WDBU',
    points: '۱۲,۴۰۰ امتیاز',
    description: 'ایبامو مجموعه پوشاک خانواده است و اعتبار کیف پول کاربر فقط برای خرید از همین مجموعه نمایش داده می‌شود.',
  },
  {
    id: 'mojalal',
    slug: 'mojalal',
    aliases: ['مجلل'],
    title: 'مجلل',
    shortTitle: 'مجلل',
    category: 'کافه و رستوران',
    specialty: 'کافه و رستوران',
    rating: '۴.۹',
    votes: '۲۱۱ رای',
    image: '/home/img/mojalal.jpg',
    walletBalance: 180000,
    walletBalanceLabel: '۱۸۰,۰۰۰ تومان',
    walletStatus: 'قابل استفاده در مجلل',
    points: '۹,۸۰۰ امتیاز',
    description: 'مجلل یک مجموعه کافه و رستوران است و کیف پول کاربر برای همین مجموعه به صورت جداگانه بررسی می‌شود.',
  },
  {
    id: 'bastani',
    slug: 'bastani',
    aliases: ['باستانی'],
    title: 'باستانی',
    shortTitle: 'باستانی',
    category: 'سالن زیبایی',
    specialty: 'زیبایی',
    rating: '۴.۶',
    votes: '۱۵۶ رای',
    image: '/home/img/logo bastani.jpg',
    walletBalance: 120000,
    walletBalanceLabel: '۱۲۰,۰۰۰ تومان',
    walletStatus: 'قابل استفاده در باستانی',
    points: '۷,۳۰۰ امتیاز',
    description: 'باستانی یک مجموعه زیبایی است و اعتبار کیف پول کاربر فقط برای خدمات همین مجموعه نمایش داده می‌شود.',
  },
  {
    id: 'bakhshi',
    slug: 'bakhshi',
    aliases: ['بخشی'],
    title: 'بخشی',
    shortTitle: 'بخشی',
    category: 'فروشگاهی',
    specialty: 'فروشگاه زنجیره‌ای',
    rating: '۴.۵',
    votes: '۱۴۸ رای',
    image: '/home/img/bakhshi.jpg',
    walletBalance: 90000,
    walletBalanceLabel: '۹۰,۰۰۰ تومان',
    walletStatus: 'قابل استفاده در بخشی',
    points: '۵,۶۰۰ امتیاز',
    description: 'بخشی یک مجموعه فروشگاهی است و شارژ کیف پول کاربر برای خرید از همین مجموعه محاسبه می‌شود.',
  },
  {
    id: 'barial',
    slug: 'barial',
    aliases: ['باریال', 'بریال'],
    title: 'باریال',
    shortTitle: 'باریال',
    category: 'پزشکی زیبایی',
    specialty: 'خدمات زیبایی',
    rating: '۴.۴',
    votes: '۱۲۰ رای',
    image: '/home/img/barial.jpg',
    walletBalance: 0,
    walletBalanceLabel: '۰ تومان',
    walletStatus: 'هنوز شارژ نشده',
    points: '۰ امتیاز',
    description: 'باریال یک مجموعه پزشکی زیبایی است و اگر کیف پول کاربر برای این مجموعه شارژ شود، همینجا نمایش داده می‌شود.',
  },
  {
    id: 'dorato',
    slug: 'dorato',
    aliases: ['دوراتو'],
    title: 'دوراتو',
    shortTitle: 'دوراتو',
    category: 'سرگرمی',
    specialty: 'شهربازی و هیجان',
    rating: '۴.۶',
    votes: '۱۷۲ رای',
    image: '/home/img/logo dorato.jpg',
    walletBalance: 75000,
    walletBalanceLabel: '۷۵,۰۰۰ تومان',
    walletStatus: 'قابل استفاده در دوراتو',
    points: '۴,۹۰۰ امتیاز',
    description: 'دوراتو مجموعه بازی و سرگرمی است و کیف پول کاربر برای خرید و استفاده از خدمات همین مجموعه بررسی می‌شود.',
  },
];

export const dashboardActions = [
  { title: 'اطلاعات حساب', icon: User },
  { title: 'کد معرف', icon: SquareX },
  { title: 'کیف پول', icon: Wallet },
  { title: 'فرآیندها', icon: ClipboardList },
  { title: 'هدیه‌های من', icon: Gift },
];

export const mobileProfileLinks = [
  { title: 'هدیه‌های من', icon: Gift },
  { title: 'فرایندها و کش‌بک‌ها', icon: Shirt },
  { title: 'کیف پول', icon: Wallet },
  { title: 'کد معرف', icon: SquareX },
  { title: 'تنظیمات', icon: Settings },
  { title: 'پشتیبانی و سوالات متداول', icon: CircleHelp },
];

export const mobileBottomNav = [
  { id: 'home', title: 'پیشخوان', icon: Home },
  { id: 'shop', title: 'فروشگاهی', icon: Store },
  { id: 'gifts', title: 'هدایا', icon: Gift },
  { id: 'faq', title: '\u0633\u0648\u0627\u0644\u0627\u062a', icon: CircleHelp },
  { id: 'account', title: 'حساب', icon: User },
];

export const activeGifts = [
  { title: 'یک بازی VR رایگان', place: 'VR Game', time: 'تا ۳ روز دیگر', image: getImageSrc(vrGameImage) },
  { title: 'پاکسازی پوست رایگان', place: 'ماندیا', time: 'تا ۱۰ روز دیگر', image: getImageSrc(skinCareImage) },
  { title: 'عینک آفتابی رایگان', place: 'بریلان', time: 'تا ۵ روز دیگر', image: getImageSrc(sunglassesImage) },
  { title: 'آیس آمریکانو رایگان', place: 'کافه چی', time: 'تا ۲ روز دیگر', image: getImageSrc(icedAmericanoImage) },
];

export const giftHistory = [
  { title: '٪۰ تخفیف رستوران ملل', date: 'استفاده شده در ۱۴۰۳/۰۲/۱۵', image: getImageSrc(restaurantMenuImage) },
  { title: 'دسر روز رایگان', date: 'استفاده شده در ۱۴۰۳/۰۱/۲۸', image: getImageSrc(dailyDessertImage) },
  { title: 'قهوه رایگان', date: 'استفاده شده در ۱۴۰۲/۱۲/۰۵', image: getImageSrc(coffeeBeansImage) },
];

export const stats = [
  { label: 'هدیه‌های دریافت شده', value: '۲۳' },
  { label: 'امتیاز کل', value: '۲۸,۵۰۰' },
  { label: 'هدیه استفاده شده', value: '۱۶' },
];
export const businessWallets = [
  {
    id: 'ibamo',
    title: 'ایبامو',
    balance: 300000,
    balanceLabel: '۳۰۰,۰۰۰ تومان',
    status: 'قابل استفاده در ایبامو',
    image: '/home/img/logo ibamo.jpg',
  },
  {
    id: 'mojalal',
    title: 'مجلل',
    balance: 180000,
    balanceLabel: '۱۸۰,۰۰۰ تومان',
    status: 'قابل استفاده در مجلل',
    image: '/home/img/mojalal.jpg',
  },
  {
    id: 'bastani',
    title: 'باستانی',
    balance: 120000,
    balanceLabel: '۱۲۰,۰۰۰ تومان',
    status: 'قابل استفاده در باستانی',
    image: '/home/img/logo bastani.jpg',
  },
  {
    id: 'bakhshi',
    title: 'بخشی',
    balance: 90000,
    balanceLabel: '۹۰,۰۰۰ تومان',
    status: 'قابل استفاده در بخشی',
    image: '/home/img/bakhshi.jpg',
  },
  {
    id: 'barial',
    title: 'باریال',
    balance: 0,
    balanceLabel: '۰ تومان',
    status: 'هنوز شارژ نشده',
    image: '/home/img/barial.jpg',
  },
  {
    id: 'dorato',
    title: 'دوراتو',
    balance: 75000,
    balanceLabel: '۷۵,۰۰۰ تومان',
    status: 'قابل استفاده در دوراتو',
    image: '/home/img/logo dorato.jpg',
  },
];

export const walletTransactions = [
  { business: 'ایبامو', type: 'شارژ کیف پول', amount: '+۳۰۰,۰۰۰ تومان', date: '۱۴۰۳/۰۳/۲۵' },
  { business: 'مجلل', type: 'استفاده برای خرید', amount: '-۴۵,۰۰۰ تومان', date: '۱۴۰۳/۰۳/۲۱' },
  { business: 'باستانی', type: 'شارژ کیف پول', amount: '+۱۲۰,۰۰۰ تومان', date: '۱۴۰۳/۰۳/۱۸' },
  { business: 'دوراتو', type: 'شارژ کیف پول', amount: '+۷۵,۰۰۰ تومان', date: '۱۴۰۳/۰۳/۱۰' },
];




