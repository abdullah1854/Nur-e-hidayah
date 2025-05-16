import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// Simple icon mapping for web - you can expand this or use a proper icon library
const iconMap: { [key: string]: string } = {
  'home': '🏠',
  'search': '🔍',
  'bookmark': '🔖',
  'bookmark-border': '📑',
  'settings': '⚙️',
  'play-arrow': '▶️',
  'pause': '⏸️',
  'menu-book': '📖',
  'delete': '🗑️',
  'visibility': '👁️',
  'visibility-off': '🚫',
  'add': '➕',
  'remove': '➖',
  'check': '✓',
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  return (
    <span 
      style={{
        fontSize: size,
        color: color,
        ...style
      }}
    >
      {iconMap[name] || '❓'}
    </span>
  );
};

export default Icon;