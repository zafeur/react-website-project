import { useEffect, useRef, useState } from "react";
import { LogIn, ShieldCheck, Smartphone, X } from "lucide-react";

const t = {
  title: "\u0648\u0631\u0648\u062f / \u062b\u0628\u062a \u0646\u0627\u0645",
  subtitle:
    "\u0628\u0631\u0627\u06cc \u062f\u0631\u06cc\u0627\u0641\u062a \u0647\u062f\u06cc\u0647\u200c\u0647\u0627 \u0648 \u062a\u062e\u0641\u06cc\u0641\u200c\u0647\u0627 \u0648\u0627\u0631\u062f \u062d\u0633\u0627\u0628 \u062e\u0648\u062f \u0634\u0648\u06cc\u062f",
  mobile: "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06cc\u0644",
  otp: "\u06a9\u062f \u062a\u0627\u06cc\u06cc\u062f",
  wait: "\u0644\u0637\u0641\u0627 \u0635\u0628\u0631 \u06a9\u0646\u06cc\u062f...",
  send: "\u0627\u0631\u0633\u0627\u0644 \u06a9\u062f",
  login: "\u0648\u0631\u0648\u062f",
  close: "\u0628\u0633\u062a\u0646",
  secure:
    "\u0648\u0631\u0648\u062f \u0634\u0645\u0627 \u0628\u0627 \u06a9\u062f \u06cc\u06a9\u0628\u0627\u0631\u0645\u0635\u0631\u0641 \u0627\u0645\u0646 \u0627\u0646\u062c\u0627\u0645 \u0645\u06cc\u200c\u0634\u0648\u062f",
};
const normalizeDigits = (value = "") =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/\D/g, "");
    
function LoginModal({
  loginError,
  isLoading,
  onClose,
  onSendOtp,
  onVerifyOtp,
}) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const otpInputRef = useRef(null);

  useEffect(() => {
  const previousBodyOverflow = document.body.style.overflow;
  const previousHtmlOverflow = document.documentElement.style.overflow;

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
  };
}, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const success = await onSendOtp(mobile);

    if (success) {
      setStep(2);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    await onVerifyOtp(mobile, otp);
  };

  return (
    <div
      className="login-backdrop"
  
    >
      <section
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <button
            className="modal-close"
            type="button"
            aria-label={t.close}
            onClick={onClose}
          >
            <X />
          </button>

          <div className="modal-mark">
            <LogIn />
          </div>
        </div>

        <div className="login-title-block">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <form
          onSubmit={
            step === 1
              ? handleSendOtp
              : handleVerifyOtp
          }
        >
          <div className="login-field">
            <label>{t.mobile}</label>

            <div className="input-shell">
              <Smartphone />

              <input
                type="tel"
                placeholder="09123456789"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value)
                }
                disabled={step === 2}
              />
            </div>
          </div>

          {step === 2 && (
            <div className="login-field">
              <label>{t.otp}</label>

              <div className="input-shell">
                <ShieldCheck />
                <input
   ref={otpInputRef}
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  autoComplete="one-time-code"
  maxLength={6}
  placeholder="123456"
  value={otp}
  onChange={(e) =>
    setOtp(normalizeDigits(e.target.value).slice(0, 6))
  }
/>
              </div>
            </div>
          )}

          <div className="login-secure-note">
            <ShieldCheck />
            <span>{t.secure}</span>
          </div>

          <div className="login-error">
            {loginError}
          </div>

          <button
            className="login-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? t.wait
              : step === 1
              ? t.send
              : t.login}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginModal;
