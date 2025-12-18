import DeviceInfo from 'react-native-device-info';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface FraudCheck {
  userId: string;
  deviceId: string;
  ipAddress: string;
  amount: number;
  paymentMethod: string;
  timestamp: number;
}

export const performFraudCheck = async (transactionData: FraudCheck): Promise<{ isValid: boolean; riskScore: number; reasons: string[] }> => {
  const reasons: string[] = [];
  let riskScore = 0;

  // Device fingerprinting
  const deviceId = await DeviceInfo.getUniqueId();
  const isEmulator = await DeviceInfo.isEmulator();
  
  if (isEmulator) {
    riskScore += 30;
    reasons.push('Emulator detected');
  }

  // Velocity checks
  const recentTransactions = await getRecentTransactions(transactionData.userId, 3600000); // 1 hour
  if (recentTransactions.length > 5) {
    riskScore += 25;
    reasons.push('High transaction velocity');
  }

  // Amount analysis
  const avgAmount = await getAverageTransactionAmount(transactionData.userId);
  if (transactionData.amount > avgAmount * 3) {
    riskScore += 20;
    reasons.push('Unusually high amount');
  }

  // Geographic analysis
  const locationRisk = await checkLocationRisk(transactionData.ipAddress);
  riskScore += locationRisk;
  if (locationRisk > 15) reasons.push('High-risk location');

  // Device consistency
  const deviceHistory = await getDeviceHistory(transactionData.userId);
  if (!deviceHistory.includes(deviceId)) {
    riskScore += 15;
    reasons.push('New device');
  }

  // Log transaction for ML training
  await logTransaction({
    ...transactionData,
    deviceId,
    riskScore,
    timestamp: Date.now()
  });

  return {
    isValid: riskScore < 50,
    riskScore,
    reasons
  };
};

const getRecentTransactions = async (userId: string, timeWindow: number) => {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('timestamp', '>', Date.now() - timeWindow)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

const getAverageTransactionAmount = async (userId: string) => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const amounts = snapshot.docs.map(doc => doc.data().amount);
  return amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
};

const checkLocationRisk = async (ipAddress: string) => {
  try {
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const data = await response.json();
    const highRiskCountries = ['CN', 'RU', 'IR', 'KP'];
    return highRiskCountries.includes(data.country_code) ? 25 : 0;
  } catch {
    return 10; // Unknown location risk
  }
};

const getDeviceHistory = async (userId: string) => {
  const q = query(collection(db, 'user_devices'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().deviceId);
};

const logTransaction = async (data: any) => {
  await addDoc(collection(db, 'fraud_logs'), data);
};