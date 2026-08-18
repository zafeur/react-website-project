import { useEffect, useState } from 'react';
import styles from './InstallAppButton.module.css';

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent || '';

    const ios =
      /iphone|ipad|ipod/i.test(userAgent) ||
      (
        window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1
      );

    const android = /android/i.test(userAgent);

    setIsIOS(ios);
    setIsAndroid(android);

    const checkInstalled = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      setIsInstalled(standalone);
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setShowAndroidGuide(false);
      setShowIOSGuide(false);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      'appinstalled',
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    // ==========================================
    // 🍎 iPhone / iPad
    // ==========================================
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    // ==========================================
    // 🤖 Android
    // ==========================================
    if (isAndroid) {
      // اگر Chrome اجازه نصب مستقیم داده باشد
      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();

          const { outcome } =
            await deferredPrompt.userChoice;

          if (outcome === 'accepted') {
            setDeferredPrompt(null);
          }
        } catch (error) {
          console.error(
            'PWA installation failed:',
            error
          );
        }

        return;
      }

      // اگر prompt در دسترس نباشد
      // راهنمای نصب Chrome را نشان بده
      setShowAndroidGuide(true);

      return;
    }
  };

  // ==========================================
  // 🖥️ Desktop
  // ==========================================
  if (!isIOS && !isAndroid) {
    return null;
  }

  // ==========================================
  // 📱 Already Installed
  // ==========================================
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* ======================================
          Install Button
      ====================================== */}
      <button
        type="button"
        onClick={handleInstall}
        className={styles.installAppButton}
        aria-label="نصب اپ"
        title="نصب اپ"
      >
        <img
          src="/brand/install-app-icon.png"
          alt=""
          className={styles.installAppIcon}
          aria-hidden="true"
        />

        <span>نصب اپ</span>
      </button>

      {/* ======================================
          🍎 iOS Guide
      ====================================== */}
      {showIOSGuide && (
        <div
          className={styles.installGuideOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
        >
          <div className={styles.installGuideModal}>

            <button
              type="button"
              className={styles.installGuideClose}
              onClick={() => setShowIOSGuide(false)}
              aria-label="بستن"
            >
              ×
            </button>

            <img
              src="/brand/install-app-icon.png"
              alt=""
              className={styles.installGuideIcon}
              aria-hidden="true"
            />

            <h3 id="ios-install-title">
              نصب کی‌میای روی آیفون
            </h3>

            <p>
              برای اضافه کردن کی‌میای به صفحه اصلی آیفون:
            </p>

            <ol>
              <li>
                در <strong>Safari</strong> روی دکمه{' '}
                <strong>Share</strong> بزن.
              </li>

              <li>
                گزینه{' '}
                <strong>Add to Home Screen</strong>{' '}
                را انتخاب کن.
              </li>

              <li>
                در بالا روی <strong>Add</strong> بزن.
              </li>
            </ol>

            <button
              type="button"
              className={styles.installGuideDone}
              onClick={() => setShowIOSGuide(false)}
            >
              متوجه شدم
            </button>

          </div>
        </div>
      )}

      {/* ======================================
          🤖 Android Guide
      ====================================== */}
      {showAndroidGuide && (
        <div
          className={styles.installGuideOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="android-install-title"
        >
          <div className={styles.installGuideModal}>

            <button
              type="button"
              className={styles.installGuideClose}
              onClick={() => setShowAndroidGuide(false)}
              aria-label="بستن"
            >
              ×
            </button>

            <img
              src="/brand/install-app-icon.png"
              alt=""
              className={styles.installGuideIcon}
              aria-hidden="true"
            />

            <h3 id="android-install-title">
              نصب کی‌میای
            </h3>

            <p>
              برای نصب کی‌میای روی گوشی:
            </p>

            <ol>
              <li>
                در Chrome روی منوی{' '}
                <strong>⋮</strong> بزن.
              </li>

              <li>
                گزینه{' '}
                <strong>Install app</strong>{' '}
                یا{' '}
                <strong>Add to Home screen</strong>{' '}
                را انتخاب کن.
              </li>

              <li>
                نصب را تأیید کن.
              </li>
            </ol>

            <button
              type="button"
              className={styles.installGuideDone}
              onClick={() => setShowAndroidGuide(false)}
            >
              متوجه شدم
            </button>

          </div>
        </div>
      )}
    </>
  );
}