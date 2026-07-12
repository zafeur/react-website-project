import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Gift,
  Handshake,
  HelpCircle,
  Megaphone,
  Moon,
  Send,
  Sun,
  Store,
} from 'lucide-react';
import { submitMembershipRequest } from '../api/membership';
import MobileBottomNav from './MobileBottomNav';
import { hasAuthToken } from '../helper/authCookie';

const nav = {
  brand: 'کی میای',
  home: 'صفحه اصلی',
  gifts: 'هدایا',
  businesses: 'کسب‌وکارها',
  faq: 'سوالات متداول',
  contact: 'تماس با ما',
};

const customerSteps = [
  { title: 'از یکی خرید می‌کنی', text: 'از هر کسب‌وکار عضو کی‌میای خرید یا خدمات دریافت می‌کنی.' },
  { title: 'هدیه‌ات فعال می‌شود', text: 'بعد از ثبت خرید، هدیه‌های اختصاصی سایر مجموعه‌های عضو برایت فعال می‌شود.' },
  { title: 'از هدیه‌ها استفاده می‌کنی', text: 'می‌توانی در مدت اعتبار کمپین به مجموعه‌های دیگر مراجعه کرده و هدیه‌های خود را دریافت کنی.' },
  { title: 'با کسب‌وکارهای جدید آشنا می‌شوی', text: 'هر خرید، تو را با خدمات و برندهای جدید شهر آشنا می‌کند.' },
  { title: 'همه برنده‌اند', text: 'مشتری تجربه‌های جدید به دست می‌آورد و کسب‌وکارها بدون رقابت ناسالم، مشتریان جدید جذب می‌کنند.' },
];

const businessSteps = [
  'درخواست عضویت ثبت می‌کنید.',
  'تیم کی‌میای مجموعه شما را بررسی می‌کند.',
  'هدیه یا مزیت مناسب کسب‌وکارتان طراحی می‌شود.',
  'مجموعه شما به کمپین اضافه می‌شود.',
  'از طریق تبلیغات شهری، اینستاگرام، پیامک و سایر اعضای شبکه، مشتریان جدید با کسب‌وکار شما آشنا می‌شوند.',
  'گزارش عملکرد کمپین و نتایج همکاری را دریافت می‌کنید.',
];

const faqs = [
  { question: 'آیا عضویت رایگان است؟', answer: 'فرآیند بررسی اولیه رایگان است و پس از تأیید، شرایط همکاری اعلام می‌شود.' },
  { question: 'هدیه را چه کسی تعیین می‌کند؟', answer: 'هدیه توسط خود مجموعه پیشنهاد می‌شود و تیم کی‌میای برای جذاب‌تر شدن آن مشاوره می‌دهد.' },
  { question: 'اگر ظرفیت کمپین تکمیل شود چه می‌شود؟', answer: 'مجموعه در لیست انتظار کمپین بعدی قرار می‌گیرد.' },
  { question: 'آیا همه صنف‌ها می‌توانند عضو شوند؟', answer: 'خیر. کی‌میای برای حفظ کیفیت شبکه، تعداد مشخصی مجموعه از هر صنف را پذیرش می‌کند.' },
  { question: 'چقدر طول می‌کشد تا عضو شوم؟', answer: 'معمولاً بین ۲۴ تا ۷۲ ساعت پس از ثبت درخواست.' },
];

const trustItems = [
  'بیش از ۴۱۰۰ استفاده از پلتفرم در اولین کمپین',
  'ده‌ها کسب‌وکار عضو شبکه',
  'کمپین‌های مشترک شهری',
  'تبلیغات محیطی',
  'تبلیغات دیجیتال',
  'همکاری با بلاگرهای شهر',
  'باشگاه مشتریان',
];

const collectionFields = [
  { name: 'businessName', label: 'نام مجموعه', required: true },
  { name: 'managerName', label: 'نام مدیر', required: true },
  { name: 'phone', label: 'شماره تماس', type: 'tel', required: true },
  { name: 'whatsapp', label: 'واتساپ', type: 'tel' },
  { name: 'address', label: 'آدرس', type: 'textarea', required: true },
  { name: 'googleLocation', label: 'لوکیشن گوگل' },
  { name: 'instagram', label: 'اینستاگرام' },
  { name: 'website', label: 'وب‌سایت' },
];

const businessFields = [
  { name: 'category', label: 'صنف', required: true },
  { name: 'area', label: 'متراژ' },
  { name: 'foundedYear', label: 'سال تأسیس' },
  { name: 'staffCount', label: 'تعداد پرسنل' },
  { name: 'branchCount', label: 'تعداد شعب' },
  { name: 'dailyVisits', label: 'میانگین مراجعه روزانه' },
  { name: 'cooperationProposal', label: 'پیشنهاد همکاری', type: 'textarea' },
  { name: 'suggestedGift', label: 'هدیه پیشنهادی برای مشتریان', required: true },
  { name: 'giftValue', label: 'ارزش تقریبی هدیه' },
  { name: 'suggestedDiscount', label: 'تخفیف پیشنهادی (در صورت تمایل)' },
  { name: 'giftDescription', label: 'توضیح هدیه', type: 'textarea' },
];

const marketingFields = [
  { name: 'hasSmsPanel', label: 'آیا پنل پیامکی دارید؟' },
  { name: 'hasCustomerClub', label: 'آیا باشگاه مشتریان دارید؟' },
  { name: 'hasWebsite', label: 'آیا سایت دارید؟' },
  { name: 'canAdvertise', label: 'آیا امکان همکاری تبلیغاتی دارید؟' },
];

const initialForm = [...collectionFields, ...businessFields, ...marketingFields].reduce((acc, field) => {
  acc[field.name] = '';
  return acc;
}, {});

function Field({ field, value, onChange, isActive }) {
  if (field.type === 'textarea') {
    return (
      <label className="faq-field faq-field-wide">
        <span>{field.label}{field.required ? ' *' : ''}</span>
        <textarea name={field.name} value={value} onChange={onChange} required={field.required && isActive} rows={3} />
      </label>
    );
  }

  return (
    <label className="faq-field">
      <span>{field.label}{field.required ? ' *' : ''}</span>
      <input name={field.name} type={field.type || 'text'} value={value} onChange={onChange} required={field.required && isActive} />
    </label>
  );
}

function ToggleField({ field, value, onChange }) {
  return (
    <label className="faq-field">
      <span>{field.label}</span>
      <select name={field.name} value={value} onChange={onChange}>
        <option value="">انتخاب کنید</option>
        <option value="yes">بله</option>
        <option value="no">خیر</option>
      </select>
    </label>
  );
}

function FaqMembershipPage({ isDarkMode = false, onToggleTheme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasAuthToken());
  }, []);

  const formTitle = activeStep === 0 ? 'اطلاعات مجموعه' : 'اطلاعات کسب‌وکار و مارکتینگ';
  const progressText = activeStep === 0 ? '۱ از ۲' : '۲ از ۲';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = () => {
    setStatus({ type: '', message: '' });
    setActiveStep(1);
  };

  const goBack = () => {
    setStatus({ type: '', message: '' });
    setActiveStep(0);
  };

  const handleMobileNav = (id) => {
    if (id === 'home') {
      window.location.href = '/';
      return;
    }

    if (id === 'shop') {
      window.location.href = '/restaurant';
      return;
    }

    if (id === 'gifts') {
      window.location.href = '/#gifts';
      return;
    }

    if (id === 'faq') {
      window.location.href = '/faq';
      return;
    }

    window.location.href = isLoggedIn ? '/dashboard' : '/restaurant';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (activeStep === 0) {
      goNext();
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: '', message: '' });
      await submitMembershipRequest({
        collection: {
          businessName: form.businessName,
          managerName: form.managerName,
          phone: form.phone,
          whatsapp: form.whatsapp,
          address: form.address,
          googleLocation: form.googleLocation,
          instagram: form.instagram,
          website: form.website,
        },
        business: {
          category: form.category,
          area: form.area,
          foundedYear: form.foundedYear,
          staffCount: form.staffCount,
          branchCount: form.branchCount,
          dailyVisits: form.dailyVisits,
          cooperationProposal: form.cooperationProposal,
          suggestedGift: form.suggestedGift,
          giftValue: form.giftValue,
          suggestedDiscount: form.suggestedDiscount,
          giftDescription: form.giftDescription,
        },
        marketing: {
          hasSmsPanel: form.hasSmsPanel,
          hasCustomerClub: form.hasCustomerClub,
          hasWebsite: form.hasWebsite,
          canAdvertise: form.canAdvertise,
        },
      });
      setStatus({ type: 'success', message: 'درخواست شما ثبت شد. تیم کی‌میای پس از بررسی با شما تماس می‌گیرد.' });
      setForm(initialForm);
      setActiveStep(0);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'ارسال اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`page-shell faq-shell ${isDarkMode ? "theme-dark" : ""}`} dir="rtl">
      <section className="frame faq-frame">
        <header className="topbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="brand d-flex align-items-center" href="/" aria-label={nav.home}>
              <Gift className="brand-icon" />
              <span>{nav.brand}</span>
            </Link>
            <nav>
              <ul className="nav-list d-flex align-items-center">
                <li><Link href="/">{nav.home}</Link></li>
                <li><Link href="/#gifts">{nav.gifts}</Link></li>
                <li><Link href="/#brands">{nav.businesses}</Link></li>
                <li><Link href="/faq" className="active-link">{nav.faq}</Link></li>
                <li><Link href="/#footer">{nav.contact}</Link></li>
              </ul>
            </nav>
          </div>
          <div className="home-header-actions">
            <button
              className={`home-theme-toggle ${isDarkMode ? 'is-dark' : ''}`}
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              <span className="home-theme-toggle-icon home-theme-toggle-sun"><Sun /></span>
              <span className="home-theme-toggle-thumb" />
              <span className="home-theme-toggle-icon home-theme-toggle-moon"><Moon /></span>
            </button>
            <Link className="login-btn faq-header-action" href="#membership-form">{'\u0628\u0631\u0631\u0633\u06cc \u0631\u0627\u06cc\u06af\u0627\u0646 \u0634\u0631\u0627\u06cc\u0637 \u0639\u0636\u0648\u06cc\u062a'}</Link>
          </div>
        </header>

        <section className="faq-hero">
          <div className="faq-hero-copy">
            <span className="faq-eyebrow">سایت دیدار</span>
            <h1>بررسی رایگان شرایط عضویت</h1>
            <p>کاربران ابتدا با روند دریافت هدیه و شرایط همکاری آشنا می‌شوند، سپس اطلاعات مجموعه و کسب‌وکار خود را برای بررسی اولیه ارسال می‌کنند.</p>
            <a className="faq-primary-link" href="#membership-form">شروع ثبت درخواست</a>
          </div>
          <div className="faq-hero-card">
            <HelpCircle />
            <strong>سوالات متداول</strong>
            <span>پاسخ‌های کوتاه، فرم مرحله‌ای و ارسال اطلاعات به بک‌اند</span>
          </div>
        </section>

        <section className="faq-section faq-flow-section">
          <div className="faq-section-head">
            <span>برای مشتریان</span>
            <h2>کی‌میای چطور کار می‌کند؟</h2>
          </div>
          <div className="faq-customer-flow">
            {customerSteps.map((step, index) => (
              <article className="faq-step-card" key={step.title}>
                <span className="faq-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section faq-two-column">
          <div>
            <div className="faq-section-head">
              <span>برای کسب‌وکارها</span>
              <h2>مسیر عضویت مجموعه‌ها</h2>
            </div>
            <ol className="faq-business-flow">
              {businessSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>

          <aside className="faq-trust-card">
            <div className="faq-trust-icon"><Handshake /></div>
            <span>چرا کسب‌وکارها به کی‌میای اعتماد می‌کنند؟</span>
            <ul>
              {trustItems.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}
            </ul>
          </aside>
        </section>

        <section className="faq-section">
          <div className="faq-section-head">
            <span>پرسش‌ها</span>
            <h2>سوالات متداول</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="faq-section faq-form-section" id="membership-form">
          <div className="faq-form-intro">
            <div>
              <span>فرم درخواست عضویت</span>
              <h2>{formTitle}</h2>
              <p>اطلاعات را مرحله‌به‌مرحله وارد کنید. پس از تکمیل مرحله دوم، درخواست برای بررسی به بک‌اند ارسال می‌شود.</p>
            </div>
            <div className="faq-form-progress">
              <span>{progressText}</span>
              <div><i style={{ width: activeStep === 0 ? '50%' : '100%' }} /></div>
            </div>
          </div>

          <form className="faq-slider-form" onSubmit={handleSubmit}>
            <div className="faq-form-window">
              {activeStep === 0 ? (
                <section className="faq-form-slide" aria-label="\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0645\u062c\u0645\u0648\u0639\u0647">
                  <div className="faq-form-title"><Store />{'\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0645\u062c\u0645\u0648\u0639\u0647'}</div>
                  <div className="faq-form-grid">
                    {collectionFields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={handleChange} isActive />)}
                  </div>
                </section>
              ) : (
                <section className="faq-form-slide" aria-label="\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631 \u0648 \u0645\u0627\u0631\u06a9\u062a\u06cc\u0646\u06af">
                  <div className="faq-form-title"><BarChart3 />{'\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u06a9\u0633\u0628\u200c\u0648\u06a9\u0627\u0631'}</div>
                  <div className="faq-form-grid">
                    {businessFields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={handleChange} isActive />)}
                  </div>

                  <div className="faq-form-title faq-form-title-spaced"><Megaphone />{'\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0645\u0627\u0631\u06a9\u062a\u06cc\u0646\u06af'}</div>
                  <div className="faq-form-grid faq-marketing-grid">
                    {marketingFields.map((field) => <ToggleField key={field.name} field={field} value={form[field.name]} onChange={handleChange} />)}
                  </div>
                </section>
              )}
            </div>

            {status.message && <p className={'faq-status faq-status-' + status.type}>{status.message}</p>}

            <div className="faq-form-actions">
              <button className="faq-secondary-btn" type="button" onClick={goBack} disabled={activeStep === 0 || isSubmitting}>
                <ArrowRight /> مرحله قبل
              </button>
              <button className="faq-submit-btn" type="submit" disabled={isSubmitting}>
                {activeStep === 0 ? 'مرحله بعد' : isSubmitting ? 'در حال ارسال...' : 'ارسال اطلاعات'}
                {activeStep === 0 ? <ArrowLeft /> : <Send />}
              </button>
            </div>
          </form>
        </section>
      </section>

      <MobileBottomNav currentPage="faq" isLoggedIn={isLoggedIn} onNavigate={handleMobileNav} />
    </main>
  );
}

export default FaqMembershipPage;
