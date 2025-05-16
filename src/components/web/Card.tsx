import React from 'react';
import { View, ViewStyle } from 'react-native';
import { webTheme } from '../../styles/webTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  onHover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = true,
  onHover = true,
  padding = 'md',
  darkMode = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm':
        return { padding: webTheme.spacing.sm };
      case 'md':
        return { padding: webTheme.spacing.md };
      case 'lg':
        return { padding: webTheme.spacing.lg };
      default:
        return { padding: webTheme.spacing.md };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: webTheme.borderRadius.lg,
    backgroundColor: darkMode ? webTheme.colors.surfaceDark : webTheme.colors.surface,
    borderWidth: 1,
    borderColor: darkMode ? webTheme.colors.borderDark : webTheme.colors.border,
    ...getPaddingStyle(),
    ...style,
  };

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};