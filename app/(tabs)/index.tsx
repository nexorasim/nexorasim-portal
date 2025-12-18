import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { fetchPlans, setSelectedPlan } from '../../store/slices/esimSlice';
import { ESIMPlan } from '../../types';
import PlanSelector3D from '../../components/esim/PlanSelector3D';
import { getExchangeRates, convertPrice, formatPrice, getSelectedCurrency } from '../../utils/currency';

export default function ESIMPlansScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { plans, isLoading } = useSelector((state: any) => state.esim);

  useEffect(() => {
    dispatch(fetchPlans());
    loadCurrency();
    loadExchangeRates();
  }, []);

  const loadCurrency = async () => {
    const selectedCurrency = await getSelectedCurrency();
    setCurrency(selectedCurrency);
  };

  const loadExchangeRates = async () => {
    const rates = await getExchangeRates();
    setExchangeRates(rates);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchPlans());
    setRefreshing(false);
  };

  const filteredPlans = plans.filter((plan: ESIMPlan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || plan.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const countries = [...new Set(plans.map((plan: ESIMPlan) => plan.country))];

  const handleSelectPlan = (plan: ESIMPlan) => {
    dispatch(setSelectedPlan(plan));
    router.push('/purchase');
  };

  const renderPlan = ({ item }: { item: ESIMPlan }) => (
    <Card style={styles.planCard}>
      <Card.Content>
        <View style={styles.planHeader}>
          <Text variant="titleMedium">{item.name}</Text>
          <Chip icon="flag">{item.country}</Chip>
        </View>
        
        <View style={styles.planDetails}>
          <Text variant="bodyMedium">{item.data_amount}</Text>
          <Text variant="bodySmall">{item.validity_days} days</Text>
        </View>
        
        <View style={styles.planFooter}>
          <Text variant="headlineSmall">
            {formatPrice(convertPrice(item.price, 'USD', currency, exchangeRates), currency)}
          </Text>
          <Button
            mode="contained"
            onPress={() => handleSelectPlan(item)}
            compact
          >
            {t('buyNow')}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('selectCountry')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        horizontal
        data={countries}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCountry === item}
            onPress={() => setSelectedCountry(selectedCountry === item ? '' : item)}
            style={styles.countryChip}
          >
            {item}
          </Chip>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.countryList}
      />
      
      <Button
        mode={view3D ? 'contained' : 'outlined'}
        onPress={() => setView3D(!view3D)}
        style={styles.viewToggle}
      >
        {view3D ? 'List View' : '3D View'}
      </Button>
      
      {view3D ? (
        <PlanSelector3D plans={filteredPlans} onSelect={handleSelectPlan} />
      ) : (
        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item.id}
          renderItem={renderPlan}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  countryList: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  countryChip: {
    marginHorizontal: 4,
  },
  plansList: {
    paddingBottom: 100,
  },
  planCard: {
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planDetails: {
    marginBottom: 16,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewToggle: {
    marginBottom: 16,
  },
});