import Link from 'next/link';
import { ArrowLeft, PawPrint } from 'lucide-react';

function PetPage() {
  return (
    <div className="pet-page">
      <section className="pet-hero">
        <div className="pet-hero-copy">
          <span className="pet-eyebrow">پت</span>
          <h1>خدمات ویژه حیوانات خانگی</h1>
          <p>
            صفحه‌ای اختصاصی برای محصولات، خدمات و پیشنهادهای ویژه پت‌ها. از بن‌ها و تخفیف‌های اختصاصی نگهداری حیوانات خانگی دیدن کنید.
          </p>
          <Link href="/">
            <button className="pet-back-btn" type="button">
              <ArrowLeft /> بازگشت به صفحه اصلی
            </button>
          </Link>
        </div>

        <div className="pet-hero-graphic">
          <PawPrint />
        </div>
      </section>

      <section className="pet-intro-panel">
        <h2>چرا این بخش برای پت‌ها ایجاد شده است؟</h2>
        <p>
          در این بخش می‌توانید به پیشنهادهای ویژه محصولات نگهداری پت، خدمات آرایشگاهی و تخفیف‌های اختصاصی فروشگاهی دسترسی داشته باشید.
        </p>
      </section>

      <section className="pet-benefits-grid">
        {[
          {
            title: 'محصولات تخصصی پت',
            description: 'پیشنهادهایی ویژه برای سلامت و شادابی حیوان خانگی شما.',
          },
          {
            title: 'خدمات اختصاصی پت',
            description: 'کلینیک، هتلینگ و آرایشگاه‌های منتخب پت در دسترس شما.',
          },
          {
            title: 'کدهای تخفیف فروشگاهی',
            description: 'دریافت آسان کدهای تخفیف برای خرید لوازم حیوان خانگی.',
          },
        ].map((item) => (
          <article className="pet-benefit-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default PetPage;
