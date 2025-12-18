import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    todayRevenue: 0,
    ordersToday: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'analytics'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      updateMetrics(data);
    });
    return unsubscribe;
  }, []);

  const updateMetrics = (data: any[]) => {
    const today = new Date().toDateString();
    const todayData = data.filter(d => new Date(d.timestamp).toDateString() === today);
    
    setMetrics({
      activeUsers: data.filter(d => d.type === 'user_active').length,
      todayRevenue: todayData.reduce((sum, d) => sum + (d.revenue || 0), 0),
      ordersToday: todayData.filter(d => d.type === 'order_completed').length,
      conversionRate: (todayData.filter(d => d.type === 'purchase').length / 
                      todayData.filter(d => d.type === 'view_plan').length * 100) || 0
    });

    setChartData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [65, 59, 80, 81, 56, 55, 40] }]
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text variant="headlineMedium">{metrics.activeUsers}</Text>
            <Text>Active Users</Text>
          </Card.Content>
        </Card>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text variant="headlineMedium">${metrics.todayRevenue}</Text>
            <Text>Today Revenue</Text>
          </Card.Content>
        </Card>
      </View>
      
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium">Revenue Trend</Text>
          <LineChart
            data={chartData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
            }}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metricCard: { flex: 0.48 },
  chartCard: { marginBottom: 16 }
});