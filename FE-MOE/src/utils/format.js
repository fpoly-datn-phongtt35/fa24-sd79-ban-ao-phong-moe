// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
export const formatCurrencyVND = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDateWithoutTime = (dateTimeString) => {
  const [datePart] = dateTimeString.split(" | ");
  return datePart;
};

export const formatDateTypeSecond = (isoDate) => {
  // input 0000-00-01T00:00
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTimeWithPending = (dateTimeString, message) => {
  if (!dateTimeString) return message;

  const [datePart, timePart] = dateTimeString.split(" | ");

  const [day, month, year] = datePart.split("/");

  const [hour, minute, second] = timePart.split(":");

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
};

export function formatDateSignUp(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
}

export function convertToMMDDYYYY(dateTimeString) {
  const [datePart] = dateTimeString.split(" | ");
  const [day, month, year] = datePart.split("/");

  return `${year}-${month}-${day}`;
}
