import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App.web';

// Register the app
AppRegistry.registerComponent('NurEHidayah', () => App);

// Create and render the app
const rootElement = document.getElementById('root');
if (rootElement) {
  // Clear loading text
  rootElement.innerHTML = '';
  
  const root = ReactDOM.createRoot(rootElement);
  try {
    root.render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    // Add error details to help debug
    console.error('Stack trace:', error.stack);
  }
} else {
  console.error('Root element not found');
}