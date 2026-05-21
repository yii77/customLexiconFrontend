import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { initApp } from './logic/service';

import { FontProvider } from './logic/context';
import { CustomAlertProvider } from './presentation/component/system/Alert/CustomAlertProvider';
import { ToastProvider } from './presentation/component/system/Toast/ToastProvider';

import TabNavigator from './presentation/navigation/TabNavigator';

import { atomLayout } from './presentation/style';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initApp();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={atomLayout.flex}>
      <NavigationContainer>
        <ToastProvider>
          <CustomAlertProvider>
            <FontProvider>
              <StatusBar
                backgroundColor="transparent"
                translucent
                barStyle="dark-content"
              />
              <TabNavigator />
            </FontProvider>
          </CustomAlertProvider>
        </ToastProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
