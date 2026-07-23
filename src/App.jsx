import { useEffect, useState } from "react";
import DashboardPage from "./components/DashboardPage";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import MobileBottomNav from "./components/MobileBottomNav";
import RestaurantPage from "./components/RestaurantPage";
import { sendOtp, verifyOtp } from "./api/auth";
import { clearAuthToken, getTokenFromAuthResponse, getUserTypeFromAuthResponse, hasAuthToken, setAuthToken } from "./helper/authCookie";

const PAGE_STORAGE_KEY = "keymiyay-current-page";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

function App({ initialPage = "restaurant", isDarkMode = false, onToggleTheme }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialPage === "dashboard" ? "restaurant" : initialPage);
  const [dashboardSectionRequest, setDashboardSectionRequest] = useState(null);

  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loggedIn = hasAuthToken();
    setIsLoggedIn(loggedIn);
    setHasCheckedAuth(true);

    if (loggedIn && initialPage === "dashboard") {
      setDashboardSectionRequest(null);
      setCurrentPage("dashboard");
      return;
    }

    if (loggedIn) {
      setDashboardSectionRequest(null);
      setCurrentPage(initialPage);
      return;
    }

    setDashboardSectionRequest(null);
    setCurrentPage(initialPage === "dashboard" ? "restaurant" : initialPage);

    if (initialPage === "dashboard") {
      setIsLoginOpen(true);
    }
  }, [initialPage]);

  useEffect(() => {
    if (!hasCheckedAuth || !canUseStorage()) {
      return;
    }

    localStorage.setItem(
      PAGE_STORAGE_KEY,
      isLoggedIn ? currentPage : "restaurant"
    );
  }, [hasCheckedAuth, isLoggedIn, currentPage]);

  useEffect(() => {
    if (!hasCheckedAuth || initialPage !== "dashboard" || isLoggedIn) {
      return;
    }

    setCurrentPage("restaurant");
    setIsLoginOpen(true);
  }, [hasCheckedAuth, initialPage, isLoggedIn]);

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

      if (data.status === "otp_sent") {
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

      const token = getTokenFromAuthResponse(data);
      const tokenSaved = setAuthToken(token, getUserTypeFromAuthResponse(data));

      if (!tokenSaved) {
        setLoginError("\u062a\u0648\u06a9\u0646 \u0648\u0631\u0648\u062f \u062f\u0631 \u06a9\u0648\u06a9\u06cc \u0630\u062e\u06cc\u0631\u0647 \u0646\u0634\u062f.");
        return;
      }

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsUserMenuOpen(false);
      setDashboardSectionRequest(null);
      setCurrentPage("dashboard");
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
    setDashboardSectionRequest(null);
    setCurrentPage("restaurant");
    setLoginError("");
  };

  const goDashboard = () => {
    setCurrentPage("dashboard");
    setIsUserMenuOpen(false);
  };

  const goHome = () => {
    setDashboardSectionRequest(null);
    setCurrentPage("restaurant");
    setIsUserMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleMobileNav = (id) => {
    setIsUserMenuOpen(false);

    if (id === "home") {
      window.location.href = "/";
      return;
    }

    if (id === "shop") {
      setDashboardSectionRequest(null);
      setCurrentPage("restaurant");
      scrollToSection("restaurant-top");
      return;
    }

    if (id === "gifts") {
      if (currentPage === "dashboard") {
        setDashboardSectionRequest({ section: "gifts", createdAt: Date.now() });
        return;
      }

      setDashboardSectionRequest(null);
      setCurrentPage("restaurant");
      scrollToSection("restaurant-gifts");
      return;
    }

    if (id === "faq") {
      window.location.href = "/faq";
      return;
    }

    if (!isLoggedIn && id === "account") {
      openLogin();
      return;
    }

    if (id === "account") {
      setDashboardSectionRequest(null);
      setCurrentPage("dashboard");
    }
  };

  const mobileBottomCurrentPage = currentPage === "dashboard" && dashboardSectionRequest?.section === "gifts" ? "gifts" : currentPage;

  return (
    <main className={`page-shell ${currentPage === "restaurant" ? "restaurant-shell" : ""} ${isDarkMode ? "theme-dark" : ""} ${isLoginOpen ? "is-login-open" : ""}`} dir="rtl">
      <section
        className={`frame ${currentPage === "dashboard" ? "dashboard-frame" : ""} ${
          currentPage === "restaurant" ? "restaurant-frame" : ""
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
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
        />

        <RestaurantPage
          isVisible={currentPage === "restaurant"}
          isLoggedIn={isLoggedIn}
        />

        <DashboardPage
          isVisible={currentPage === "dashboard"}
          sectionRequest={dashboardSectionRequest}
          onLogout={handleLogout}
        />
      </section>

      <MobileBottomNav
        currentPage={mobileBottomCurrentPage}
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













