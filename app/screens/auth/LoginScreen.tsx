
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// It is recommended to use a library like i18n-js for internationalization.
// For simplicity, we are using hardcoded strings here.

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    // Handle email/password login
    console.log('Login attempt with:', { email, password });
  };

  const handleGoogleSignIn = () => {
    // Handle Google Sign-In
    console.log('Google Sign-In');
  };

  const handleBiometricAuth = () => {
    // Handle Biometric authentication
    console.log('Biometric Auth');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to NexoraSIM</ThemedText>
      
      {/* Email and Password Inputs */}
      {/* It is recommended to create a reusable Input component */}
      <View style={styles.inputContainer}>
        <ThemedText>Email</ThemedText>
        {/* A real implementation would use a TextInput component */}
      </View>
      <View style={styles.inputContainer}>
        <ThemedText>Password</ThemedText>
        {/* A real implementation would use a TextInput component */}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.orText}>OR</ThemedText>

      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleSignIn}>
        <Ionicons name="logo-google" size={20} color="white" style={styles.icon} />
        <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
      </TouchableOpacity>

       <TouchableOpacity onPress={handleBiometricAuth}>
        <ThemedText style={styles.biometricText}>Use Biometric</ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  biometricText: {
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  }
});
