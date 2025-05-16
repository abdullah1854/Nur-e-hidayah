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
  root.render(<App />);
  console.log('App rendered successfully');
} else {
  console.error('Root element not found');
}