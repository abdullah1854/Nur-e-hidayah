import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { Card } from '../web/Card';
import { Button } from '../web/Button';
import { webTheme } from '../../styles/webTheme';

const WebLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode, setIsDarkMode, user, logout } = useQuran();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Search', label: 'Search', icon: '🔍' },
    { id: 'Settings', label: 'Settings', icon: '⚙️' },
  ];

  const currentRoute = route.name;

  React.useEffect(() => {
    // Navigate to Home by default
    if (currentRoute === 'Layout') {
      navigation.navigate('Home' as never);
    }
  }, []);


  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Sidebar */}
      <View style={[
        styles.sidebar, 
        isDarkMode && styles.darkSidebar,
        { width: sidebarOpen ? 280 : 70 }
      ]}>
        <View style={styles.sidebarHeader}>
          {sidebarOpen && (
            <Text style={[styles.logo, isDarkMode && styles.logoBack]}>
              نُورُ الْهِدَايَة
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleButton}>
            <Text style={[styles.toggleIcon, isDarkMode && styles.toggleIconDark]}>
              {sidebarOpen ? '◀' : '▶'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sidebarContent}>
          {menuItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  isActive && styles.activeMenuItem,
                  isDarkMode && styles.darkMenuItem,
                  isActive && isDarkMode && styles.activeDarkMenuItem,
                ]}
                onPress={() => navigation.navigate(item.id as never)}>
                <Text style={[styles.menuIcon, isActive && styles.activeMenuIcon]}>
                  {item.icon}
                </Text>
                {sidebarOpen && (
                  <Text style={[
                    styles.menuLabel,
                    isDarkMode && styles.darkText,
                    isActive && styles.activeMenuLabel
                  ]}>
                    {item.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.sidebarFooter}>
            {user && sidebarOpen && (
              <Card style={styles.userProfile} darkMode={isDarkMode} padding="sm">
                {user.picture ? (
                  <Image source={{ uri: user.picture }} style={styles.userAvatar} />
                ) : (
                  <View style={[styles.userAvatarPlaceholder, isDarkMode && styles.userAvatarPlaceholderDark]}>
                    <Text style={styles.userInitial}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, isDarkMode && styles.darkText]}>
                    {user.name}
                  </Text>
                  <Text style={[styles.userEmail, isDarkMode && styles.darkSubtext]}>
                    {user.email}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    logout();
                    navigation.navigate('Login' as never);
                  }}>
                  <Text style={styles.logoutIcon}>🚪</Text>
                </TouchableOpacity>
              </Card>
            )}
            
            <TouchableOpacity
              style={[styles.darkModeToggle, isDarkMode && styles.darkModeToggleDark]}
              onPress={() => setIsDarkMode(!isDarkMode)}>
              <Text style={styles.darkModeIcon}>
                {isDarkMode ? '☀️' : '🌙'}
              </Text>
              {sidebarOpen && (
                <Text style={[styles.darkModeLabel, isDarkMode && styles.darkText]}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
      </View>

      {/* Main Content */}
      <View style={[styles.mainContent, isDarkMode && styles.darkMainContent]}>
        {children}
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: webTheme.colors.background,
  },
  darkContainer: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  sidebar: {
    backgroundColor: webTheme.colors.surface,
    borderRightWidth: 1,
    borderRightColor: webTheme.colors.border,
  },
  darkSidebar: {
    backgroundColor: webTheme.colors.surfaceDark,
    borderRightColor: webTheme.colors.borderDark,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: webTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: webTheme.colors.border,
  },
  logo: {
    fontSize: webTheme.typography.h3.fontSize,
    fontWeight: webTheme.typography.h3.fontWeight,
    color: webTheme.colors.primary,
  },
  logoBack: {
    color: webTheme.colors.primaryLight,
  },
  toggleButton: {
    padding: webTheme.spacing.sm,
    borderRadius: webTheme.borderRadius.md,
  },
  toggleIcon: {
    fontSize: 16,
    color: webTheme.colors.textSecondary,
  },
  toggleIconDark: {
    color: webTheme.colors.textSecondaryDark,
  },
  sidebarContent: {
    flex: 1,
    paddingVertical: webTheme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: webTheme.spacing.md,
    marginHorizontal: webTheme.spacing.sm,
    marginVertical: webTheme.spacing.xs,
    borderRadius: webTheme.borderRadius.lg,
  },
  darkMenuItem: {},
  activeMenuItem: {
    backgroundColor: webTheme.colors.primary,
  },
  activeDarkMenuItem: {
    backgroundColor: webTheme.colors.primaryDark,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: webTheme.spacing.md,
  },
  activeMenuIcon: {},
  menuLabel: {
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.text,
  },
  darkText: {
    color: webTheme.colors.textDark,
  },
  activeMenuLabel: {
    color: 'white',
    fontWeight: '600',
  },
  sidebarFooter: {
    padding: webTheme.spacing.md,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: webTheme.spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: webTheme.spacing.sm,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: webTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: webTheme.spacing.sm,
  },
  userAvatarPlaceholderDark: {
    backgroundColor: webTheme.colors.primaryDark,
  },
  userInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: webTheme.typography.body2.fontSize,
    fontWeight: '600',
    color: webTheme.colors.text,
  },
  userEmail: {
    fontSize: webTheme.typography.caption.fontSize,
    color: webTheme.colors.textSecondary,
  },
  darkSubtext: {
    color: webTheme.colors.textSecondaryDark,
  },
  logoutButton: {
    padding: webTheme.spacing.sm,
  },
  logoutIcon: {
    fontSize: 20,
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: webTheme.spacing.md,
    backgroundColor: webTheme.colors.background,
    borderRadius: webTheme.borderRadius.md,
  },
  darkModeToggleDark: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  darkModeIcon: {
    fontSize: 20,
    marginRight: webTheme.spacing.sm,
  },
  darkModeLabel: {
    fontSize: webTheme.typography.body2.fontSize,
    color: webTheme.colors.textSecondary,
  },
  mainContent: {
    flex: 1,
    backgroundColor: webTheme.colors.background,
  },
  darkMainContent: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
};

export default WebLayout;