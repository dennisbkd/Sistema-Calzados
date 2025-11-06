export const formatCurrency = (amount) => {
  const value = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)}`;
  }
};

