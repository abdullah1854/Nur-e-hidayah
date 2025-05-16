import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { QuranProvider } from './src/context/QuranContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebLoginScreen from './src/screens/web/WebLoginScreen';
import TestScreen from './src/screens/web/TestScreen';
import WebHomeScreen from './src/screens/web/WebHomeScreen';
import WebReadingScreen from './src/screens/web/WebReadingScreen';
import WebSearchScreen from './src/screens/web/WebSearchScreen';
import WebTafseerScreen from './src/screens/web/WebTafseerScreen';
import WebSettingsScreen from './src/screens/web/WebSettingsScreen';
import WebLayout from './src/components/web/WebLayout';
//import './src/styles/webStyles.css';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          // Verify token with backend
          const response = await fetch('https://your-domain.com/api/auth/verify.php', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
          
          const data = await response.json();
          if (data.success) {
            setInitialRoute('Layout');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return <View style={styles.loadingContainer} />;
  }
  return (
    <View style={styles.container}>
      <QuranProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login" component={WebLoginScreen} />
            <Stack.Screen name="Layout" component={WebLayout} />
            <Stack.Screen name="Home" component={WebHomeScreen} />
            <Stack.Screen name="Reading" component={WebReadingScreen} />
            <Stack.Screen name="Search" component={WebSearchScreen} />
            <Stack.Screen name="Tafseer" component={WebTafseerScreen} />
            <Stack.Screen name="Settings" component={WebSettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </QuranProvider>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
};

export default App;