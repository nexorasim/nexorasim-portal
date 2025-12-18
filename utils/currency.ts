

const CURRENCY_KEY = 'selected_currency';
const RATES_KEY = 'exchange_rates';

export const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  MMK: { symbol: 'K', name: 'Myanmar Kyat' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' }
};

export const getExchangeRates = async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    localStorage.setItem(RATES_KEY, JSON.stringify(data.rates));
    return data.rates;
  } catch {
    const cached = localStorage.getItem(RATES_KEY);
    return cached ? JSON.parse(cached) : { USD: 1 };
  }
};

export const convertPrice = (price: number, fromCurrency: string, toCurrency: string, rates: any) => {
  if (fromCurrency === toCurrency) return price;
  const usdPrice = fromCurrency === 'USD' ? price : price / rates[fromCurrency];
  return toCurrency === 'USD' ? usdPrice : usdPrice * rates[toCurrency];
};

export const formatPrice = (price: number, currency: string) => {
  const symbol = currencies[currency as keyof typeof currencies]?.symbol || '$';
  return `${symbol}${price.toFixed(2)}`;
};

export const setSelectedCurrency = async (currency: string) => {
  localStorage.setItem(CURRENCY_KEY, currency);
};

export const getSelectedCurrency = async () => {
  return localStorage.getItem(CURRENCY_KEY) || 'USD';
};