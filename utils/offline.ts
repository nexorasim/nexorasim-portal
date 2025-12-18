import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const OFFLINE_ORDERS_KEY = 'offline_orders';
const QR_CACHE_DIR = `${FileSystem.documentDirectory}qr_codes/`;

export const cacheOrderQRCode = async (orderId: string, qrData: string) => {
  await FileSystem.makeDirectoryAsync(QR_CACHE_DIR, { intermediates: true });
  await FileSystem.writeAsStringAsync(`${QR_CACHE_DIR}${orderId}.txt`, qrData);
};

export const getOfflineQRCode = async (orderId: string) => {
  try {
    return await FileSystem.readAsStringAsync(`${QR_CACHE_DIR}${orderId}.txt`);
  } catch {
    return null;
  }
};

export const cacheOrders = async (orders: any[]) => {
  await AsyncStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(orders));
  orders.forEach(order => {
    if (order.qr_code) cacheOrderQRCode(order.id, order.qr_code);
  });
};

export const getOfflineOrders = async () => {
  const data = await AsyncStorage.getItem(OFFLINE_ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};