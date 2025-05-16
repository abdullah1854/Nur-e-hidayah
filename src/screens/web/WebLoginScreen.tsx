import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { authService } from '../../services/authService';
import { Card } from '../../components/web/Card';
import { Button } from '../../components/web/Button';
import { webTheme } from '../../styles/webTheme';

declare global {
  interface Window {
    google: any;
  }
}

const WebLoginScreen = () => {
  const navigation = useNavigation();
  const { setUser, isDarkMode } = useQuran();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoogleScript();
  }, [isDarkMode]);

  const loadGoogleScript = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  };

  const initializeGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
        callback: handleGoogleResponse,
      });
      
      const googleButton = document.getElementById('googleButton');
      if (googleButton) {
        window.google.accounts.id.renderButton(
          googleButton,
          {
            theme: isDarkMode ? 'filled_black' : 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 300,
          }
        );
      }
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.googleLogin(response.credential);
      
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        setUser(result.user);
        
        // Navigate to home after successful login
        navigation.navigate('Layout' as never);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <View 
        style={styles.loginContainer}
      >
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, isDarkMode && styles.logoCircleDark]}>
            <Text style={styles.logoText}>نور</Text>
          </View>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            نُورُ الْهِدَايَة
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
            Your Digital Quran Companion
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard} darkMode={isDarkMode}>
          <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark]}>
            Welcome Back
          </Text>
          <Text style={[styles.cardSubtitle, isDarkMode && styles.cardSubtitleDark]}>
            Sign in to continue your spiritual journey
          </Text>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Google Sign In Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <Button
                title="Signing in..."
                onPress={() => {}}
                loading={true}
                fullWidth
                darkMode={isDarkMode}
              />
            ) : (
              <div 
                id="googleButton" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                }}
              />
            )}
          </View>

          {/* Or Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
            <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>
              OR
            </Text>
            <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
          </View>

          {/* Continue as Guest */}
          <Button
            title="Continue as Guest"
            onPress={() => navigation.navigate('Layout' as never)}
            variant="outline"
            fullWidth
            darkMode={isDarkMode}
          />

          <Text style={[styles.privacyText, isDarkMode && styles.privacyTextDark]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Card>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, isDarkMode && styles.featuresTitleDark]}>
            What you'll get
          </Text>
          <View style={styles.featuresGrid}>
            {[
              {
                icon: '📖',
                title: 'Complete Quran',
                description: 'Read the Holy Quran with multiple translations',
              },
              {
                icon: '🎧',
                title: 'Audio Recitation',
                description: 'Listen to beautiful recitations from renowned Qaris',
              },
              {
                icon: '🔖',
                title: 'Bookmarks & Notes',
                description: 'Save your favorite verses and add personal notes',
              },
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Find verses by keywords or themes instantly',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                style={styles.featureCard}
                darkMode={isDarkMode}
                padding="sm"
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, isDarkMode && styles.featureTitleDark]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, isDarkMode && styles.featureDescriptionDark]}>
                  {feature.description}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: webTheme.colors.background,
  },
  containerDark: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: webTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: webTheme.shadows.lg,
  },
  logoCircleDark: {
    backgroundColor: webTheme.colors.primaryDark,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: webTheme.typography.h1.fontSize,
    fontWeight: webTheme.typography.h1.fontWeight,
    color: webTheme.colors.primary,
    marginBottom: 8,
  },
  titleDark: {
    color: webTheme.colors.primaryLight,
  },
  subtitle: {
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.textSecondary,
  },
  subtitleDark: {
    color: webTheme.colors.textSecondaryDark,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: webTheme.typography.h2.fontSize,
    fontWeight: webTheme.typography.h2.fontWeight,
    color: webTheme.colors.text,
    marginBottom: 8,
  },
  cardTitleDark: {
    color: webTheme.colors.textDark,
  },
  cardSubtitle: {
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  cardSubtitleDark: {
    color: webTheme.colors.textSecondaryDark,
  },
  errorContainer: {
    backgroundColor: webTheme.colors.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: webTheme.borderRadius.md,
    marginBottom: 16,
  },
  errorText: {
    color: webTheme.colors.error,
    fontSize: webTheme.typography.body2.fontSize,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: webTheme.colors.border,
  },
  dividerDark: {
    backgroundColor: webTheme.colors.borderDark,
  },
  dividerText: {
    marginHorizontal: 16,
    color: webTheme.colors.textSecondary,
    fontSize: webTheme.typography.body2.fontSize,
  },
  dividerTextDark: {
    color: webTheme.colors.textSecondaryDark,
  },
  privacyText: {
    fontSize: webTheme.typography.caption.fontSize,
    color: webTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  privacyTextDark: {
    color: webTheme.colors.textSecondaryDark,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 800,
    marginTop: 60,
  },
  featuresTitle: {
    fontSize: webTheme.typography.h3.fontSize,
    fontWeight: webTheme.typography.h3.fontWeight,
    color: webTheme.colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresTitleDark: {
    color: webTheme.colors.textDark,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    padding: 24,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: webTheme.typography.h4.fontSize,
    fontWeight: webTheme.typography.h4.fontWeight,
    color: webTheme.colors.text,
    marginBottom: 8,
  },
  featureTitleDark: {
    color: webTheme.colors.textDark,
  },
  featureDescription: {
    fontSize: webTheme.typography.body2.fontSize,
    color: webTheme.colors.textSecondary,
    textAlign: 'center',
  },
  featureDescriptionDark: {
    color: webTheme.colors.textSecondaryDark,
  },
};

export default WebLoginScreen;