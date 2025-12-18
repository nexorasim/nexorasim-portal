import React from 'react';
import { View, StyleSheet } from 'react-native';
import AIChat from '../components/support/AIChat';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <AIChat />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});