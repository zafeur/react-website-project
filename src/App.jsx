import { useEffect, useState } from "react";
import DashboardPage from "./components/DashboardPage";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import MobileBottomNav from "./components/MobileBottomNav";
import RestaurantPage from "./components/RestaurantPage";
import { sendOtp, verifyOtp } from "./api/auth";
import { clearAuthToken, hasAuthToken, setAuthToken } from "./helper/authCookie";

const PAGE_STORAGE_KEY = "keymiyay-current-page";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

function App({ initialPage = "restaurant" }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => hasAuthToken());

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => {
    if (!canUseStorage()) {
      return initialPage === "dashboard" ? "restaurant" : initialPage;
    }

    if (!hasAuthToken()) {
      return "restaurant";
    }

    return localStorage.getItem(PAGE_STORAGE_KEY) || initialPage;
  });

  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!canUseStorage()) {
      return;
    }

    localStorage.setItem(
      PAGE_STORAGE_KEY,
      isLoggedIn ? currentPage : "restaurant"
    );
  }, [isLoggedIn, currentPage]);

  useEffect(() => {
    if (initialPage === "dashboard" && !isLoggedIn) {
      setCurrentPage("restaurant");
      setIsLoginOpen(true);
    }
  }, [initialPage, isLoggedIn]);

  const openLogin = () => {
    setLoginError("");
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginError("");
    setIsLoginOpen(false);
  };

  const handleSendOtp = async (mobile) => {
    try {
      setIsLoading(true);
      setLoginError("");

      const data = await sendOtp(mobile);

      if (data.otpSent) {
        return true;
      }

      setLoginError("ارسال کد انجام نشد.");
      return false;
    } catch (error) {
      console.log(error);

      setLoginError(
        error.response?.data?.message ||
          "خطا در ارتباط با سرور"
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (mobile, otp) => {
    try {
      setIsLoading(true);
      setLoginError("");

      const data = await verifyOtp({ mobile, otp });

      console.log(data);

      if (data.token) {
        setAuthToken(data.token, data.user?.type || data.userType || data.role);
      }

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsUserMenuOpen(false);
      setCurrentPage("restaurant");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();

    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setCurrentPage("restaurant");
    setLoginError("");
  };

  const goDashboard = () => {
    setCurrentPage("dashboard");
    setIsUserMenuOpen(false);
  };

  const goHome = () => {
    setCurrentPage("restaurant");
    setIsUserMenuOpen(false);
  };

  const handleMobileNav = (id) => {
    setIsUserMenuOpen(false);

    if (id === "home") {
      window.location.href = "/";
      return;
    }

    if (id === "shop") {
      setCurrentPage("restaurant");
      return;
    }

    if (!isLoggedIn && ["account", "gifts", "club"].includes(id)) {
      openLogin();
      return;
    }

    if (id === "account") {
      setCurrentPage("dashboard");
    }
  };

  return (
    <main className="page-shell" dir="rtl">
      <section
        className={`frame ${
          currentPage === "dashboard" ? "dashboard-frame" : ""
        }`}
      >
        <Header
          currentPage={currentPage}
          isLoggedIn={isLoggedIn}
          isUserMenuOpen={isUserMenuOpen}
          onToggleUserMenu={() => setIsUserMenuOpen((prev) => !prev)}
          onDashboard={goDashboard}
          onLogout={handleLogout}
          onLogin={openLogin}
        />

        <RestaurantPage
          isVisible={currentPage === "restaurant"}
        />

        <DashboardPage
          isVisible={currentPage === "dashboard"}
          onLogout={handleLogout}
        />
      </section>

      <MobileBottomNav
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        onNavigate={handleMobileNav}
      />

      {isLoginOpen && (
        <LoginModal
          loginError={loginError}
          isLoading={isLoading}
          onClose={closeLogin}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
      )}
    </main>
  );
}

export default App;
