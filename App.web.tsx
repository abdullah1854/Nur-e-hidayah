import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QuranProvider } from './src/context/QuranContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import TafseerScreen from './src/screens/TafseerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import Icon from './src/components/Icon.web';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <QuranProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}>
              <Stack.Screen
                name="Main"
                component={TabNavigator}
                options={{ title: 'Nur-e-Hidayah' }}
              />
              <Stack.Screen
                name="Reading"
                component={ReadingScreen}
                options={({ navigation }) => ({ 
                  title: 'Reading',
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 15 }}>
                      <Text style={{ color: '#fff', fontSize: 18 }}>← Back</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="Tafseer"
                component={TafseerScreen}
                options={({ navigation }) => ({ 
                  title: 'Tafseer',
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{ marginLeft: 15 }}>
                      <Text style={{ color: '#fff', fontSize: 18 }}>← Back</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </QuranProvider>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    width: '100vw',
  },
});

export default App;