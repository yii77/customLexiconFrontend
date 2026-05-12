import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { initApp } from './logic/service';

import { FontProvider } from './logic/context';
import { CustomAlertProvider } from './presentation/component/system/Alert/CustomAlertProvider';
import { ToastProvider } from './presentation/component/system/Toast/ToastProvider';

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
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="dark-content"
          />
        </FontProvider>
      </CustomAlertProvider>
    </ToastProvider>
  );
}
