import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { loginUser } from '../../store/slices/authSlice';
import { checkBiometricSupport, authenticateWithBiometric } from '../../utils/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  React.useEffect(() => {
    checkBiometricSupport().then(setBiometricAvailable);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage({ message: 'Please fill all fields', type: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password }));
      router.replace('/(tabs)');
    } catch (error) {
      showMessage({ message: 'Login failed', type: 'danger' });
    }
    setLoading(false);
  };

  const handleBiometricLogin = async () => {
    const success = await authenticateWithBiometric();
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {t('welcome')}
          </Text>
          
          <TextInput
            label={t('email')}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <TextInput
            label={t('password')}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            {t('login')}
          </Button>
          
          {biometricAvailable && (
            <Button
              mode="outlined"
              onPress={handleBiometricLogin}
              style={styles.button}
            >
              {t('useBiometric')}
            </Button>
          )}
          
          <Button
            mode="text"
            onPress={() => router.push('/(auth)/register')}
            style={styles.button}
          >
            {t('dontHaveAccount')}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});