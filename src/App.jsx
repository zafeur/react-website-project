import { useEffect, useState } from "react";
import DashboardPage from "./components/DashboardPage";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import MobileBottomNav from "./components/MobileBottomNav";
import ProfileCompletionModal from "./components/ProfileCompletionModal";
import RestaurantPage from "./components/RestaurantPage";
import BusinessProfilePage from "./components/BusinessProfilePage";
import { sendOtp, verifyOtp } from "./api/auth";
import { normalizeUserProfile, updateUserProfile } from "./api/user";
import { clearAuthToken, getTokenFromAuthResponse, getUserTypeFromAuthResponse, hasAuthToken, setAuthToken } from "./helper/authCookie";

const PAGE_STORAGE_KEY = "keymiyay-current-page";
const PROFILE_STORAGE_KEY = "keymiyay-user-profile";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

function App({ initialPage = "restaurant", initialDashboardSection = null, isDarkMode = false, onToggleTheme }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialPage === "dashboard" ? "restaurant" : initialPage);
  const [dashboardSectionRequest, setDashboardSectionRequest] = useState(null);

  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileMobile, setProfileMobile] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileCompletionOpen, setIsProfileCompletionOpen] = useState(false);
  const [profileCompletionError, setProfileCompletionError] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  useEffect(() => {
    if (!canUseStorage()) {
      return;
    }

    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const loggedIn = hasAuthToken();
    setIsLoggedIn(loggedIn);
    setHasCheckedAuth(true);

    if (loggedIn && initialPage === "dashboard") {
      setDashboardSectionRequest(initialDashboardSection ? { section: initialDashboardSection, createdAt: Date.now() } : null);
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
  }, [initialPage, initialDashboardSection]);

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
      setProfileMobile(mobile);
      setIsProfileCompletionOpen(true);
      setDashboardSectionRequest(initialDashboardSection ? { section: initialDashboardSection, createdAt: Date.now() } : null);
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
    setIsLoginOpen(false);
    setIsProfileCompletionOpen(false);
    setLoginError("");
    setProfileCompletionError("");
    setUserProfile(null);
    setProfileMobile("");

    if (canUseStorage()) {
      localStorage.removeItem(PAGE_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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

  const persistUserProfile = (profile, options = {}) => {
    if (!profile) return;

    setUserProfile((current) => {
      const incomingProfile = normalizeUserProfile(profile);
      const shouldKeepRecentLocalEdit =
        options.source === "report" &&
        current?._profileUpdatedAt &&
        Date.now() - current._profileUpdatedAt < 60000;
      const nextProfile = normalizeUserProfile(
        shouldKeepRecentLocalEdit
          ? { ...incomingProfile, ...current }
          : { ...(current || {}), ...incomingProfile }
      );

      if (canUseStorage()) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      }

      return nextProfile;
    });
  };

  const handleSaveProfile = async (profile) => {
    try {
      setIsProfileSaving(true);
      setProfileCompletionError("");

      const data = await updateUserProfile(profile);
      const nextProfile = {
        ...(data?.data?.user || data?.data || data?.user || {}),
        ...profile,
      };

      persistUserProfile({ ...nextProfile, _profileUpdatedAt: Date.now() });

      setIsProfileCompletionOpen(false);
    } catch (error) {
      setProfileCompletionError(error.response?.data?.message || error.message || "ذخیره اطلاعات انجام نشد.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  return (
    <main className={`page-shell ${currentPage === "restaurant" ? "restaurant-shell" : ""} ${currentPage === "business" ? "business-shell" : ""} ${isDarkMode ? "theme-dark" : ""} ${isLoginOpen || isProfileCompletionOpen ? "is-login-open" : ""}`} dir="rtl">
      <section
        className={`frame ${currentPage === "dashboard" ? "dashboard-frame" : ""} ${
          currentPage === "restaurant" ? "restaurant-frame" : ""
        } ${currentPage === "business" ? "business-frame" : ""}`}
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
          userProfile={userProfile}
        />
        <RestaurantPage
          isVisible={currentPage === "restaurant"}
          isLoggedIn={isLoggedIn}
        />

        <BusinessProfilePage
          isVisible={currentPage === "business"}
          isLoggedIn={isLoggedIn}
          onRequireLogin={openLogin}
        />

        <DashboardPage
          isVisible={currentPage === "dashboard"}
          sectionRequest={dashboardSectionRequest}
          userProfile={userProfile}
          onEditProfile={() => setIsProfileCompletionOpen(true)}
          onLogout={handleLogout}
          onProfileFromReport={(profile) => persistUserProfile(profile, { source: "report" })}
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

      {isProfileCompletionOpen && (
        <ProfileCompletionModal
          initialMobile={profileMobile}
          initialProfile={userProfile || {}}
          isLoading={isProfileSaving}
          error={profileCompletionError}
          onClose={() => setIsProfileCompletionOpen(false)}
          onSubmit={handleSaveProfile}
        />
      )}
    </main>
  );
}

export default App;
















