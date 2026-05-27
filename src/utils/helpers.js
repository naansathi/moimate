/**
 * Formats a number into Indian Rupee format (e.g., ₹5,00,000)
 * @param {number} amount 
 * @returns {string}
 */
export const formatTamilCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats an ISO date string into a readable format
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

/**
 * Formats time from ISO string
 * @param {string} dateString 
 * @returns {string}
 */
export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

/**
 * Generates a mock transaction ID
 * @returns {string}
 */
export const generateTransactionId = () => {
  return "TXN" + Math.floor(1000000000 + Math.random() * 9000000000);
};

/**
 * Generates a mock offline receipt number
 * @returns {string}
 */
export const generateReceiptNumber = () => {
  return "REC-" + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000);
};

/**
 * Export array of objects to CSV in browser
 * @param {Array} data 
 * @param {string} filename 
 */
export const exportToCSV = (data, filename = "moi_collection.csv") => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Header row
  csvRows.push(headers.join(","));
  
  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ("" + (val !== null && val !== undefined ? val : "")).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
