export const formatCurrency = (value) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`;

export const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minutes}`;
};

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
