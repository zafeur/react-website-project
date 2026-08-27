import { useEffect, useState } from "react";
import { CalendarDays, Mail, UserRound, X } from "lucide-react";
import { defaultProfileAvatar, profileAvatarOptions } from "../data/brandAssets";

const labels = {
  title: "\u062a\u06a9\u0645\u06cc\u0644 \u0627\u0637\u0644\u0627\u0639\u0627\u062a \u06a9\u0627\u0631\u0628\u0631\u06cc",
  subtitle: "\u0627\u06cc\u0646 \u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0628\u0631\u0627\u06cc \u0646\u0645\u0627\u06cc\u0634 \u0648 \u062a\u06a9\u0645\u06cc\u0644 \u062f\u0627\u0634\u0628\u0648\u0631\u062f \u062d\u0633\u0627\u0628 \u0634\u0645\u0627 \u0627\u0633\u062a\u0641\u0627\u062f\u0647 \u0645\u06cc\u200c\u0634\u0648\u062f.",
  firstName: "\u0646\u0627\u0645",
  lastName: "\u0646\u0627\u0645 \u062e\u0627\u0646\u0648\u0627\u062f\u06af\u06cc",
  email: "\u0627\u06cc\u0645\u06cc\u0644",
  birthDate: "\u062a\u0627\u0631\u06cc\u062e \u062a\u0648\u0644\u062f",
  save: "\u0630\u062e\u06cc\u0631\u0647 \u0627\u0637\u0644\u0627\u0639\u0627\u062a",
  saving: "\u062f\u0631 \u062d\u0627\u0644 \u0630\u062e\u06cc\u0631\u0647...",
  close: "\u0628\u0633\u062a\u0646",
  chooseDate: "\u0627\u0646\u062a\u062e\u0627\u0628 \u062a\u0627\u0631\u06cc\u062e",
  year: "\u0633\u0627\u0644",
  month: "\u0645\u0627\u0647",
  day: "\u0631\u0648\u0632",
  confirmDate: "\u062a\u0627\u06cc\u06cc\u062f \u062a\u0627\u0631\u06cc\u062e",
  avatar: "\u067e\u0631\u0648\u0641\u0627\u06cc\u0644",
};

const toPersianDigits = (value) => String(value ?? "").replace(/[0-9]/g, (digit) => String.fromCharCode(0x06f0 + Number(digit)));
const toEnglishDigits = (value) => String(value ?? "").replace(/[\u06f0-\u06f9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
const pad2 = (value) => String(value).padStart(2, "0");
const CALENDAR_MODE = "jalali";
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const getCurrentJalaliYear = () => {
  try {
    return Number(toEnglishDigits(new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date())));
  } catch {
    return 1403;
  }
};

const jalaliYears = Array.from({ length: 91 }, (_, index) => getCurrentJalaliYear() - index);
const getDefaultDateParts = () => ({ year: 1380, month: 1, day: 1 });
const getJalaliMonthDays = (year, month) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;

  return ((year + 38) * 31) % 128 < 31 ? 30 : 29;
};

const normalizeDateParts = (parts) => {
  const fallback = getDefaultDateParts();
  const year = Number(parts.year) || fallback.year;
  const month = Math.min(Math.max(Number(parts.month) || fallback.month, 1), 12);
  const day = Math.min(Math.max(Number(parts.day) || fallback.day, 1), getJalaliMonthDays(year, month));

  return { year, month, day };
};

const gregorianToJalaliParts = ({ year, month, day }) => {
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(date.getTime())) {
    return getDefaultDateParts();
  }

  try {
    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);

    return normalizeDateParts({
      year: toEnglishDigits(parts.find((part) => part.type === "year")?.value || ""),
      month: toEnglishDigits(parts.find((part) => part.type === "month")?.value || ""),
      day: toEnglishDigits(parts.find((part) => part.type === "day")?.value || ""),
    });
  } catch {
    return getDefaultDateParts();
  }
};

const parseDateParts = (value = "", calendar = CALENDAR_MODE) => {
  const normalized = toEnglishDigits(value);
  const match = normalized.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  const parts = {
    year: Number(match?.[1]),
    month: Number(match?.[2]),
    day: Number(match?.[3]),
  };

  if (!match) {
    return getDefaultDateParts();
  }

  if (calendar !== CALENDAR_MODE || parts.year > getCurrentJalaliYear() + 1) {
    return gregorianToJalaliParts(parts);
  }

  return normalizeDateParts(parts);
};

const formatDate = ({ year, month, day }) => String(year) + "/" + pad2(month) + "/" + pad2(day);
const displayDate = (value) => toPersianDigits(value);

function ProfileCompletionModal({ initialMobile = "", initialProfile = {}, isLoading = false, error = "", onClose, onSubmit }) {
  const initialBirthDate = initialProfile.birthDate || initialProfile.birth_date || initialProfile.date || "";
  const initialBirthDateCalendar = initialProfile.birthDateCalendar || initialProfile.birth_date_calendar || initialProfile.calendar_type || CALENDAR_MODE;
  const initialBirthDateParts = parseDateParts(initialBirthDate, initialBirthDateCalendar);
  const [form, setForm] = useState({
    firstName: initialProfile.firstName || initialProfile.first_name || "",
    lastName: initialProfile.lastName || initialProfile.last_name || "",
    email: initialProfile.email || "",
    birthDate: initialBirthDate ? formatDate(initialBirthDateParts) : "",
    birthDateCalendar: CALENDAR_MODE,
    avatarPreview: initialProfile.avatarPreview || initialProfile.avatar_preview || initialProfile.avatar || initialProfile.profile_image || defaultProfileAvatar,
  });
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const [birthDateParts, setBirthDateParts] = useState(initialBirthDateParts);

  useEffect(() => {
    document.documentElement.classList.add("keymiyay-modal-open");
    document.body.classList.add("keymiyay-modal-open");

    return () => {
      document.documentElement.classList.remove("keymiyay-modal-open");
      document.body.classList.remove("keymiyay-modal-open");
    };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateBirthDatePart = (field, value) => {
    const nextParts = normalizeDateParts({ ...birthDateParts, [field]: Number(value) });
    setBirthDateParts(nextParts);
    updateField("birthDate", formatDate(nextParts));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, birthDateCalendar: CALENDAR_MODE, mobile: initialMobile });
  };

  const yearOptions = jalaliYears;
  const days = Array.from({ length: getJalaliMonthDays(birthDateParts.year, birthDateParts.month) }, (_, index) => index + 1);

  return (
    <div className="login-backdrop profile-completion-backdrop" onClick={onClose}>
      <section className="login-modal profile-completion-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <button className="modal-close" type="button" aria-label={labels.close} onClick={onClose}><X /></button>
          <div className="modal-mark"><UserRound /></div>
        </div>

        <div className="login-title-block"><h2>{labels.title}</h2><p>{labels.subtitle}</p></div>

        <form className="profile-completion-form" onSubmit={handleSubmit}>
          <div className="profile-avatar-options" role="radiogroup" aria-label={labels.avatar}>
            {profileAvatarOptions.map((option) => (
              <button
                className={form.avatarPreview === option.src ? "profile-avatar-option is-active" : "profile-avatar-option"}
                type="button"
                role="radio"
                aria-checked={form.avatarPreview === option.src}
                key={option.id}
                onClick={() => updateField("avatarPreview", option.src)}
              >
                <span className="profile-avatar-preview"><img src={option.src} alt={option.label} /></span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          <div className="profile-completion-row">
            <label className="login-field"><span>{labels.firstName}</span><div className="input-shell"><UserRound /><input type="text" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required /></div></label>
            <label className="login-field"><span>{labels.lastName}</span><div className="input-shell"><UserRound /><input type="text" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required /></div></label>
          </div>

          <label className="login-field"><span>{labels.email}</span><div className="input-shell"><Mail /><input type="email" placeholder="example@email.com" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></div></label>

          <div className="login-field profile-date-field">
            <span>{labels.birthDate}</span>
            <button className={"input-shell birth-date-trigger " + (form.birthDate ? "has-value" : "")} type="button" onClick={() => setIsBirthDatePickerOpen((current) => !current)} aria-expanded={isBirthDatePickerOpen}>
              <CalendarDays />
              <span>{form.birthDate ? displayDate(form.birthDate) : labels.chooseDate}</span>
            </button>

            {isBirthDatePickerOpen && (
              <div className="birth-date-picker" role="group" aria-label={labels.birthDate}>
                <label><span>{labels.year}</span><select value={birthDateParts.year} onChange={(event) => updateBirthDatePart("year", event.target.value)}>{yearOptions.map((year) => <option value={year} key={year}>{toPersianDigits(year)}</option>)}</select></label>
                <label><span>{labels.month}</span><select value={birthDateParts.month} onChange={(event) => updateBirthDatePart("month", event.target.value)}>{months.map((month) => <option value={month} key={month}>{toPersianDigits(pad2(month))}</option>)}</select></label>
                <label><span>{labels.day}</span><select value={birthDateParts.day} onChange={(event) => updateBirthDatePart("day", event.target.value)}>{days.map((day) => <option value={day} key={day}>{toPersianDigits(pad2(day))}</option>)}</select></label>
                <button className="birth-date-confirm" type="button" onClick={() => setIsBirthDatePickerOpen(false)}>{labels.confirmDate}</button>
              </div>
            )}
          </div>

          <div className="login-error">{error}</div>
          <button className="login-submit" type="submit" disabled={isLoading}>{isLoading ? labels.saving : labels.save}</button>
        </form>
      </section>
    </div>
  );
}

export default ProfileCompletionModal;
