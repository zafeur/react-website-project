import { ChevronLeft, Crown, LogOut } from 'lucide-react';
import userAvatarImage from '../assets/images/user-avatar.jpg';
import { activeGifts, dashboardActions, giftHistory, mobileProfileLinks, stats } from '../data/siteData';

const getImageSrc = (image) => image?.src || image;

function DashboardPage({ isVisible, onLogout }) {
  if (!isVisible) {
    return null;
  }

  return (
    <section className="dashboard-page">
      <section className="mobile-dashboard">
        <section className="mobile-profile-card">
          <img src={getImageSrc(userAvatarImage)} alt="عباس شایگان" />
          <div>
            <h1>عباس شایگان</h1>
            <button type="button">مشاهده پروفایل</button>
          </div>
        </section>

        <section className="mobile-profile-menu">
          {mobileProfileLinks.map(({ title, icon: Icon }) => (
            <button className="mobile-profile-item" type="button" key={title}>
              <Icon />
              <span>{title}</span>
            </button>
          ))}
          <button className="mobile-profile-item" type="button" onClick={onLogout}>
            <LogOut />
            <span>خروج از حساب</span>
          </button>
        </section>
      </section>

      <section className="dashboard-hero desktop-dashboard-block">
        <div className="hero-lines" />
        <img className="dashboard-avatar" src={getImageSrc(userAvatarImage)} alt="عباس شایگان" />
        <div className="dashboard-user-copy">
          <h1><Crown /> عباس شایگان</h1>
          <p>سطح شما: <span>طلایی</span></p>
          <strong>۲۸,۵۰۰ امتیاز</strong>
        </div>
      </section>

      <section className="dashboard-actions desktop-dashboard-block">
        {dashboardActions.map(({ title, icon: Icon }) => (
          <button className="dashboard-action-card" type="button" key={title}>
            <Icon />
            <span>{title}</span>
          </button>
        ))}
      </section>

      <section className="panel active-gifts-panel desktop-dashboard-block">
        <div className="panel-head-row">
          <h2>هدیه‌های فعال من</h2>
          <a href="#all-active-gifts">مشاهده همه</a>
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
          <section className="invite-card">
            <h2><ChevronLeft /> دعوت از دوستان</h2>
            <p>دوستان خود را دعوت کنید و امتیاز بگیرید</p>
            <div className="invite-row">
              <div className="invite-code">KEYMIAY2024</div>
              <div>
                <span>کد معرف شما</span>
                <button type="button">اشتراک گذاری</button>
              </div>
            </div>
          </section>

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
