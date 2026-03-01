/**
 * Format số tiền kiểu Việt Nam: dấu chấm nghìn, dấu phẩy thập phân.
 * @param {number} value - Số tiền
 * @param {string} [currency] - Mã tiền (VND, USD, INR...) để hiển thị ký hiệu
 * @returns {string}
 */
export function formatCurrencyVN(value, currency) {
  if (value == null || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  const formatted = num.toLocaleString("vi-VN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
  if (!currency) return formatted;
  const code = (currency || "").toUpperCase();
  if (code === "VND") return `${formatted} VNĐ`;
  const symbols = { INR: "₹", USD: "$" };
  const symbol = symbols[code] || code;
  return `${symbol} ${formatted}`;
}

/**
 * Format ngày tháng kiểu Việt Nam: dd/MM/yyyy.
 * @param {string|Date|number} value - Ngày (ISO string, Date, hoặc dd/MM/yyyy)
 * @returns {string}
 */
export function formatDateVN(value) {
  if (value == null || value === "") return "-";
  const date =
    typeof value === "string" && value.includes("/")
      ? parseDDMMYYYY(value)
      : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Parse chuỗi dd/MM/yyyy sang Date */
function parseDDMMYYYY(str) {
  const [d, m, y] = str.split("/").map(Number);
  if (!d || !m || !y) return new Date(Number.NaN);
  return new Date(y, m - 1, d);
}
