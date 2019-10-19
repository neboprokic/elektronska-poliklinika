export const addDays = (days, dateString) => {
  const timestamp = dateString ? new Date(dateString).getTime() : Date.now();
  const date = new Date(timestamp + days * 24 * 60 * 60 * 1000);

  return date.toISOString().split('T')[0];
};

export const priceFormatter = new Intl.NumberFormat('sr-SR', {
  style: 'currency',
  currency: 'RSD',
});

export const stripEmptyValues = payload => {
  const shallowCopy = { ...payload };
  Object.keys(shallowCopy).forEach(key => {
    if (shallowCopy[key] === undefined) delete shallowCopy[key];
  });

  return shallowCopy;
};
