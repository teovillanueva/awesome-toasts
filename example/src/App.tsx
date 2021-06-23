import * as React from 'react';

import { ToastsProvider } from 'awesome-toasts';

import { StatusBar } from 'react-native';

import { Toast } from './components/toast';

import { MainScreen } from './screens/main';

export function App() {
  return (
    <ToastsProvider component={Toast}>
      <StatusBar barStyle="light-content" />
      <MainScreen />
    </ToastsProvider>
  );
}
