import Head from 'next/head';
import FaqMembershipPage from '../src/components/FaqMembershipPage';

export default function Faq() {
  return (
    <>
      <Head>
        <title>سوالات متداول و درخواست عضویت | کی میای</title>
        <meta
          name="description"
          content="سوالات متداول کی میای و فرم بررسی رایگان شرایط عضویت کسب و کارها"
        />
      </Head>
      <FaqMembershipPage />
    </>
  );
}
