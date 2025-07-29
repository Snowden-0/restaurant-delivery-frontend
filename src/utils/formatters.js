
export const formatOrderId = (orderId) => {
  if (!orderId) return '';
  return `ORD-${orderId.substring(0, 8).toUpperCase()}`;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
        year: 'numeric', month: 'long', day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};