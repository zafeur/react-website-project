import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import '../src/components/Header.css';
import '../src/components/RestaurantPage.css';
import '../src/components/DashboardPage.css';
import '../src/components/LoginModal.css';
import '../src/components/MobileBottomNav.css';
import '../src/components/HomePage.css';
import '../src/components/FaqMembershipPage.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
