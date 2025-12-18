import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RealTimeDashboard from '../components/analytics/RealTimeDashboard';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <RealTimeDashboard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});