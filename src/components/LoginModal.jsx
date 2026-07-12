import { useEffect, useRef, useState } from "react";
import { LogIn, Smartphone, X } from "lucide-react";

const t = {
  title: "\u0648\u0631\u0648\u062f / \u062b\u0628\u062a \u0646\u0627\u0645",
  mobile: "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06cc\u0644",
  otp: "\u06a9\u062f \u062a\u0627\u06cc\u06cc\u062f",
  wait: "\u0644\u0637\u0641\u0627 \u0635\u0628\u0631 \u06a9\u0646\u06cc\u062f...",
  send: "\u0627\u0631\u0633\u0627\u0644 \u06a9\u062f",
  login: "\u0648\u0631\u0648\u062f",
  close: "\u0628\u0633\u062a\u0646",
};

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
    if (step === 2) {
      otpInputRef.current?.focus();
    }
  }, [step]);

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
      onClick={onClose}
    >
      <section
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div className="modal-mark">
            <LogIn />
          </div>

          <button
            className="modal-close"
            type="button"
            aria-label={t.close}
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <h2>{t.title}</h2>

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
                <input
                  ref={otpInputRef}
                  type="text"
                  placeholder="12345"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />
              </div>
            </div>
          )}

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