import Head from 'next/head';
import App from '../src/App';

export default function Restaurant() {
  return (
    <>
      <Head>
        <title>رستوران ملل | کی میای</title>
      </Head>
      <App initialPage="restaurant" />
    </>
  );
}
