export const normalizeMobileNumber = (mobile) => {
  let value = String(mobile || "").trim();

  value = Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code >= 0x06f0 && code <= 0x06f9) {
        return String(code - 0x06f0);
      }

      if (code >= 0x0660 && code <= 0x0669) {
        return String(code - 0x0660);
      }

      return char;
    })
    .filter((char) => char !== "-" && char.trim() !== "")
    .join("");

  if (value.startsWith("+98")) {
    value = "0" + value.slice(3);
  }

  if (value.startsWith("98") && value.length === 12) {
    value = "0" + value.slice(2);
  }

  return value;
};
