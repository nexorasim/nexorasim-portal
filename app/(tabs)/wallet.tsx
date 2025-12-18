import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, TextInput, List, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { fetchPaymentMethods, processPayment } from '../../store/slices/paymentSlice';
import { PaymentMethod } from '../../types';
import { performFraudCheck } from '../../utils/fraudDetection';

export default function WalletScreen() {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.auth);
  const { methods, isProcessing } = useSelector((state: any) => state.payment);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, []);

  const handleAddFunds = async () => {
    if (!amount || !selectedMethod) {
      alert('Please select amount and payment method');
      return;
    }
    
    // Fraud detection
    const fraudCheck = await performFraudCheck({
      userId: user?.id || '',
      deviceId: 'device_123',
      ipAddress: '127.0.0.1',
      amount: parseFloat(amount),
      paymentMethod: selectedMethod,
      timestamp: Date.now()
    });
    
    if (!fraudCheck.isValid) {
      alert(`Transaction blocked: ${fraudCheck.reasons.join(', ')}`);
      return;
    }
    
    try {
      await dispatch(processPayment({
        amount: parseFloat(amount),
        method: selectedMethod,
        type: 'wallet_topup'
      }));
      alert('Funds added successfully');
      setAmount('');
      setSelectedMethod(null);
      setShowAddFunds(false);
    } catch (error) {
      alert('Payment failed');
    }
  };

  const myanmarMethods = methods.filter((m: PaymentMethod) => m.type === 'myanmar');
  const internationalMethods = methods.filter((m: PaymentMethod) => m.type === 'international');

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.balanceTitle}>
            {t('wallet')}
          </Text>
          <Text variant="displaySmall" style={styles.balance}>
            ${user?.wallet_balance || '0.00'}
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowAddFunds(!showAddFunds)}
            style={styles.addFundsButton}
          >
            {t('addFunds')}
          </Button>
        </Card.Content>
      </Card>

      {showAddFunds && (
        <Card style={styles.addFundsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('addFunds')}
            </Text>
            
            <TextInput
              label="Amount (USD)"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              keyboardType="numeric"
              style={styles.amountInput}
            />
            
            <Text variant="titleSmall" style={styles.methodTitle}>
              Myanmar Payment Methods
            </Text>
            {myanmarMethods.map((method: PaymentMethod) => (
              <List.Item
                key={method.id}
                title={method.name}
                left={(props) => <List.Icon {...props} icon={method.icon} />}
                right={(props) => 
                  selectedMethod === method.id ? 
                  <List.Icon {...props} icon="check" /> : null
                }
                onPress={() => setSelectedMethod(method.id)}
                style={[
                  styles.methodItem,
                  selectedMethod === method.id && styles.selectedMethod
                ]}
              />
            ))}
            
            <Divider style={styles.divider} />
            
            <Text variant="titleSmall" style={styles.methodTitle}>
              International Payment Methods
            </Text>
            {internationalMethods.map((method: PaymentMethod) => (
              <List.Item
                key={method.id}
                title={method.name}
                left={(props) => <List.Icon {...props} icon={method.icon} />}
                right={(props) => 
                  selectedMethod === method.id ? 
                  <List.Icon {...props} icon="check" /> : null
                }
                onPress={() => setSelectedMethod(method.id)}
                style={[
                  styles.methodItem,
                  selectedMethod === method.id && styles.selectedMethod
                ]}
              />
            ))}
            
            <Button
              mode="contained"
              onPress={handleAddFunds}
              loading={isProcessing}
              disabled={!amount || !selectedMethod}
              style={styles.payButton}
            >
              {t('payNow')}
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.transactionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Transactions
          </Text>
          <List.Item
            title="eSIM Purchase - Thailand"
            description="Dec 15, 2024"
            left={(props) => <List.Icon {...props} icon="minus" />}
            right={() => <Text style={styles.negativeAmount}>-$15.00</Text>}
          />
          <List.Item
            title="Wallet Top-up"
            description="Dec 14, 2024"
            left={(props) => <List.Icon {...props} icon="plus" />}
            right={() => <Text style={styles.positiveAmount}>+$50.00</Text>}
          />
          <List.Item
            title="eSIM Purchase - Singapore"
            description="Dec 12, 2024"
            left={(props) => <List.Icon {...props} icon="minus" />}
            right={() => <Text style={styles.negativeAmount}>-$20.00</Text>}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    marginBottom: 16,
  },
  balanceTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  balance: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  addFundsButton: {
    marginTop: 8,
  },
  addFundsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  amountInput: {
    marginBottom: 16,
  },
  methodTitle: {
    marginBottom: 8,
    marginTop: 8,
  },
  methodItem: {
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedMethod: {
    backgroundColor: '#e3f2fd',
  },
  divider: {
    marginVertical: 16,
  },
  payButton: {
    marginTop: 16,
  },
  transactionCard: {
    marginBottom: 16,
  },
  negativeAmount: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});