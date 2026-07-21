import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, ChevronLeft, Clock3, Copy, Crown, LogOut, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { getMockWallet, getUserWallet } from '../api/wallet';
import { activeGifts, dashboardActions, giftHistory, mobileProfileLinks, stats } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;
const formatToman = (amount) => `${new Intl.NumberFormat('fa-IR').format(Number(amount) || 0)} تومان`;
const REFERRAL_CODE = 'KEYMIAY2024';

const getActionSection = (title) => {
  if (title === 'کیف پول') return 'wallet';
  if (title === 'هدیه‌های من') return 'gifts';
  if (title === 'کد معرف') return 'referral';
  if (title === 'فرآیندها') return 'processes';
  return 'account';
};

function DashboardPage({ isVisible, sectionRequest, onLogout }) {
  const [walletData, setWalletData] = useState(getMockWallet);
  const [walletStatus, setWalletStatus] = useState('mock');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('gifts');
  const [hasCopiedReferral, setHasCopiedReferral] = useState(false);

  const walletTotalLabel = useMemo(() => formatToman(walletData.totalBalance), [walletData.totalBalance]);
  const chargedWalletsCount = walletData.wallets.filter((wallet) => wallet.balance > 0).length;
  const walletStatusLabel = walletStatus === 'api' ? 'همگام با پایگاه داده' : 'اطلاعات آزمایشی تا زمان اتصال API';

  const loadWallet = async () => {
    try {
      setIsWalletLoading(true);
      const data = await getUserWallet();
      setWalletData(data);
      setWalletStatus(data.source === 'api' ? 'api' : 'mock');
    } catch (error) {
      setWalletData(getMockWallet());
      setWalletStatus('mock');
    } finally {
      setIsWalletLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadWallet();
    }
  }, [isVisible]);

  const showSection = (section) => {
    setActiveSection(section);
    window.setTimeout(() => {
      const isMobile = window.matchMedia?.('(max-width: 768px)').matches;
      const targetId = isMobile
        ? section === 'wallet'
          ? 'mobile-wallet'
          : section === 'account'
            ? 'mobile-account'
            : 'mobile-dashboard-section'
        : 'dashboard-active-section';

      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  useEffect(() => {
    if (isVisible && sectionRequest?.section) {
      showSection(sectionRequest.section);
    }
  }, [isVisible, sectionRequest]);

  const copyReferralCode = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(REFERRAL_CODE);
      }
      setHasCopiedReferral(true);
      window.setTimeout(() => setHasCopiedReferral(false), 1800);
    } catch (error) {
      setHasCopiedReferral(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className="dashboard-page">
      <section className="mobile-dashboard">
        <section className="mobile-profile-card" id="mobile-account">
          <img src={getImageSrc(userAvatarImage)} alt="عباس شایگان" />
          <div>
            <h1>عباس شایگان</h1>
            <button type="button">مشاهده پروفایل</button>
          </div>
        </section>

        <section className="mobile-wallet-card" id="mobile-wallet">
          <div className="mobile-wallet-head">
            <span><Wallet /> کیف پول من</span>
            <strong>{walletTotalLabel}</strong>
          </div>
          <small className="wallet-sync-note">{walletStatusLabel}</small>
          <div className="mobile-wallet-list">
            {walletData.wallets.map((wallet) => (
              <article className="mobile-wallet-business" key={wallet.id}>
                <img src={wallet.image} alt={wallet.title} />
                <div>
                  <h3>{wallet.title}</h3>
                  <p>{wallet.balanceLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-dashboard-section" id="mobile-dashboard-section">
          {activeSection === 'gifts' && (
            <section className="mobile-section-card">
              <div className="mobile-section-head">
                <h2>هدیه‌های فعال من</h2>
                <span>{activeGifts.length} هدیه</span>
              </div>
              <div className="mobile-active-gifts-list">
                {activeGifts.map((gift) => (
                  <article className="mobile-active-gift" key={gift.title}>
                    <img src={gift.image} alt={gift.title} />
                    <div>
                      <h3>{gift.title}</h3>
                      <p>{gift.place}</p>
                      <span>{gift.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'processes' && (
            <section className="mobile-section-card">
              <div className="mobile-section-head">
                <h2>فرآیندها</h2>
                <span>۳ فعال</span>
              </div>
              <div className="mobile-process-list">
                <article><Clock3 /><div><h3>در انتظار تایید خرید ایبامو</h3><p>پس از تایید مجموعه، کیف پول ایبامو شارژ می‌شود.</p></div></article>
                <article><ShieldCheck /><div><h3>کش‌بک رستوران ملل</h3><p>اعتبار بعد از ثبت نهایی سفارش اضافه می‌شود.</p></div></article>
                <article><Check /><div><h3>هدیه باستانی</h3><p>کد هدیه آماده استفاده است.</p></div></article>
              </div>
            </section>
          )}

          {activeSection === 'referral' && (
            <section className="mobile-section-card mobile-referral-card">
              <h2>کد معرف شما</h2>
              <strong>{REFERRAL_CODE}</strong>
              <button type="button" onClick={copyReferralCode}>{hasCopiedReferral ? 'کپی شد' : 'اشتراک گذاری'}</button>
            </section>
          )}
        </section>

        <section className="mobile-profile-menu">
          {mobileProfileLinks.map(({ title, icon: Icon }) => {
            const section = getActionSection(title);

            return (
              <button
                className={`mobile-profile-item ${activeSection === section ? 'is-active' : ''}`}
                type="button"
                key={title}
                onClick={() => showSection(section)}
              >
                <Icon />
                <span>{title}</span>
              </button>
            );
          })}
          <button className="mobile-profile-item" type="button" onClick={onLogout}>
            <LogOut />
            <span>خروج از حساب</span>
          </button>
        </section>
      </section>

      <section className="dashboard-hero desktop-dashboard-block" id="dashboard-account">
        <div className="hero-lines" />
        <img className="dashboard-avatar" src={getImageSrc(userAvatarImage)} alt="عباس شایگان" />
        <div className="dashboard-user-copy">
          <h1><Crown /> عباس شایگان</h1>
          <p>سطح شما: <span>طلایی</span></p>
          <strong>۲۸,۵۰۰ امتیاز</strong>
        </div>
      </section>

      <section className="dashboard-actions desktop-dashboard-block" aria-label="بخش‌های داشبورد">
        {dashboardActions.map(({ title, icon: Icon }) => {
          const section = getActionSection(title);

          return (
            <button
              className={`dashboard-action-card ${activeSection === section ? 'is-active' : ''}`}
              type="button"
              key={title}
              onClick={() => showSection(section)}
              aria-pressed={activeSection === section}
            >
              <Icon />
              <span>{title}</span>
            </button>
          );
        })}
      </section>

      <div className="desktop-dashboard-block dashboard-dynamic-section" id="dashboard-active-section">
        {activeSection === 'account' && (
          <section className="panel account-panel">
            <div className="panel-head-row">
              <h2>اطلاعات حساب</h2>
              <span className="dashboard-section-badge">فعال</span>
            </div>
            <div className="account-info-grid">
              <article><span>نام کاربر</span><strong>عباس شایگان</strong></article>
              <article><span>سطح عضویت</span><strong>طلایی</strong></article>
              <article><span>امتیاز کل</span><strong>۲۸,۵۰۰</strong></article>
            </div>
          </section>
        )}

        {activeSection === 'wallet' && (
          <section className="panel wallet-panel" id="wallet">
            <div className="wallet-summary">
              <div>
                <span className="wallet-eyebrow">کیف پول اختصاصی کسب‌وکارها</span>
                <h2><Wallet /> کیف پول من</h2>
                <p>اعتبار هر کسب‌وکار جداگانه شارژ می‌شود و فقط برای همان مجموعه قابل استفاده است.</p>
                <div className="wallet-sync-row">
                  <span className="wallet-sync-note">{walletStatusLabel}</span>
                  <button className="wallet-refresh-btn" type="button" onClick={loadWallet} disabled={isWalletLoading}>
                    <RefreshCw />
                    {isWalletLoading ? 'در حال بروزرسانی' : 'بروزرسانی'}
                  </button>
                </div>
              </div>
              <div className="wallet-total-card">
                <span>موجودی کل قابل مشاهده</span>
                <strong>{walletTotalLabel}</strong>
                <small>{chargedWalletsCount} کیف پول شارژ شده</small>
              </div>
            </div>

            <div className="wallet-business-grid">
              {walletData.wallets.map((wallet) => (
                <article className={`wallet-business-card ${wallet.balance === 0 ? 'is-empty' : ''}`} key={wallet.id}>
                  <img src={wallet.image} alt={wallet.title} />
                  <div>
                    <h3>{wallet.title}</h3>
                    <strong>{wallet.balanceLabel}</strong>
                    <span>{wallet.status}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="wallet-history">
              <h3>تراکنش‌های اخیر کیف پول</h3>
              {walletData.transactions.map((transaction) => {
                const isCredit = transaction.amount.startsWith('+');
                const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

                return (
                  <article className="wallet-history-item" key={`${transaction.business}-${transaction.date}-${transaction.amount}`}>
                    <Icon />
                    <div>
                      <strong>{transaction.business}</strong>
                      <span>{transaction.type}</span>
                    </div>
                    <p>{transaction.date}</p>
                    <b className={isCredit ? 'is-credit' : 'is-debit'}>{transaction.amount}</b>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeSection === 'gifts' && (
          <section className="panel active-gifts-panel" id="all-active-gifts">
            <div className="panel-head-row">
              <h2>هدیه‌های فعال من</h2>
              <button type="button" className="dashboard-inline-action">مشاهده همه</button>
            </div>
            <div className="active-gifts-grid">
              {activeGifts.map((gift) => (
                <article className="active-gift-card" key={gift.title}>
                  <img src={gift.image} alt={gift.title} />
                  <div>
                    <h3>{gift.title}</h3>
                    <p>{gift.place}</p>
                    <span>{gift.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'processes' && (
          <section className="panel process-panel">
            <div className="panel-head-row">
              <h2>فرآیندها و کش‌بک‌ها</h2>
              <span className="dashboard-section-badge">۳ مورد فعال</span>
            </div>
            <div className="process-list">
              <article><Clock3 /><div><h3>در انتظار تایید خرید ایبامو</h3><p>پس از تایید مجموعه، کیف پول ایبامو شارژ می‌شود.</p></div><span>در حال بررسی</span></article>
              <article><ShieldCheck /><div><h3>کش‌بک رستوران ملل</h3><p>اعتبار پس از ثبت نهایی سفارش به کیف پول همان مجموعه اضافه می‌شود.</p></div><span>فعال</span></article>
              <article><Check /><div><h3>هدیه باستانی</h3><p>کد هدیه دریافت شده و آماده استفاده است.</p></div><span>آماده استفاده</span></article>
            </div>
          </section>
        )}

        {activeSection === 'referral' && (
          <section className="invite-card referral-panel">
            <h2><ChevronLeft /> دعوت از دوستان</h2>
            <p>دوستان خود را دعوت کنید و امتیاز بگیرید</p>
            <div className="invite-row">
              <div className="invite-code">{REFERRAL_CODE}</div>
              <div>
                <span>کد معرف شما</span>
                <button type="button" onClick={copyReferralCode}>
                  {hasCopiedReferral ? <Check /> : <Copy />}
                  {hasCopiedReferral ? 'کپی شد' : 'اشتراک گذاری'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <section className="dashboard-bottom-grid desktop-dashboard-block">
        <section className="panel history-panel">
          <h2>تاریخچه هدایا</h2>
          <div className="history-list">
            {giftHistory.map((item) => (
              <article className="history-item" key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="dashboard-side-stack">
          <section className="panel stats-panel">
            <h2>آمار شما</h2>
            <div className="stats-row">
              {stats.map((stat) => (
                <div className="stat-item" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;



