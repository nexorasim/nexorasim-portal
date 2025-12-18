import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { OtpInput } from 'react-native-otp-entry';
import { verifyOTP } from '../../store/slices/authSlice';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      showMessage({ message: 'Please enter valid OTP', type: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(verifyOTP({ phone: '+959123456789', otp }));
      router.replace('/(tabs)');
    } catch (error) {
      showMessage({ message: 'OTP verification failed', type: 'danger' });
    }
    setLoading(false);
  };

  const handleResendOTP = () => {
    setCountdown(60);
    showMessage({ message: 'OTP sent successfully', type: 'success' });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {t('enterOTP')}
          </Text>
          
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to your phone
          </Text>
          
          <OtpInput
            numberOfDigits={6}
            onTextChange={setOtp}
            focusColor="#6200ee"
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpInput,
            }}
          />
          
          <Button
            mode="contained"
            onPress={handleVerifyOTP}
            loading={loading}
            style={styles.button}
          >
            {t('verify')}
          </Button>
          
          <Button
            mode="text"
            onPress={handleResendOTP}
            disabled={countdown > 0}
            style={styles.button}
          >
            {countdown > 0 ? `${t('resendOTP')} (${countdown}s)` : t('resendOTP')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpInput: {
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
  },
});