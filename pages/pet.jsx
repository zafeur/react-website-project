import Head from 'next/head';
import PetPage from '../src/components/PetPage';

export default function Pet() {
  return (
    <>
      <Head>
        <title>{'پت | کی میای'}</title>
        <meta
          name="description"
          content="صفحه پت کی میای برای خدمات و پیشنهادهای ویژه حیوانات خانگی"
        />
      </Head>
      <PetPage />
    </>
  );
}
