import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { initApp } from './logic/service';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initApp();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <StatusBar
      backgroundColor="transparent"
      translucent
      barStyle="dark-content"
    />
  );
}
