

interface FraudCheck {
  userId: string;
  deviceId: string;
  ipAddress: string;
  amount: number;
  paymentMethod: string;
  timestamp: number;
}

export const performFraudCheck = async (transactionData: FraudCheck): Promise<{ isValid: boolean; riskScore: number; reasons: string[] }> => {
  // Simplified fraud check for web
  const riskScore = transactionData.amount > 1000 ? 30 : 10;
  const reasons = riskScore > 25 ? ['High amount transaction'] : [];
  
  return {
    isValid: riskScore < 50,
    riskScore,
    reasons
  };
};

