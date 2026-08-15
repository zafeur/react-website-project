import {
  CircleHelp,
  ClipboardList,
  Clock3,
  Gift,
  Home,
  MapPin,
  Phone,
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

const windows1252Bytes = {
  '\u20ac': 0x80,
  '\u201a': 0x82,
  '\u0192': 0x83,
  '\u201e': 0x84,
  '\u2026': 0x85,
  '\u2020': 0x86,
  '\u2021': 0x87,
  '\u02c6': 0x88,
  '\u2030': 0x89,
  '\u0160': 0x8a,
  '\u2039': 0x8b,
  '\u0152': 0x8c,
  '\u017d': 0x8e,
  '\u2018': 0x91,
  '\u2019': 0x92,
  '\u201c': 0x93,
  '\u201d': 0x94,
  '\u2022': 0x95,
  '\u2013': 0x96,
  '\u2014': 0x97,
  '\u02dc': 0x98,
  '\u2122': 0x99,
  '\u0161': 0x9a,
  '\u203a': 0x9b,
  '\u0153': 0x9c,
  '\u017e': 0x9e,
  '\u0178': 0x9f,
};

const hasMojibake = (value) => /[\u00d8\u00d9\u00db\u00da\u00bf]|\u00e2[\u20ac\u0080]/.test(value);

const decodeMojibake = (value) => {
  if (typeof value !== 'string' || !hasMojibake(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from([...value], (char) => windows1252Bytes[char] ?? char.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
};

const decodeSiteDataText = (value) => {
  if (Array.isArray(value)) {
    return value.map(decodeSiteDataText);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, decodeSiteDataText(entry)])
    );
  }

  return decodeMojibake(value);
};


export const navLinks = decodeSiteDataText([
  'ØµÙØ­Ù‡ Ø§ØµÙ„ÛŒ',
  'Ù‡Ø¯Ø§ÛŒØ§',
  'Ú©Ø³Ø¨â€ŒÙˆÚ©Ø§Ø±Ù‡Ø§',
  'ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ',
  'Ø¨Ø§Ø´Ú¯Ø§Ù‡ Ù…Ø´ØªØ±ÛŒØ§Ù†',
  'Ø¯Ø±Ø¨Ø§Ø±Ù‡ Ù…Ø§',
  'ØªÙ…Ø§Ø³ Ø¨Ø§ Ù…Ø§',
]);

export const dashboardNavLinks = decodeSiteDataText([
  'ØµÙØ­Ù‡ Ø§ØµÙ„ÛŒ',
  'Ø³ÙˆØ§Ù„Ø§Øª',
  'Ú©Ø³Ø¨â€ŒÙˆÚ©Ø§Ø±Ù‡Ø§',
  'ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ',
  'Ø¨Ø§Ø´Ú¯Ø§Ù‡ Ù…Ø´ØªØ±ÛŒØ§Ù†',
  'Ø®Ø¨Ø±Ù‡Ø§',
  'ØªÙ…Ø§Ø³ Ø¨Ø§ Ù…Ø§',
]);

export const tabs = decodeSiteDataText([
  'Ø¯Ø±Ø¨Ø§Ø±Ù‡ Ù…Ø§',
  'Ù…Ø­ØµÙˆÙ„Ø§Øª Ùˆ Ø®Ø¯Ù…Ø§Øª',
  'Ù‡Ø¯Ø§ÛŒØ§',
  'Ú¯Ø§Ù„Ø±ÛŒ',
  'Ù†Ø¸Ø±Ø§Øª Ú©Ø§Ø±Ø¨Ø±Ø§Ù†',
  'Ù…ÙˆÙ‚Ø¹ÛŒØª',
]);

export const infoCards = decodeSiteDataText([
  {
    icon: MapPin,
    text: 'Ú©Ø±Ø¬ØŒ Ø®ÛŒØ§Ø¨Ø§Ù† Ø§Ù„Ù…Ù‡Ø¯ÛŒØŒ Ù†Ø¨Ø´ Ø®ÛŒØ§Ø¨Ø§Ù† Ú¯Ù„',
  },
  {
    icon: Clock3,
    title: 'Ø³Ø§Ø¹Ø§Øª Ú©Ø§Ø±ÛŒ',
    text: 'Û±Û²:Û°Û° - Û²Û³:Û°Û°',
  },
  {
    icon: Phone,
    text: '0919 404 0911',
  },
]);

export const gifts = decodeSiteDataText([
  {
    title: 'Ø¢ÛŒØ³ Ø¢Ù…Ø±ÛŒÚ©Ø§Ù†Ùˆ Ø±Ø§ÛŒÚ¯Ø§Ù†',
    place: 'Ú©Ø§ÙÙ‡ Ø¯Ø± Ù…Ù„Ù„',
    badge: 'Ø±Ø§ÛŒÚ¯Ø§Ù†',
    badgeClass: 'gift-free',
    image: getImageSrc(icedAmericanoImage),
  },
  {
    title: 'Ø¯Ø³Ø± Ø±ÙˆØ² Ø±Ø§ÛŒÚ¯Ø§Ù†',
    place: 'Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„',
    badge: 'Ø±Ø§ÛŒÚ¯Ø§Ù†',
    badgeClass: 'gift-free',
    image: getImageSrc(dailyDessertImage),
  },
  {
    title: 'ÙªÛ²Û° ØªØ®ÙÛŒÙ Ø±ÙˆÛŒ Ú©Ù„ Ù…Ù†Ùˆ',
    place: 'Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„',
    badge: 'ØªØ®ÙÛŒÙ',
    badgeClass: 'gift-discount',
    image: getImageSrc(restaurantMenuImage),
  },
]);

export const galleryImages = decodeSiteDataText([
  getImageSrc(galleryDiningImage),
  getImageSrc(gallerySaladImage),
  getImageSrc(galleryTableImage),
  getImageSrc(galleryRestaurantImage),
]);

export const stars = Array.from({ length: 5 });

export const businessProfiles = decodeSiteDataText([
  {
    id: 'melal',
    slug: 'melal',
    collectionId: 'melal',
    aliases: ['restaurant', 'Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„', 'Ù…Ù„Ù„'],
    title: 'Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„',
    shortTitle: 'Ù…Ù„Ù„',
    logoText: 'Ù…Ù„Ù„',
    logoSmall: 'RESTAURANT',
    category: 'Ø±Ø³ØªÙˆØ±Ø§Ù†',
    specialty: 'ØºØ°Ø§Ù‡Ø§ÛŒ Ø§ÛŒØ±Ø§Ù†ÛŒ',
    rating: 'Û´.Û¸',
    votes: 'Û²Û³Û´ Ø±Ø§ÛŒ',
    image: '/home/img/restaurant-melal.png',
    walletBalance: 0,
    walletBalanceLabel: 'Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‡Ù†ÙˆØ² Ú©ÛŒÙ Ù¾ÙˆÙ„ Ø§ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø´Ø§Ø±Ú˜ Ù†Ø´Ø¯Ù‡',
    points: 'Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„ Ø¨Ø§ Ø¨ÛŒØ´ Ø§Ø² Û±Û° Ø³Ø§Ù„ ØªØ¬Ø±Ø¨Ù‡ Ø¯Ø± Ø§Ø±Ø§Ø¦Ù‡ Ø¨Ù‡ØªØ±ÛŒÙ† ØºØ°Ø§Ù‡Ø§ÛŒ Ø§ÛŒØ±Ø§Ù†ÛŒØŒ Ø¯Ø±ÛŒØ§ÛŒÛŒ Ùˆ ÙØ±Ù†Ú¯ÛŒØŒ Ø¯Ø± ÙØ¶Ø§ÛŒÛŒ Ø¯Ù„Ù†Ø´ÛŒÙ† Ùˆ ØµÙ…ÛŒÙ…ÛŒ Ø¢Ù…Ø§Ø¯Ù‡ Ù¾Ø°ÛŒØ±Ø§ÛŒÛŒ Ø§Ø² Ø´Ù…Ø§ Ø¹Ø²ÛŒØ²Ø§Ù† Ø§Ø³Øª.',
  },
  {
    id: 'ibamo',
    slug: 'ibamo',
    collectionId: '1',
    aliases: ['Ø§ÛŒØ¨Ø§Ù…Ùˆ'],
    title: 'Ø§ÛŒØ¨Ø§Ù…Ùˆ',
    shortTitle: 'Ø§ÛŒØ¨Ø§Ù…Ùˆ',
    category: 'ÙØ±ÙˆØ´Ú¯Ø§Ù‡',
    specialty: 'Ù¾ÙˆØ´Ø§Ú© Ø®Ø§Ù†ÙˆØ§Ø¯Ù‡',
    rating: 'Û´.Û·',
    votes: 'Û±Û¸Û¹ Ø±Ø§ÛŒ',
    image: '/home/img/logo ibamo.jpg',
    address: '\u06af\u0631\u06af\u0627\u0646\u060c \u0646\u0628\u0634 \u0639\u062f\u0627\u0644\u062a \u06f3\u06f9',
    phone: '01732331900 / 0920633897',
    hours: 'Ø´Ù†Ø¨Ù‡ ØªØ§ Ù¾Ù†Ø¬ Ø´Ù†Ø¨Ù‡ Ø§Ø² 10 ØµØ¨Ø­ ØªØ§ 21 Ø´Ø¨',
    mapUrl: 'https://maps.app.goo.gl/j7dRR3Va2Lt4fK9V7?g_st=atm',
    instagramUrl: 'https://www.instagram.com/ibamo.ir/?hl=fa',
    bannerImage: '/home/img/business-banners/ibamo-hero.png',
    bannerMode: 'photo',
    walletBalance: 300000,
    walletBalanceLabel: 'Û³Û°Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø§ÛŒØ¨Ø§Ù…Ùˆ',
    discountCode: 'IBAMO72WDBU',
    points: 'Û±Û²,Û´Û°Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø§ÛŒØ¨Ø§Ù…Ùˆ Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ù¾ÙˆØ´Ø§Ú© Ø®Ø§Ù†ÙˆØ§Ø¯Ù‡ Ø§Ø³Øª Ùˆ Ø§Ø¹ØªØ¨Ø§Ø± Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± ÙÙ‚Ø· Ø¨Ø±Ø§ÛŒ Ø®Ø±ÛŒØ¯ Ø§Ø² Ù‡Ù…ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
  {
    id: 'mojalal',
    slug: 'mojalal',
    collectionId: '3',
    aliases: ['Ù…Ø¬Ù„Ù„'],
    title: 'Ù…Ø¬Ù„Ù„',
    shortTitle: 'Ù…Ø¬Ù„Ù„',
    category: 'Ú©Ø§ÙÙ‡ Ùˆ Ø±Ø³ØªÙˆØ±Ø§Ù†',
    specialty: 'Ú©Ø§ÙÙ‡ Ùˆ Ø±Ø³ØªÙˆØ±Ø§Ù†',
    rating: 'Û´.Û¹',
    votes: 'Û²Û±Û± Ø±Ø§ÛŒ',
    image: '/home/img/mojalal.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ù†Ø¨Ø´ Ø¹Ø¯Ø§Ù„Øª Û³Û¹ØŒ Ø±ÙˆÙ Ù…Ø¬ØªÙ…Ø¹ Ø±ÙˆÛŒØ§Ù„',
    phone: '017 3232 1750',
    hours: 'Û¸ ØµØ¨Ø­ ØªØ§ Û±Û² Ø´Ø¨',
    mapUrl: 'https://maps.app.goo.gl/ErsJv5CmYik4uvDAA?g_st=atm',
    instagramUrl: 'https://www.instagram.com/mojalal.royal/?hl=fa',
    bannerImage: '/home/img/business-banners/mojalal-hero.png',
    bannerMode: 'photo',
    walletBalance: 180000,
    walletBalanceLabel: 'Û±Û¸Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ù…Ø¬Ù„Ù„',
    points: 'Û¹,Û¸Û°Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ù…Ø¬Ù„Ù„ ÛŒÚ© Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ú©Ø§ÙÙ‡ Ùˆ Ø±Ø³ØªÙˆØ±Ø§Ù† Ø§Ø³Øª Ùˆ Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± Ø¨Ø±Ø§ÛŒ Ù‡Ù…ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø¨Ù‡ ØµÙˆØ±Øª Ø¬Ø¯Ø§Ú¯Ø§Ù†Ù‡ Ø¨Ø±Ø±Ø³ÛŒ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
  {
    id: 'bastani',
    slug: 'bastani',
    collectionId: '2',
    aliases: ['Ø¨Ø§Ø³ØªØ§Ù†ÛŒ'],
    title: 'Ø¨Ø§Ø³ØªØ§Ù†ÛŒ',
    shortTitle: 'Ø¨Ø§Ø³ØªØ§Ù†ÛŒ',
    category: 'Ø³Ø§Ù„Ù† Ø²ÛŒØ¨Ø§ÛŒÛŒ',
    specialty: 'Ø²ÛŒØ¨Ø§ÛŒÛŒ',
    rating: 'Û´.Û¶',
    votes: 'Û±ÛµÛ¶ Ø±Ø§ÛŒ',
    image: '/home/img/business-banners/bastani-logo-enhanced.png',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¹Ø¯Ø§Ù„Øª Û³Û¸ØŒ Ù…Ø¬ØªÙ…Ø¹ Ø¨Ø§Ø±Ø§Ù†ØŒ Ø·Ø¨Ù‚Ù‡â€ŒÛŒ Û·',
    instagramUrl: 'https://www.instagram.com/bastani_beautysalon/?hl=fa',
    bannerImage: '/home/img/business-banners/bastani-hero.png',
    bannerMode: 'photo',
    walletBalance: 120000,
    walletBalanceLabel: 'Û±Û²Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¨Ø§Ø³ØªØ§Ù†ÛŒ',
    points: 'Û·,Û³Û°Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø¨Ø§Ø³ØªØ§Ù†ÛŒ ÛŒÚ© Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø²ÛŒØ¨Ø§ÛŒÛŒ Ø§Ø³Øª Ùˆ Ø§Ø¹ØªØ¨Ø§Ø± Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± ÙÙ‚Ø· Ø¨Ø±Ø§ÛŒ Ø®Ø¯Ù…Ø§Øª Ù‡Ù…ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
  {
    id: 'bakhshi',
    slug: 'bakhshi',
    collectionId: '6',
    aliases: ['Ø¨Ø®Ø´ÛŒ'],
    title: 'Ø¨Ø®Ø´ÛŒ',
    shortTitle: 'Ø¨Ø®Ø´ÛŒ',
    category: 'ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ',
    specialty: 'ÙØ±ÙˆØ´Ú¯Ø§Ù‡ Ø²Ù†Ø¬ÛŒØ±Ù‡â€ŒØ§ÛŒ',
    rating: 'Û´.Ûµ',
    votes: 'Û±Û´Û¸ Ø±Ø§ÛŒ',
    image: '/home/img/bakhshi.jpg',
    address: 'Ù†Ø¨Ø´ Ø¹Ø¯Ø§Ù„Øª Û³Û¸ Ø§Ù†ØªÙ‡Ø§ÛŒ Ù¾Ø§Ø³Ø§Ú˜ Ø¨Ø§Ø±Ø§Ù†',
    phone: '017 3236 7424',
    mapUrl: 'https://maps.app.goo.gl/pWSDeCPARNMJMjvt9?g_st=atm',
    instagramUrl: 'https://www.instagram.com/bakhshi_gorgann/?hl=fa',
    bannerImage: '/home/img/business-banners/bakhshi-hero.png',
    bannerMode: 'photo',
    walletBalance: 90000,
    walletBalanceLabel: 'Û¹Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¨Ø®Ø´ÛŒ',
    points: 'Ûµ,Û¶Û°Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø¨Ø®Ø´ÛŒ ÛŒÚ© Ù…Ø¬Ù…ÙˆØ¹Ù‡ ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ Ø§Ø³Øª Ùˆ Ø´Ø§Ø±Ú˜ Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± Ø¨Ø±Ø§ÛŒ Ø®Ø±ÛŒØ¯ Ø§Ø² Ù‡Ù…ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
  {
    id: 'barial',
    slug: 'barial',
    collectionId: '4',
    aliases: ['Ø¨Ø§Ø±ÛŒØ§Ù„'],
    title: 'Ø¨Ø§Ø±ÛŒØ§Ù„',
    shortTitle: 'Ø¨Ø§Ø±ÛŒØ§Ù„',
    category: 'Ù¾Ø²Ø´Ú©ÛŒ Ø²ÛŒØ¨Ø§ÛŒÛŒ',
    specialty: 'Ú©Ù„ÛŒÙ†ÛŒÚ© Ø²ÛŒØ¨Ø§ÛŒÛŒ Ø¨Ø§Ø±ÛŒØ§Ù„',
    rating: 'Û´.Û´',
    votes: 'Û±Û²Û° Ø±Ø§ÛŒ',
    image: '/home/img/barial.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¹Ø¯Ø§Ù„Øª Û´Û¹ØŒ Ø¢Ù¾Ø§Ø±ØªÙ…Ø§Ù† ÙˆÛŒØ´ÛŒ Ø·Ø¨Ù‚Ù‡â€ŒÛŒ Ø§ÙˆÙ„',
    phone: '01732355716',
    mapUrl: 'https://maps.app.goo.gl/PRFrjXQbKzUnzwoT6',
    instagramUrl: 'https://www.instagram.com/barial.salamat/?hl=fa',
    bannerImage: '/home/img/business-banners/barial-hero.png',
    bannerMode: 'photo',
    walletBalance: 0,
    walletBalanceLabel: 'Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‡Ù†ÙˆØ² Ø´Ø§Ø±Ú˜ Ù†Ø´Ø¯Ù‡',
    points: 'Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø¨Ø§Ø±ÛŒØ§Ù„ ÛŒÚ© Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ù¾Ø²Ø´Ú©ÛŒ Ø²ÛŒØ¨Ø§ÛŒÛŒ Ø§Ø³Øª Ùˆ Ø§Ú¯Ø± Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± Ø¨Ø±Ø§ÛŒ Ø§ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø´Ø§Ø±Ú˜ Ø´ÙˆØ¯ØŒ Ù‡Ù…ÛŒÙ†Ø¬Ø§ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
  {
    id: 'dorato',
    slug: 'dorato',
    collectionId: '5',
    aliases: ['Ø¯ÙˆØ±Ø§ØªÙˆ'],
    title: 'Ø¯ÙˆØ±Ø§ØªÙˆ',
    shortTitle: 'Ø¯ÙˆØ±Ø§ØªÙˆ',
    category: 'Ø³Ø±Ú¯Ø±Ù…ÛŒ',
    specialty: 'Ø´Ù‡Ø±Ø¨Ø§Ø²ÛŒ Ùˆ Ù‡ÛŒØ¬Ø§Ù†',
    rating: 'Û´.Û¶',
    votes: 'Û±Û·Û² Ø±Ø§ÛŒ',
    image: '/home/img/logo dorato.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¨Ù„ÙˆØ§Ø± Ù†Ø§Ù‡Ø§Ø± Ø®ÙˆØ±Ø§Ù†ØŒ Ø¨ÛŒÙ† Ø¹Ø¯Ø§Ù„Øª Û¹Ûµ Ùˆ Ø¹Ø¯Ø§Ù„Øª Û¹Û· Ù…ÛŒÙ†Ø§ Ú¯Ù„ (Ù…Ø­Ù„Ù‡â€ŒÛŒ Ù…ÛŒÙ†Ø§ Ú¯Ù„)',
    phone: '0919 404 0911',
    hours: '10 ØªØ§ 23',
    mapUrl: 'https://maps.app.goo.gl/tTBP95rBkVwbcsAXA',
    instagramUrl: 'https://www.instagram.com/doratopark/',
    bannerImage: '/home/img/business-banners/dorato-hero.png',
    bannerMode: 'photo',
    walletBalance: 75000,
    walletBalanceLabel: 'Û·Ûµ,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    walletStatus: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¯ÙˆØ±Ø§ØªÙˆ',
    points: 'Û´,Û¹Û°Û° Ø§Ù…ØªÛŒØ§Ø²',
    description: 'Ø¯ÙˆØ±Ø§ØªÙˆ Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø¨Ø§Ø²ÛŒ Ùˆ Ø³Ø±Ú¯Ø±Ù…ÛŒ Ø§Ø³Øª Ùˆ Ú©ÛŒÙ Ù¾ÙˆÙ„ Ú©Ø§Ø±Ø¨Ø± Ø¨Ø±Ø§ÛŒ Ø®Ø±ÛŒØ¯ Ùˆ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø§Ø² Ø®Ø¯Ù…Ø§Øª Ù‡Ù…ÛŒÙ† Ù…Ø¬Ù…ÙˆØ¹Ù‡ Ø¨Ø±Ø±Ø³ÛŒ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
  },
]);

export const dashboardActions = decodeSiteDataText([
  { title: 'Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø­Ø³Ø§Ø¨', icon: User },
  { title: 'Ú©Ø¯ Ù…Ø¹Ø±Ù', icon: SquareX },
  { title: 'Ú©ÛŒÙ Ù¾ÙˆÙ„', icon: Wallet },
  { title: 'ÙØ±Ø¢ÛŒÙ†Ø¯Ù‡Ø§', icon: ClipboardList },
  { title: 'Ù‡Ø¯ÛŒÙ‡â€ŒÙ‡Ø§ÛŒ Ù…Ù†', icon: Gift },
]);

export const mobileProfileLinks = decodeSiteDataText([
  { title: 'Ù‡Ø¯ÛŒÙ‡â€ŒÙ‡Ø§ÛŒ Ù…Ù†', icon: Gift },
  { title: 'ÙØ±Ø§ÛŒÙ†Ø¯Ù‡Ø§ Ùˆ Ú©Ø´â€ŒØ¨Ú©â€ŒÙ‡Ø§', icon: Shirt },
  { title: 'Ú©ÛŒÙ Ù¾ÙˆÙ„', icon: Wallet },
  { title: 'Ú©Ø¯ Ù…Ø¹Ø±Ù', icon: SquareX },
  { title: 'Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ Ùˆ Ø³ÙˆØ§Ù„Ø§Øª Ù…ØªØ¯Ø§ÙˆÙ„', icon: CircleHelp },
]);

export const mobileBottomNav = decodeSiteDataText([
  { id: 'home', title: 'Ù¾ÛŒØ´Ø®ÙˆØ§Ù†', icon: Home },
  { id: 'shop', title: 'ÙØ±ÙˆØ´Ú¯Ø§Ù‡ÛŒ', icon: Store },
  { id: 'gifts', title: 'Ù‡Ø¯Ø§ÛŒØ§', icon: Gift },
  { id: 'faq', title: '\u0633\u0648\u0627\u0644\u0627\u062a', icon: CircleHelp },
  { id: 'account', title: 'Ø­Ø³Ø§Ø¨', icon: User },
]);

export const activeGifts = decodeSiteDataText([
  { title: 'ÛŒÚ© Ø¨Ø§Ø²ÛŒ VR Ø±Ø§ÛŒÚ¯Ø§Ù†', place: 'VR Game', time: 'ØªØ§ Û³ Ø±ÙˆØ² Ø¯ÛŒÚ¯Ø±', image: getImageSrc(vrGameImage) },
  { title: 'Ù¾Ø§Ú©Ø³Ø§Ø²ÛŒ Ù¾ÙˆØ³Øª Ø±Ø§ÛŒÚ¯Ø§Ù†', place: 'Ù…Ø§Ù†Ø¯ÛŒØ§', time: 'ØªØ§ Û±Û° Ø±ÙˆØ² Ø¯ÛŒÚ¯Ø±', image: getImageSrc(skinCareImage) },
  { title: 'Ø¹ÛŒÙ†Ú© Ø¢ÙØªØ§Ø¨ÛŒ Ø±Ø§ÛŒÚ¯Ø§Ù†', place: 'Ø¨Ø±ÛŒÙ„Ø§Ù†', time: 'ØªØ§ Ûµ Ø±ÙˆØ² Ø¯ÛŒÚ¯Ø±', image: getImageSrc(sunglassesImage) },
  { title: 'Ø¢ÛŒØ³ Ø¢Ù…Ø±ÛŒÚ©Ø§Ù†Ùˆ Ø±Ø§ÛŒÚ¯Ø§Ù†', place: 'Ú©Ø§ÙÙ‡ Ú†ÛŒ', time: 'ØªØ§ Û² Ø±ÙˆØ² Ø¯ÛŒÚ¯Ø±', image: getImageSrc(icedAmericanoImage) },
]);

export const giftHistory = decodeSiteDataText([
  { title: 'ÙªÛ° ØªØ®ÙÛŒÙ Ø±Ø³ØªÙˆØ±Ø§Ù† Ù…Ù„Ù„', date: 'Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´Ø¯Ù‡ Ø¯Ø± Û±Û´Û°Û³/Û°Û²/Û±Ûµ', image: getImageSrc(restaurantMenuImage) },
  { title: 'Ø¯Ø³Ø± Ø±ÙˆØ² Ø±Ø§ÛŒÚ¯Ø§Ù†', date: 'Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´Ø¯Ù‡ Ø¯Ø± Û±Û´Û°Û³/Û°Û±/Û²Û¸', image: getImageSrc(dailyDessertImage) },
  { title: 'Ù‚Ù‡ÙˆÙ‡ Ø±Ø§ÛŒÚ¯Ø§Ù†', date: 'Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´Ø¯Ù‡ Ø¯Ø± Û±Û´Û°Û²/Û±Û²/Û°Ûµ', image: getImageSrc(coffeeBeansImage) },
]);

export const stats = decodeSiteDataText([
  { label: 'Ù‡Ø¯ÛŒÙ‡â€ŒÙ‡Ø§ÛŒ Ø¯Ø±ÛŒØ§ÙØª Ø´Ø¯Ù‡', value: 'Û²Û³' },
  { label: 'Ø§Ù…ØªÛŒØ§Ø² Ú©Ù„', value: 'Û²Û¸,ÛµÛ°Û°' },
  { label: 'Ù‡Ø¯ÛŒÙ‡ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´Ø¯Ù‡', value: 'Û±Û¶' },
]);
export const businessWallets = decodeSiteDataText([
  {
    id: 'ibamo',
    title: 'Ø§ÛŒØ¨Ø§Ù…Ùˆ',
    balance: 300000,
    balanceLabel: 'Û³Û°Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø§ÛŒØ¨Ø§Ù…Ùˆ',
    image: '/home/img/logo ibamo.jpg',
    address: '\u06af\u0631\u06af\u0627\u0646\u060c \u0646\u0628\u0634 \u0639\u062f\u0627\u0644\u062a \u06f3\u06f9',
    phone: '01732331900 / 0920633897',
    hours: 'Ø´Ù†Ø¨Ù‡ ØªØ§ Ù¾Ù†Ø¬ Ø´Ù†Ø¨Ù‡ Ø§Ø² 10 ØµØ¨Ø­ ØªØ§ 21 Ø´Ø¨',
    mapUrl: 'https://maps.app.goo.gl/j7dRR3Va2Lt4fK9V7?g_st=atm',
    instagramUrl: 'https://www.instagram.com/ibamo.ir/?hl=fa',
    bannerImage: '/home/img/business-banners/ibamo-hero.png',
    bannerMode: 'photo',
  },
  {
    id: 'mojalal',
    title: 'Ù…Ø¬Ù„Ù„',
    balance: 180000,
    balanceLabel: 'Û±Û¸Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ù…Ø¬Ù„Ù„',
    image: '/home/img/mojalal.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ù†Ø¨Ø´ Ø¹Ø¯Ø§Ù„Øª Û³Û¹ØŒ Ø±ÙˆÙ Ù…Ø¬ØªÙ…Ø¹ Ø±ÙˆÛŒØ§Ù„',
    phone: '017 3232 1750',
    hours: 'Û¸ ØµØ¨Ø­ ØªØ§ Û±Û² Ø´Ø¨',
    mapUrl: 'https://maps.app.goo.gl/ErsJv5CmYik4uvDAA?g_st=atm',
    instagramUrl: 'https://www.instagram.com/mojalal.royal/?hl=fa',
    bannerImage: '/home/img/business-banners/mojalal-hero.png',
    bannerMode: 'photo',
  },
  {
    id: 'bastani',
    title: 'Ø¨Ø§Ø³ØªØ§Ù†ÛŒ',
    balance: 120000,
    balanceLabel: 'Û±Û²Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¨Ø§Ø³ØªØ§Ù†ÛŒ',
    image: '/home/img/business-banners/bastani-logo-enhanced.png',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¹Ø¯Ø§Ù„Øª Û³Û¸ØŒ Ù…Ø¬ØªÙ…Ø¹ Ø¨Ø§Ø±Ø§Ù†ØŒ Ø·Ø¨Ù‚Ù‡â€ŒÛŒ Û·',
    instagramUrl: 'https://www.instagram.com/bastani_beautysalon/?hl=fa',
    bannerImage: '/home/img/business-banners/bastani-hero.png',
    bannerMode: 'photo',
  },
  {
    id: 'bakhshi',
    title: 'Ø¨Ø®Ø´ÛŒ',
    balance: 90000,
    balanceLabel: 'Û¹Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¨Ø®Ø´ÛŒ',
    image: '/home/img/bakhshi.jpg',
    address: 'Ù†Ø¨Ø´ Ø¹Ø¯Ø§Ù„Øª Û³Û¸ Ø§Ù†ØªÙ‡Ø§ÛŒ Ù¾Ø§Ø³Ø§Ú˜ Ø¨Ø§Ø±Ø§Ù†',
    phone: '017 3236 7424',
    mapUrl: 'https://maps.app.goo.gl/pWSDeCPARNMJMjvt9?g_st=atm',
    instagramUrl: 'https://www.instagram.com/bakhshi_gorgann/?hl=fa',
    bannerImage: '/home/img/business-banners/bakhshi-hero.png',
    bannerMode: 'photo',
  },
  {
    id: 'barial',
    title: 'Ø¨Ø§Ø±ÛŒØ§Ù„',
    balance: 0,
    balanceLabel: 'Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‡Ù†ÙˆØ² Ø´Ø§Ø±Ú˜ Ù†Ø´Ø¯Ù‡',
    image: '/home/img/barial.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¹Ø¯Ø§Ù„Øª Û´Û¹ØŒ Ø¢Ù¾Ø§Ø±ØªÙ…Ø§Ù† ÙˆÛŒØ´ÛŒ Ø·Ø¨Ù‚Ù‡â€ŒÛŒ Ø§ÙˆÙ„',
    phone: '01732355716',
    mapUrl: 'https://maps.app.goo.gl/PRFrjXQbKzUnzwoT6',
    instagramUrl: 'https://www.instagram.com/barial.salamat/?hl=fa',
    bannerImage: '/home/img/business-banners/barial-hero.png',
    bannerMode: 'photo',
  },
  {
    id: 'dorato',
    title: 'Ø¯ÙˆØ±Ø§ØªÙˆ',
    balance: 75000,
    balanceLabel: 'Û·Ûµ,Û°Û°Û° ØªÙˆÙ…Ø§Ù†',
    status: 'Ù‚Ø§Ø¨Ù„ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¯Ø± Ø¯ÙˆØ±Ø§ØªÙˆ',
    image: '/home/img/logo dorato.jpg',
    address: 'Ú¯Ø±Ú¯Ø§Ù†ØŒ Ø¨Ù„ÙˆØ§Ø± Ù†Ø§Ù‡Ø§Ø± Ø®ÙˆØ±Ø§Ù†ØŒ Ø¨ÛŒÙ† Ø¹Ø¯Ø§Ù„Øª Û¹Ûµ Ùˆ Ø¹Ø¯Ø§Ù„Øª Û¹Û· Ù…ÛŒÙ†Ø§ Ú¯Ù„ (Ù…Ø­Ù„Ù‡â€ŒÛŒ Ù…ÛŒÙ†Ø§ Ú¯Ù„)',
    phone: '0919 404 0911',
    hours: '10 ØªØ§ 23',
    mapUrl: 'https://maps.app.goo.gl/tTBP95rBkVwbcsAXA',
    instagramUrl: 'https://www.instagram.com/doratopark/',
    bannerImage: '/home/img/business-banners/dorato-hero.png',
    bannerMode: 'photo',
  },
]);

export const walletTransactions = decodeSiteDataText([
  { business: 'Ø§ÛŒØ¨Ø§Ù…Ùˆ', type: 'Ø´Ø§Ø±Ú˜ Ú©ÛŒÙ Ù¾ÙˆÙ„', amount: '+Û³Û°Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†', date: 'Û±Û´Û°Û³/Û°Û³/Û²Ûµ' },
  { business: 'Ù…Ø¬Ù„Ù„', type: 'Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø¨Ø±Ø§ÛŒ Ø®Ø±ÛŒØ¯', amount: '-Û´Ûµ,Û°Û°Û° ØªÙˆÙ…Ø§Ù†', date: 'Û±Û´Û°Û³/Û°Û³/Û²Û±' },
  { business: 'Ø¨Ø§Ø³ØªØ§Ù†ÛŒ', type: 'Ø´Ø§Ø±Ú˜ Ú©ÛŒÙ Ù¾ÙˆÙ„', amount: '+Û±Û²Û°,Û°Û°Û° ØªÙˆÙ…Ø§Ù†', date: 'Û±Û´Û°Û³/Û°Û³/Û±Û¸' },
  { business: 'Ø¯ÙˆØ±Ø§ØªÙˆ', type: 'Ø´Ø§Ø±Ú˜ Ú©ÛŒÙ Ù¾ÙˆÙ„', amount: '+Û·Ûµ,Û°Û°Û° ØªÙˆÙ…Ø§Ù†', date: 'Û±Û´Û°Û³/Û°Û³/Û±Û°' },
]);














