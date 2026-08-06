import { useState } from "react";
import { CalendarDays, Mail, UserRound, X } from "lucide-react";

const labels = {
  title: "تکمیل اطلاعات کاربری",
  subtitle: "این اطلاعات برای نمایش و تکمیل داشبورد حساب شما استفاده می‌شود.",
  firstName: "نام",
  lastName: "نام خانوادگی",
  email: "ایمیل",
  birthDate: "تاریخ تولد",
  save: "ذخیره اطلاعات",
  saving: "در حال ذخیره...",
  close: "بستن",
};

function ProfileCompletionModal({
  initialMobile = "",
  initialProfile = {},
  isLoading = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    firstName: initialProfile.firstName || initialProfile.first_name || "",
    lastName: initialProfile.lastName || initialProfile.last_name || "",
    email: initialProfile.email || "",
    birthDate: initialProfile.birthDate || initialProfile.birth_date || "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, mobile: initialMobile });
  };

  return (
    <div className="login-backdrop" onClick={onClose}>
      <section
        className="login-modal profile-completion-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <button className="modal-close" type="button" aria-label={labels.close} onClick={onClose}>
            <X />
          </button>
          <div className="modal-mark">
            <UserRound />
          </div>
        </div>

        <div className="login-title-block">
          <h2>{labels.title}</h2>
          <p>{labels.subtitle}</p>
        </div>

        <form className="profile-completion-form" onSubmit={handleSubmit}>
          <div className="profile-completion-row">
            <label className="login-field">
              <span>{labels.firstName}</span>
              <div className="input-shell">
                <UserRound />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>{labels.lastName}</span>
              <div className="input-shell">
                <UserRound />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  required
                />
              </div>
            </label>
          </div>

          <label className="login-field">
            <span>{labels.email}</span>
            <div className="input-shell">
              <Mail />
              <input
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
          </label>

          <label className="login-field">
            <span>{labels.birthDate}</span>
            <div className="input-shell">
              <CalendarDays />
              <input
                type="text"
                placeholder="۱۴۰۵/۰۵/۱۳"
                value={form.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
              />
            </div>
          </label>

          <div className="login-error">{error}</div>

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? labels.saving : labels.save}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProfileCompletionModal;
