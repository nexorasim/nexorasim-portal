import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Card, Text, Button, List, Avatar, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { logout } from '../../store/slices/authSlice';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.charAt(0) || 'U'} 
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {user?.name || 'User'}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user?.email}
          </Text>
          <Button
            mode="outlined"
            onPress={() => router.push('/edit-profile')}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('settings')}
          </Text>
          
          <List.Item
            title={t('darkMode')}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
          
          <List.Item
            title={t('notifications')}
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          
          <List.Item
            title={t('biometric')}
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch
                value={biometric}
                onValueChange={setBiometric}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title={t('language')}
            description={i18n.language === 'my' ? 'မြန်မာ' : 'English'}
            left={(props) => <List.Icon {...props} icon="translate" />}
            onPress={() => changeLanguage(i18n.language === 'en' ? 'my' : 'en')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <List.Item
            title={t('orderHistory')}
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/orders')}
          />
          
          <List.Item
            title={t('support')}
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/support')}
          />
          
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/privacy')}
          />
          
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/terms')}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title={t('logout')}
            titleStyle={styles.logoutText}
            left={(props) => <List.Icon {...props} icon="logout" color="#F44336" />}
            onPress={handleLogout}
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
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
  },
  settingsCard: {
    marginBottom: 16,
  },
  actionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  logoutText: {
    color: '#F44336',
  },
});