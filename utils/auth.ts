const TOKEN_KEY = 'auth_token';

export const storeAuthToken = async (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = async () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const checkBiometricSupport = async () => {
  return false;
};

export const authenticateWithBiometric = async () => {
  return false;
};