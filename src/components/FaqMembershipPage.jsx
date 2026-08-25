import { faqGroups } from '../data/faqData';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BadgePercent,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  Gift,
  Globe,
  Handshake,
  HelpCircle,
  Megaphone,
  MessageSquare,
  Monitor,
  Moon,
  Phone,
  Ruler,
  Send,
  Smartphone,
  Store,
  Sun,
  TrendingUp,
  User,
  UserRoundCheck,
  Users,
} from 'lucide-react';

import { submitMembershipRequest } from '../api/membership';
import MobileBottomNav from './MobileBottomNav';
import { hasAuthToken } from '../helper/authCookie';
import { brandAssets } from '../data/brandAssets';

const nav = {
  brand: 'کی میای',
  home: 'صفحه اصلی',
  gifts: 'هدایا',
  businesses: 'کسب‌وکارها',
  faq: 'سوالات متداول',
  contact: 'تماس با ما',
};

const customerSteps = [
  {
    title: 'از یکی خرید می‌کنی',
    text: 'از هر کسب‌وکار عضو کی‌میای خرید یا خدمات دریافت می‌کنی.',
  },
  {
    title: 'هدیه‌ات فعال می‌شود',
    text: 'بعد از ثبت خرید، هدیه‌های اختصاصی سایر مجموعه‌های عضو برایت فعال می‌شود.',
  },
  {
    title: 'از هدیه‌ها استفاده می‌کنی',
    text: 'می‌توانی در مدت اعتبار کمپین به مجموعه‌های دیگر مراجعه کرده و هدیه‌های خود را دریافت کنی.',
  },
  {
    title: 'با کسب‌وکارهای جدید آشنا می‌شوی',
    text: 'هر خرید، تو را با خدمات و برندهای جدید شهر آشنا می‌کند.',
  },
  {
    title: 'همه برنده‌اند',
    text: 'مشتری تجربه‌های جدید به دست می‌آورد و کسب‌وکارها مشتریان جدید جذب می‌کنند.',
  },
];

const businessSteps = [
  'درخواست عضویت ثبت می‌کنید.',
  'تیم کی‌میای مجموعه شما را بررسی می‌کند.',
  'هدیه یا مزیت مناسب کسب‌وکارتان طراحی می‌شود.',
  'مجموعه شما به کمپین اضافه می‌شود.',
  'از طریق تبلیغات شهری، اینستاگرام، پیامک و سایر اعضای شبکه، مشتریان جدید با کسب‌وکار شما آشنا می‌شوند.',
  'گزارش عملکرد کمپین و نتایج همکاری را دریافت می‌کنید.',
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
  {
    name: 'businessName',
    label: 'نام مجموعه',
    required: true,
    icon: Store,
  },
  {
    name: 'managerName',
    label: 'نام مدیر',
    required: true,
    icon: UserRoundCheck,
  },
  {
    name: 'phone',
    label: 'شماره تماس',
    type: 'tel',
    required: true,
    icon: Phone,
  },
  {
    name: 'whatsapp',
    label: 'واتساپ',
    type: 'tel',
    icon: MessageSquare,
  },
  {
    name: 'address',
    label: 'آدرس',
    type: 'textarea',
    required: true,
    icon: Building2,
  },
  {
    name: 'googleLocation',
    label: 'لوکیشن گوگل',
    icon: Globe,
  },
  {
    name: 'instagram',
    label: 'اینستاگرام',
    icon: MessageSquare,
  },
  {
    name: 'website',
    label: 'وب‌سایت',
    icon: Globe,
  },
];

const businessFields = [
  {
    name: 'category',
    label: 'صنف',
    required: true,
    icon: Store,
  },
  {
    name: 'area',
    label: 'متراژ',
    icon: Ruler,
  },
  {
    name: 'foundedYear',
    label: 'سال تأسیس',
    icon: CalendarDays,
  },
  {
    name: 'staffCount',
    label: 'تعداد پرسنل',
    icon: Users,
  },
  {
    name: 'branchCount',
    label: 'تعداد شعب',
    icon: Building2,
  },
  {
    name: 'dailyVisits',
    label: 'میانگین مراجعه روزانه',
    icon: TrendingUp,
  },
  {
    name: 'cooperationProposal',
    label: 'پیشنهاد همکاری',
    type: 'textarea',
    icon: Handshake,
  },
  {
    name: 'suggestedGift',
    label: 'هدیه پیشنهادی برای مشتریان',
    required: true,
    icon: Gift,
  },
  {
    name: 'giftValue',
    label: 'ارزش تقریبی هدیه',
    icon: BadgePercent,
  },
  {
    name: 'suggestedDiscount',
    label: 'تخفیف پیشنهادی',
    icon: BadgePercent,
  },
  {
    name: 'giftDescription',
    label: 'توضیح هدیه',
    type: 'textarea',
    icon: FileText,
  },
];

const marketingFields = [
  {
    name: 'hasSmsPanel',
    label: 'آیا پنل پیامکی دارید؟',
    icon: Smartphone,
  },
  {
    name: 'hasCustomerClub',
    label: 'آیا باشگاه مشتریان دارید؟',
    icon: Users,
  },
  {
    name: 'hasWebsite',
    label: 'آیا سایت دارید؟',
    icon: Monitor,
  },
  {
    name: 'canAdvertise',
    label: 'آیا امکان همکاری تبلیغاتی دارید؟',
    icon: Megaphone,
  },
];

const initialForm = [
  ...collectionFields,
  ...businessFields,
  ...marketingFields,
].reduce((acc, field) => {
  acc[field.name] = '';
  return acc;
}, {});


function Field({ field, value, onChange, isActive }) {
  const Icon = field.icon || FileText;

  if (field.type === 'textarea') {
    return (
      <label className="faq-field faq-field-wide">
        <span className="faq-field-label">
          <span className="faq-field-icon">
            <Icon />
          </span>

          <span className="faq-field-label-text">
            {field.label}
            {field.required ? ' *' : ''}
          </span>
        </span>

        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          required={field.required && isActive}
          rows={3}
        />
      </label>
    );
  }

  return (
    <label className="faq-field">
      <span className="faq-field-label">
        <span className="faq-field-icon">
          <Icon />
        </span>

        <span className="faq-field-label-text">
          {field.label}
          {field.required ? ' *' : ''}
        </span>
      </span>

      <input
        name={field.name}
        type={field.type || 'text'}
        value={value}
        onChange={onChange}
        required={field.required && isActive}
      />
    </label>
  );
}


function ToggleField({ field, value, onChange }) {
  const Icon = field.icon || HelpCircle;

  return (
    <label className="faq-field">
      <span className="faq-field-label">
        <span className="faq-field-icon">
          <Icon />
        </span>

        <span className="faq-field-label-text">
          {field.label}
        </span>
      </span>

      <select
        name={field.name}
        value={value}
        onChange={onChange}
      >
        <option value="">انتخاب کنید</option>
        <option value="yes">بله</option>
        <option value="no">خیر</option>
      </select>
    </label>
  );
}


function FaqMembershipPage({
  isDarkMode = false,
  onToggleTheme,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasAuthToken());
  }, []);

  const formTitle =
    activeStep === 0
      ? 'اطلاعات مجموعه'
      : 'اطلاعات کسب‌وکار و مارکتینگ';

  const progressText =
    activeStep === 0
      ? '۱ از ۲'
      : '۲ از ۲';


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const goNext = () => {
    setStatus({
      type: '',
      message: '',
    });

    setActiveStep(1);
  };


  const goBack = () => {
    setStatus({
      type: '',
      message: '',
    });

    setActiveStep(0);
  };


  const handleMobileNav = (id) => {
    if (id === 'home') {
      window.location.href = '/';
      return;
    }

    if (id === 'shop') {
      window.location.href = '/#brands';
      return;
    }

    if (id === 'gifts') {
      window.location.href = '/gifts';
      return;
    }

    if (id === 'faq') {
      window.location.href = '/faq';
      return;
    }

    window.location.href = '/dashboard';
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (activeStep === 0) {
      goNext();
      return;
    }

    try {
      setIsSubmitting(true);

      setStatus({
        type: '',
        message: '',
      });

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

      setStatus({
        type: 'success',
        message:
          'درخواست شما ثبت شد. تیم کی‌میای پس از بررسی با شما تماس می‌گیرد.',
      });

      setForm(initialForm);
      setActiveStep(0);

    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'ارسال اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.',
      });

    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main
      className={`page-shell faq-shell ${
        isDarkMode ? 'theme-dark' : ''
      }`}
      dir="rtl"
    >

      <section className="frame faq-frame">

        {/* ================= HEADER ================= */}

        <header className="topbar d-flex align-items-center justify-content-between">

          <div className="d-flex align-items-center">

            <Link
              className="brand d-flex align-items-center"
              href="/"
              aria-label={nav.home}
            >
              <img
                className="brand-logo-type"
                src={brandAssets.logoType}
                alt={nav.brand}
              />
            </Link>

            <nav>
              <ul className="nav-list d-flex align-items-center">

                <li>
                  <Link href="/">
                    {nav.home}
                  </Link>
                </li>

                <li>
                  <Link href="/gifts">
                    {nav.gifts}
                  </Link>
                </li>

                <li>
                  <Link href="/#brands">
                    {nav.businesses}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    className="active-link"
                  >
                    {nav.faq}
                  </Link>
                </li>

                <li>
                  <Link href="/contact">
                    {nav.contact}
                  </Link>
                </li>

              </ul>
            </nav>

          </div>


          <div className="home-header-actions">

            <button
              className={`home-theme-toggle ${
                isDarkMode ? 'is-dark' : ''
              }`}
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDarkMode
                  ? 'Light mode'
                  : 'Dark mode'
              }
            >
              <span className="home-theme-toggle-icon home-theme-toggle-sun">
                <Sun />
              </span>

              <span className="home-theme-toggle-thumb" />

              <span className="home-theme-toggle-icon home-theme-toggle-moon">
                <Moon />
              </span>
            </button>


            <Link
              className="login-btn faq-header-action"
              href="#membership-form"
            >
              بررسی رایگان شرایط عضویت
            </Link>

          </div>

        </header>


        {/* ================= HERO ================= */}

        <section className="faq-hero">

          <div className="faq-hero-copy">

            <span className="faq-eyebrow">
              سایت دیدار
            </span>

            <h1>
              بررسی رایگان شرایط عضویت
            </h1>

            <p>
              کاربران ابتدا با روند دریافت هدیه و شرایط
              همکاری آشنا می‌شوند، سپس اطلاعات مجموعه و
              کسب‌وکار خود را برای بررسی اولیه ارسال می‌کنند.
            </p>

            <a
              className="faq-primary-link"
              href="#membership-form"
            >
              شروع ثبت درخواست
              <ArrowLeft />
            </a>

          </div>

        </section>


        {/* ================= CUSTOMER FLOW ================= */}

        <section className="faq-section faq-flow-section">

          <div className="faq-section-head">

            <span>
              برای مشتریان
            </span>

            <h2>
              کی‌میای چطور کار می‌کند؟
            </h2>

          </div>


          <div className="faq-customer-flow">

            {customerSteps.map((step, index) => (

              <article
                className="faq-step-card"
                key={step.title}
              >

                <span className="faq-step-number">
                  {index + 1}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>

              </article>

            ))}

          </div>

        </section>


        {/* ================= BUSINESS ================= */}

        <section className="faq-section faq-two-column">

          <div>

            <div className="faq-section-head">

              <span>
                برای کسب‌وکارها
              </span>

              <h2>
                مسیر عضویت مجموعه‌ها
              </h2>

            </div>


            <ol className="faq-business-flow">

              {businessSteps.map((step) => (

                <li key={step}>
                  {step}
                </li>

              ))}

            </ol>

          </div>


          <aside className="faq-trust-card">

            <div className="faq-trust-icon">
              <Handshake />
            </div>

            <span>
              چرا کسب‌وکارها به کی‌میای اعتماد می‌کنند؟
            </span>

            <ul>

              {trustItems.map((item) => (

                <li key={item}>
                  <CheckCircle2 />
                  <span>{item}</span>
                </li>

              ))}

            </ul>

          </aside>

        </section>


        {/* ================= FAQ ================= */}

        <section className="faq-section faq-all-section">

          <div className="faq-section-head faq-main-heading">

            <span className="faq-heading-badge">
              <HelpCircle />
              راهنمای کی‌میای
            </span>

            <h2>
              سؤالات متداول کی‌میای
            </h2>

            <p>
              پاسخ پرسش‌های رایج مشتریان و کسب‌وکارها
              درباره کی‌میای، هدایا، تخفیف‌ها و کمپین‌ها.
            </p>

          </div>


          <div className="faq-groups">

            {faqGroups.map((group, groupIndex) => (

              <div
                className="faq-group"
                key={group.title}
              >

                <div className="faq-group-title">

                  <div className="faq-group-icon">
                    {groupIndex === 0 ? (
                      <User />
                    ) : groupIndex === 1 ? (
                      <Store />
                    ) : (
                      <Megaphone />
                    )}
                  </div>

                  <div>
                    <span>
                      {groupIndex === 0
                        ? 'راهنمای مشتریان'
                        : groupIndex === 1
                        ? 'راهنمای کسب‌وکارها'
                        : 'راهنمای کمپین‌ها'}
                    </span>

                    <h3>
                      {group.title}
                    </h3>
                  </div>

                </div>


                <div className="faq-list">

                  {group.questions.map((item, index) => (

                    <details
                      className="faq-item"
                      key={item.question}
                    >

                      <summary>

                        <span className="faq-question-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="faq-question-text">
                          {item.question}
                        </span>

                        <span className="faq-question-arrow">
                          <ChevronDown />
                        </span>

                      </summary>


                      <div className="faq-answer">

                        <span className="faq-answer-line" />

                        <p>
                          {item.answer}
                        </p>

                      </div>

                    </details>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================= FORM ================= */}

        <section
          className="faq-section faq-form-section"
          id="membership-form"
        >

          <div className="faq-form-intro">

            <div>

              <span>
                فرم درخواست عضویت
              </span>

              <h2>
                {formTitle}
              </h2>

              <p>
                اطلاعات را مرحله‌به‌مرحله وارد کنید.
                پس از تکمیل مرحله دوم، درخواست برای بررسی
                به بک‌اند ارسال می‌شود.
              </p>

            </div>


            <div className="faq-form-progress">

              <span>
                {progressText}
              </span>

              <div>
                <i
                  style={{
                    width:
                      activeStep === 0
                        ? '50%'
                        : '100%',
                  }}
                />
              </div>

            </div>

          </div>


          <form
            className="faq-slider-form"
            onSubmit={handleSubmit}
          >

            <div className="faq-form-window">

              {activeStep === 0 ? (

                <section
                  className="faq-form-slide"
                  aria-label="اطلاعات مجموعه"
                >

                  <div className="faq-form-title">

                    <span className="faq-form-title-icon">
                      <Building2 />
                    </span>

                    <span>
                      اطلاعات مجموعه
                    </span>

                  </div>


                  <div className="faq-form-grid">

                    {collectionFields.map((field) => (

                      <Field
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={handleChange}
                        isActive
                      />

                    ))}

                  </div>

                </section>

              ) : (

                <section
                  className="faq-form-slide"
                  aria-label="اطلاعات کسب‌وکار و مارکتینگ"
                >

                  <div className="faq-form-title">

                    <span className="faq-form-title-icon">
                      <BarChart3 />
                    </span>

                    <span>
                      اطلاعات کسب‌وکار
                    </span>

                  </div>


                  <div className="faq-form-grid">

                    {businessFields.map((field) => (

                      <Field
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={handleChange}
                        isActive
                      />

                    ))}

                  </div>


                  <div className="faq-form-title faq-form-title-spaced">

                    <span className="faq-form-title-icon">
                      <Megaphone />
                    </span>

                    <span>
                      اطلاعات مارکتینگ
                    </span>

                  </div>


                  <div className="faq-form-grid faq-marketing-grid">

                    {marketingFields.map((field) => (

                      <ToggleField
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={handleChange}
                      />

                    ))}

                  </div>

                </section>

              )}

            </div>


            {status.message && (

              <p
                className={
                  'faq-status faq-status-' +
                  status.type
                }
              >
                {status.message}
              </p>

            )}


            <div className="faq-form-actions">

              <button
                className="faq-secondary-btn"
                type="button"
                onClick={goBack}
                disabled={
                  activeStep === 0 ||
                  isSubmitting
                }
              >

                <ArrowRight />

                <span>
                  مرحله قبل
                </span>

              </button>


              <button
                className="faq-submit-btn"
                type="submit"
                disabled={isSubmitting}
              >

                <span>
                  {activeStep === 0
                    ? 'مرحله بعد'
                    : isSubmitting
                    ? 'در حال ارسال...'
                    : 'ارسال اطلاعات'}
                </span>

                {activeStep === 0 ? (
                  <ArrowLeft />
                ) : (
                  <Send />
                )}

              </button>

            </div>

          </form>

        </section>

      </section>


      <MobileBottomNav
        currentPage="faq"
        isLoggedIn={isLoggedIn}
        onNavigate={handleMobileNav}
      />

    </main>
  );
}

export default FaqMembershipPage;
