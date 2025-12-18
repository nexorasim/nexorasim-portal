import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import PhoneInput from 'react-native-phone-number-input';
import { registerUser } from '../store/slices/authSlice';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      showMessage({ message: 'Please fill all fields', type: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(registerUser(formData));
      router.push('/(auth)/otp');
    } catch (error) {
      showMessage({ message: 'Registration failed', type: 'danger' });
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {t('register')}
          </Text>
          
          <TextInput
            label={t('name')}
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label={t('email')}
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <PhoneInput
            defaultCode="MM"
            layout="first"
            onChangeFormattedText={(text) => setFormData({...formData, phone: text})}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
          />
          
          <TextInput
            label={t('password')}
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            {t('register')}
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          >
            {t('alreadyHaveAccount')}
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
  phoneContainer: {
    width: '100%',
    marginBottom: 15,
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
  },
});