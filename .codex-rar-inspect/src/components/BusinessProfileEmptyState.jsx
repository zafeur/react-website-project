import { ChevronLeft, Gamepad2, Navigation, Star, Users, Wallet } from 'lucide-react';

const text = {
  collectionWallet: '\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647',
  walletEmpty: '\u06f0 \u062a\u0648\u0645\u0627\u0646',
  locationTitle: '\u0645\u0648\u0642\u0639\u06cc\u062a \u0645\u06a9\u0627\u0646\u06cc',
  routeAction: '\u0645\u0633\u06cc\u0631 \u06cc\u0627\u0628\u06cc',
  hoursTitle: '\u0633\u0627\u0639\u0627\u062a \u06a9\u0627\u0631\u06cc',
  viewAction: '\u0645\u0634\u0627\u0647\u062f\u0647',
  contactTitle: '\u062a\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627',
  callAction: '\u062a\u0645\u0627\u0633',
  suitableForAll: '\u0645\u0646\u0627\u0633\u0628 \u0628\u0631\u0627\u06cc \u0647\u0645\u0647',
  selectedServices: '\u062e\u062f\u0645\u0627\u062a \u0645\u0646\u062a\u062e\u0628',
  walletTitle: '\u06a9\u06cc\u0641 \u067e\u0648\u0644 \u0627\u062e\u062a\u0635\u0627\u0635\u06cc',
  specialOffer: '\u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u0648\u06cc\u0698\u0647',
  tabs: ['\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627', '\u0645\u062d\u0635\u0648\u0644\u0627\u062a \u0648 \u062e\u062f\u0645\u0627\u062a', '\u0647\u062f\u0627\u06cc\u0627', '\u06af\u0627\u0644\u0631\u06cc', '\u0646\u0638\u0631\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646', '\u0645\u0648\u0642\u0639\u06cc\u062a'],
  giftsTitle: '\u0647\u062f\u06cc\u0647\u200c\u0647\u0627\u06cc \u0627\u06cc\u0646 \u0645\u062c\u0645\u0648\u0639\u0647',
  aboutTitle: '\u062f\u0631\u0628\u0627\u0631\u0647 \u0645\u0627',
  reviewsTitle: '\u0646\u0638\u0631\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646',
};

const infoCards = [
  { icon: Navigation, title: text.locationTitle, actionLabel: text.routeAction },
  { icon: Wallet, title: text.hoursTitle, actionLabel: text.viewAction },
  { icon: ChevronLeft, title: text.contactTitle, actionLabel: text.callAction },
];

const featureItems = [
  { icon: Users, title: text.suitableForAll },
  { icon: Wallet, title: text.walletTitle },
  { icon: Star, title: text.selectedServices },
  { icon: Gamepad2, title: text.specialOffer },
];

const emptyGiftItems = [
  { width: 'wide' },
  { width: 'medium' },
  { width: 'short' },
];

function EmptyLine({ className = '' }) {
  return <span className={`restaurant-empty-line ${className}`} aria-hidden="true" />;
}

function BusinessProfileEmptyState({ isVisible }) {
  return (
    <div className={isVisible ? '' : 'd-none'} id="restaurant-top">
      <section className="hero-grid restaurant-empty-profile">
        <div>
          <div className="hero-photo restaurant-empty-hero" aria-hidden="true" />

          <div className="info-row">
            {infoCards.map(({ icon: Icon, title, actionLabel }) => (
              <div className="info-card d-flex align-items-center justify-content-between" key={title}>
                <Icon />
                <div className="text-end">
                  <span className="info-title">{title}</span>
                  <EmptyLine />
                  <span className="business-info-action is-disabled">
                    {actionLabel}
                    <ChevronLeft />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="profile">
          <div className="logo-circle restaurant-empty-logo" aria-hidden="true" />
          <h1 className="profile-title"><EmptyLine className="restaurant-empty-title" /></h1>
          <div className="rating d-flex align-items-center justify-content-center">
            <EmptyLine className="restaurant-empty-rating" />
          </div>
          <div className="meta d-flex align-items-center justify-content-center">
            <EmptyLine className="restaurant-empty-meta" />
          </div>
          <button className="follow-btn" type="button" disabled aria-disabled="true" />

          <section className="restaurant-wallet-card" aria-label={text.collectionWallet}>
            <div className="restaurant-wallet-head">
              <Wallet />
              <span>{text.collectionWallet}</span>
            </div>
            <strong>{text.walletEmpty}</strong>
            <p />
          </section>
        </aside>
      </section>

      <nav className="tabs">
        <ul className="d-flex align-items-center justify-content-between">
          {text.tabs.map((tab) => (
            <li className={tab === text.tabs[2] ? 'active' : ''} key={tab}>
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <div className="business-feature-strip restaurant-empty-features">
        {featureItems.map(({ icon: Icon, title }) => (
          <div className="business-feature-item" key={title}>
            <Icon />
            <div>
              <strong>{title}</strong>
              <EmptyLine />
            </div>
          </div>
        ))}
      </div>

      <section className="content-grid">
        <aside className="panel gift-panel restaurant-empty-panel" id="restaurant-gifts">
          <h2>{text.giftsTitle}</h2>
          <div className="restaurant-empty-gifts" aria-hidden="true">
            {emptyGiftItems.map((item, index) => (
              <div className="restaurant-empty-gift" key={index}>
                <span className="restaurant-empty-gift-media" />
                <div>
                  <EmptyLine className={`restaurant-empty-gift-title restaurant-empty-${item.width}`} />
                  <EmptyLine className="restaurant-empty-gift-line" />
                  <span className="restaurant-empty-pill" />
                </div>
                <ChevronLeft />
              </div>
            ))}
          </div>
        </aside>

        <section className="panel about-panel restaurant-empty-panel">
          <h2 className="section-title">{text.aboutTitle}</h2>
          <div className="restaurant-empty-about" aria-hidden="true">
            <div className="restaurant-empty-copy">
              <EmptyLine className="restaurant-empty-copy-line restaurant-empty-copy-wide" />
              <EmptyLine className="restaurant-empty-copy-line" />
              <EmptyLine className="restaurant-empty-copy-line restaurant-empty-copy-medium" />
              <EmptyLine className="restaurant-empty-copy-line restaurant-empty-copy-short" />
            </div>
            <div className="restaurant-empty-gallery">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>
      </section>

      <section className="panel review-panel restaurant-empty-panel">
        <h2 className="section-title review-title">{text.reviewsTitle}</h2>
        <div className="restaurant-empty-reviews" aria-hidden="true">
          {[0, 1].map((item) => (
            <div className="restaurant-empty-review" key={item}>
              <span className="restaurant-empty-review-avatar" />
              <div>
                <EmptyLine className="restaurant-empty-review-name" />
                <EmptyLine className="restaurant-empty-review-stars" />
                <EmptyLine className="restaurant-empty-review-text" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BusinessProfileEmptyState;
