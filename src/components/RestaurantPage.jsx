import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Star, Wallet } from 'lucide-react';
import restaurantInteriorImage from '../assets/images/restaurant-interior.jpg';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { galleryImages, gifts, infoCards, stars, tabs } from '../data/siteData';
import { getBusinessWallet, getMockWallet } from '../api/wallet';

const getImageSrc = (image) => image?.src || image;

const text = {
  restaurantAlt: '\u0641\u0636\u0627\u06cc \u062f\u0627\u062e\u0644\u06cc \u0631\u0633\u062a\u0648\u0631\u0627\u0646',
  melal: '\u0645\u0644\u0644',
  restaurantTitle: '\u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644',
  rating: '\u06f4.\u06f8',
  votes: '\u06f2\u06f3\u06f4 \u0631\u0627\u06cc',
  restaurant: '\u0631\u0633\u062a\u0648\u0631\u0627\u0646',
  iranianFood: '\u063a\u0630\u0627\u0647\u0627\u06cc \u0627\u06cc\u0631\u0627\u0646\u06cc',
  follow: '\u062f\u0646\u0628\u0627\u0644 \u06a9\u0631\u062f\u0646',
  giftsTab: '\u0647\u062f\u0627\u06cc\u0627',
  collectionGifts: '\u0647\u062f\u06cc\u0647\u200c\u0647\u0627\u06cc \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647',
  allGifts: '\u0645\u0634\u0627\u0647\u062f\u0647 \u0647\u0645\u0647 \u0647\u062f\u0627\u06cc\u0627',
  about: '\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627',
  aboutText: '\u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644 \u0628\u0627 \u0628\u06cc\u0634 \u0627\u0632 \u06f1\u06f0 \u0633\u0627\u0644 \u062a\u062c\u0631\u0628\u0647 \u062f\u0631 \u0627\u0631\u0627\u0626\u0647 \u0628\u0647\u062a\u0631\u06cc\u0646 \u063a\u0630\u0627\u0647\u0627\u06cc \u0627\u06cc\u0631\u0627\u0646\u06cc\u060c \u062f\u0631\u06cc\u0627\u06cc\u06cc \u0648 \u0641\u0631\u0646\u06af\u06cc\u060c \u062f\u0631 \u0641\u0636\u0627\u06cc\u06cc \u062f\u0644\u0646\u0634\u06cc\u0646 \u0648 \u0635\u0645\u06cc\u0645\u06cc \u0622\u0645\u0627\u062f\u0647 \u067e\u0630\u06cc\u0631\u0627\u06cc\u06cc \u0627\u0632 \u0634\u0645\u0627 \u0639\u0632\u06cc\u0632\u0627\u0646 \u0627\u0633\u062a. \u0645\u0627 \u062f\u0631 \u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644 \u0627\u0632 \u062a\u0627\u0632\u0647\u200c\u062a\u0631\u06cc\u0646 \u0645\u0648\u0627\u062f \u0627\u0648\u0644\u06cc\u0647 \u0648 \u062f\u0633\u062a\u0648\u0631\u0647\u0627\u06cc \u0627\u0635\u06cc\u0644 \u0627\u06cc\u0631\u0627\u0646\u06cc \u0628\u0647\u0631\u0647 \u0645\u06cc\u200c\u0628\u0631\u06cc\u0645 \u062a\u0627 \u062a\u062c\u0631\u0628\u0647\u200c\u0627\u06cc \u0628\u06cc\u200c\u0646\u0638\u06cc\u0631 \u0627\u0632 \u0637\u0639\u0645 \u0648 \u06a9\u06cc\u0641\u06cc\u062a \u0631\u0627 \u0628\u0631\u0627\u06cc \u0634\u0645\u0627 \u0628\u0647 \u0627\u0631\u0645\u063a\u0627\u0646 \u0628\u06cc\u0627\u0648\u0631\u06cc\u0645.',
  foodAlt: '\u063a\u0630\u0627\u06cc \u0631\u0633\u062a\u0648\u0631\u0627\u0646',
  reviews: '\u0646\u0638\u0631\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646',
  reviewer: '\u0645\u062d\u0645\u062f \u0627\u062d\u0645\u062f\u06cc',
  reviewText: '\u0647\u0645\u06cc\u0634\u0647 \u062a\u062c\u0631\u0628\u0647 \u0641\u0648\u0642\u200c\u0627\u0644\u0639\u0627\u062f\u0647\u200c\u0627\u06cc \u062f\u0631 \u0627\u06cc\u0646 \u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u062f\u0627\u0634\u062a\u0647\u200c\u0627\u0645. \u06a9\u06cc\u0641\u06cc\u062a \u063a\u0630\u0627 \u0639\u0627\u0644\u06cc \u0648 \u0645\u062d\u06cc\u0637 \u0628\u0633\u06cc\u0627\u0631 \u062f\u0644\u0646\u0634\u06cc\u0646\u06cc \u062f\u0627\u0631\u062f. \u0631\u0641\u062a\u0627\u0631 \u067e\u0631\u0633\u0646\u0644 \u0647\u0645 \u0645\u062d\u062a\u0631\u0645\u0627\u0646\u0647 \u0648 \u062d\u0631\u0641\u0647\u200c\u0627\u06cc \u0627\u0633\u062a. \u0628\u062f\u0648\u0646 \u0634\u06a9 \u06cc\u06a9\u06cc \u0627\u0632 \u0628\u0647\u062a\u0631\u06cc\u0646 \u0631\u0633\u062a\u0648\u0631\u0627\u0646\u200c\u0647\u0627\u06cc \u0634\u0647\u0631.',
};

function RestaurantPage({ isVisible, isLoggedIn = false }) {
  const [walletData, setWalletData] = useState(() => getMockWallet('melal'));
  const melalWallet = useMemo(() => (
    walletData.wallets.find((wallet) => String(wallet.id || '').toLowerCase().includes('melal')) || walletData.wallets[0]
  ), [walletData.wallets]);

  useEffect(() => {
    if (!isVisible || !isLoggedIn) {
      return;
    }

    let isMounted = true;

    getBusinessWallet('melal')
      .then((data) => {
        if (isMounted) {
          setWalletData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWalletData(getMockWallet('melal'));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isVisible, isLoggedIn]);

  const walletAmount = isLoggedIn ? melalWallet?.balanceLabel || '\u06f0 \u062a\u0648\u0645\u0627\u0646' : '\u0648\u0631\u0648\u062f \u0644\u0627\u0632\u0645 \u0627\u0633\u062a';
  const walletStatus = isLoggedIn
    ? melalWallet?.status || '\u0647\u0646\u0648\u0632 \u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647 \u0634\u0627\u0631\u0698 \u0646\u0634\u062f\u0647'
    : '\u0628\u0631\u0627\u06cc \u0645\u0634\u0627\u0647\u062f\u0647 \u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644 \u0648\u0627\u0631\u062f \u062d\u0633\u0627\u0628 \u0634\u0648\u06cc\u062f.';
  const walletPoints = isLoggedIn ? melalWallet?.points : '';

  return (
    <div className={isVisible ? '' : 'd-none'}>
      <section className="hero-grid">
        <div>
          <img
            className="hero-photo"
            src={getImageSrc(restaurantInteriorImage)}
            alt={text.restaurantAlt}
          />

          <div className="info-row">
            {infoCards.map(({ icon: Icon, title, text: cardText }, index) => {
              const isPhoneCard = index === 2;

              return (
                <div className="info-card d-flex align-items-center justify-content-between" key={cardText}>
                  <Icon />
                  <div className="text-end">
                    {title && <span className="info-title">{title}</span>}
                    <span className={`info-text ${isPhoneCard ? 'restaurant-phone-text' : ''}`} dir={isPhoneCard ? 'ltr' : 'rtl'}>{cardText}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        <aside className="profile">
          <div className="logo-circle">
            <span>{text.melal}</span>
            <small>RESTAURANT</small>
          </div>
          <h1 className="profile-title">{text.restaurantTitle}</h1>
          <div className="rating d-flex align-items-center justify-content-center">
            <span>{text.rating}</span>
            <span>|</span>
            <span className="d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </span>
            <span>{text.votes}</span>
          </div>
          <div className="meta d-flex align-items-center justify-content-center">
            <span>{text.restaurant}</span>
            <span className="dot" />
            <span>{text.iranianFood}</span>
          </div>
          <button className="follow-btn">{text.follow}</button>

          <section className="restaurant-wallet-card" aria-label="\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0631\u0633\u062a\u0648\u0631\u0627\u0646 \u0645\u0644\u0644">
            <div className="restaurant-wallet-head">
              <Wallet />
              <span>{'\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647'}</span>
            </div>
            <strong>{walletAmount}</strong>
            <p>{walletStatus}</p>
            {walletPoints && <small>{'\u0627\u0645\u062a\u06cc\u0627\u0632 \u0634\u0645\u0627:'} {walletPoints}</small>}
          </section>
        </aside>
      </section>
      <nav className="tabs">
        <ul className="d-flex align-items-center justify-content-between">
          {tabs.map((tab) => (
            <li className={tab === text.giftsTab ? 'active' : ''} key={tab}>
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <section className="content-grid">
        <aside className="panel gift-panel">
          <h2>{text.collectionGifts}</h2>
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
          <a className="all-gifts" href="#gifts">{text.allGifts}</a>
        </aside>

        <section className="panel about-panel">
          <h2 className="section-title">{text.about}</h2>
          <p className="about-text">{text.aboutText}</p>
          <div className="gallery">
            {galleryImages.map((image, index) => (
              <img src={image} alt={`${text.foodAlt} ${index + 1}`} key={image} />
            ))}
          </div>
        </section>
      </section>

      <section className="panel review-panel">
        <h2 className="section-title review-title">{text.reviews}</h2>
        <div className="review-row d-flex align-items-start">
          <img
            className="avatar"
            src={getImageSrc(userAvatarImage)}
            alt={text.reviewer}
          />
          <div className="text-end">
            <h3 className="review-name">{text.reviewer}</h3>
            <div className="review-stars d-flex align-items-center gap-1">
              {stars.map((_, index) => (
                <Star className="star" key={index} />
              ))}
            </div>
            <p className="review-text">{text.reviewText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RestaurantPage;