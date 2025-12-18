import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { fetchOrders } from '../store/slices/esimSlice';
import { ESIMOrder } from '../types';
import { getOfflineOrders, getOfflineQRCode } from '../utils/offline';
import NetInfo from '@react-native-community/netinfo';

export default function OrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { orders } = useSelector((state: any) => state.esim);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        dispatch(fetchOrders());
      } else {
        loadOfflineOrders();
      }
    });
  }, []);

  const loadOfflineOrders = async () => {
    const offlineOrders = await getOfflineOrders();
    setMessages(offlineOrders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchOrders());
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'failed': return '#F44336';
      case 'refunded': return '#9C27B0';
      default: return '#757575';
    }
  };

  const renderOrder = ({ item }: { item: ESIMOrder }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text variant="titleMedium">Order #{item.id.slice(-8)}</Text>
          <Chip 
            style={{ backgroundColor: getStatusColor(item.status) }}
            textStyle={{ color: 'white' }}
          >
            {t(item.status)}
          </Chip>
        </View>
        
        <Text variant="bodyMedium" style={styles.orderDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        
        <View style={styles.orderDetails}>
          <Text variant="bodyLarge">${item.amount}</Text>
          <Text variant="bodySmall">{item.payment_method}</Text>
        </View>
        
        {item.status === 'completed' && (
          <View style={styles.orderActions}>
            <Button
              mode="outlined"
              onPress={() => setShowQR(showQR === item.id ? null : item.id)}
              compact
            >
              {showQR === item.id ? 'Hide QR' : t('qrCode')}
            </Button>
            <Button
              mode="contained"
              onPress={() => router.push(`/order/${item.id}`)}
              compact
            >
              View Details
            </Button>
          </View>
        )}
        
        {showQR === item.id && (
          <View style={styles.qrContainer}>
            <QRCode
              value={item.qr_code}
              size={200}
              backgroundColor="white"
              color="black"
            />
            <Text variant="bodySmall" style={styles.qrText}>
              {t('scanToActivate')}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No orders yet</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/(tabs)')}
              style={styles.emptyButton}
            >
              Browse Plans
            </Button>
          </View>
        }
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  ordersList: {
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDate: {
    opacity: 0.7,
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  qrText: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});