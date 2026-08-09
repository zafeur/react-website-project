export const toFormData = (payload = {}) => {
  const body = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      body.append(key, value);
    }
  });

  return body;
};
