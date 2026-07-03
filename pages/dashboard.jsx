import Head from 'next/head';
import App from '../src/App';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>داشبورد | کی میای</title>
      </Head>
      <App initialPage="dashboard" />
    </>
  );
}
