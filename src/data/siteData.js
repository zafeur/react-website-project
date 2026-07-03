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
  { id: 'club', title: 'باشگاه مشتریان', icon: Gift },
  { id: 'shop', title: 'فروشگاهی', icon: MapPin },
  { id: 'gifts', title: 'هدایا', icon: Gift },
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

