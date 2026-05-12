import { View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { atomLayout, atomEffect } from '../../style';

export function Page({ children, backgroundColor }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        atomLayout.flex,
        atomEffect.bgPage,
        backgroundColor && { backgroundColor },
      ]}
    >
      {/* 顶部安全区 */}
      <View style={{ height: insets.top }} />

      {/* 内容 */}
      {children}

      {/* 底部安全区 */}
      <View style={{ height: insets.bottom }} />
    </View>
  );
}
