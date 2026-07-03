import { ChevronLeft, Star } from 'lucide-react';
import restaurantInteriorImage from '../assets/images/restaurant-interior.jpg';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { galleryImages, gifts, infoCards, stars, tabs } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;

function RestaurantPage({ isVisible }) {
  return (
    <div className={isVisible ? '' : 'd-none'}>
      <section className="hero-grid">
        <div>
          <img
            className="hero-photo"
            src={getImageSrc(restaurantInteriorImage)}
            alt="فضای داخلی رستوران"
          />

          <div className="info-row">
            {infoCards.map(({ icon: Icon, title, text }) => (
              <div className="info-card d-flex align-items-center justify-content-between" key={text}>
                <Icon />
                <div className="text-end">
                  {title && <span className="info-title">{title}</span>}
                  <span className="info-text">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="profile">
          <div className="logo-circle">
            <span>ملل</span>
            <small>RESTAURANT</small>
          </div>
          <h1 className="profile-title">رستوران ملل</h1>
          <div className="rating d-flex align-items-center justify-content-center">
            <span>۴.۸</span>
            <span>|</span>
            <span className="d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </span>
            <span>۲۳۴ رای</span>
          </div>
          <div className="meta d-flex align-items-center justify-content-center">
            <span>رستوران</span>
            <span className="dot" />
            <span>غذاهای ایرانی</span>
          </div>
          <button className="follow-btn">دنبال کردن</button>
        </aside>
      </section>

      <nav className="tabs">
        <ul className="d-flex align-items-center justify-content-between">
          {tabs.map((tab) => (
            <li className={tab === 'هدایا' ? 'active' : ''} key={tab}>
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <section className="content-grid">
        <aside className="panel gift-panel">
          <h2>هدیه‌های این مجموعه</h2>
          {gifts.map((gift) => (
            <article className="gift-item" key={gift.title}>
              <img src={gift.image} alt={gift.title} />
              <div className="gift-copy">
                <h3>{gift.title}</h3>
                <p>{gift.place}</p>
                <span className={`gift-badge ${gift.badgeClass}`}>{gift.badge}</span>
              </div>
              <ChevronLeft />
            </article>
          ))}
          <a className="all-gifts" href="#gifts">مشاهده همه هدایا</a>
        </aside>

        <section className="panel about-panel">
          <h2 className="section-title">درباره ما</h2>
          <p className="about-text">
            رستوران ملل با بیش از ۱۰ سال تجربه در ارائه بهترین غذاهای ایرانی، دریایی و فرنگی، در فضایی دلنشین و صمیمی آماده پذیرایی از شما عزیزان است. ما در رستوران ملل از تازه‌ترین مواد اولیه و دستورهای اصیل ایرانی بهره می‌بریم تا تجربه‌ای بی‌نظیر از طعم و کیفیت را برای شما به ارمغان بیاوریم.
          </p>
          <div className="gallery">
            {galleryImages.map((image, index) => (
              <img src={image} alt={`غذای رستوران ${index + 1}`} key={image} />
            ))}
          </div>
        </section>
      </section>

      <section className="panel review-panel">
        <h2 className="section-title review-title">نظرات کاربران</h2>
        <div className="review-row d-flex align-items-start">
          <img
            className="avatar"
            src={getImageSrc(userAvatarImage)}
            alt="محمد احمدی"
          />
          <div className="text-end">
            <h3 className="review-name">محمد احمدی</h3>
            <div className="review-stars d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </div>
            <p className="review-text">
              همیشه تجربه فوق‌العاده‌ای در این رستوران داشته‌ام. کیفیت غذا عالی و محیط بسیار دلنشینی دارد. رفتار پرسنل هم محترمانه و حرفه‌ای است. بدون شک یکی از بهترین رستوران‌های شهر.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RestaurantPage;
