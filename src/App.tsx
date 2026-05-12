import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { initApp } from './logic/service';

import { FontProvider } from './logic/context';
import { CustomAlertProvider } from './presentation/component/system/Alert/CustomAlertProvider';
import { ToastProvider } from './presentation/component/system/Toast/ToastProvider';

import TabNavigator from './presentation/navigation/TabNavigator';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initApp();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <ToastProvider>
      <CustomAlertProvider>
        <FontProvider>
          <NavigationContainer>
            <StatusBar
              backgroundColor="transparent"
              translucent
              barStyle="dark-content"
            />
            <TabNavigator />
          </NavigationContainer>
        </FontProvider>
      </CustomAlertProvider>
    </ToastProvider>
  );
}
