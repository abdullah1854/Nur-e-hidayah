import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { webTheme } from '../../styles/webTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  darkMode?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  darkMode = false,
  icon,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: 'transparent',
      borderWidth: 0,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: darkMode ? webTheme.colors.primaryDark : webTheme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: webTheme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: darkMode ? webTheme.colors.primaryLight : webTheme.colors.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return webTheme.colors.surface;
      case 'outline':
      case 'text':
        return darkMode ? webTheme.colors.primaryLight : webTheme.colors.primary;
      default:
        return webTheme.colors.text;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: webTheme.spacing.xs,
          paddingHorizontal: webTheme.spacing.sm,
          minHeight: 32,
        };
      case 'md':
        return {
          paddingVertical: webTheme.spacing.sm,
          paddingHorizontal: webTheme.spacing.md,
          minHeight: 40,
        };
      case 'lg':
        return {
          paddingVertical: webTheme.spacing.md,
          paddingHorizontal: webTheme.spacing.lg,
          minHeight: 48,
        };
      default:
        return {};
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return webTheme.typography.body2.fontSize;
      case 'md':
        return webTheme.typography.body1.fontSize;
      case 'lg':
        return webTheme.typography.h4.fontSize;
      default:
        return webTheme.typography.body1.fontSize;
    }
  };

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: webTheme.borderRadius.md,
    opacity: (disabled || loading) ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
    ...getVariantStyle(),
    ...getSizeStyle(),
    ...style,
  };

  const buttonTextStyle: TextStyle = {
    fontWeight: '600',
    color: getTextColor(),
    fontSize: getTextSize(),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={variant === 'primary' ? webTheme.colors.surface : webTheme.colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={buttonTextStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};