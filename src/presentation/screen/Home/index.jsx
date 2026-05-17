import { View } from 'react-native';

import { useBottomTab } from '../../../logic/hook/navigation';

import { Page } from '../../component/ui';
import { BottomTabBar } from '../../component/widget';

import { PracticeBookCard, DailyTaskCard, Header } from './widget';

import { atomLayout } from '../../style';

export default function HomeScreen() {
  const { handleTabPress } = useBottomTab();

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <Header />
        <PracticeBookCard />
        <DailyTaskCard />
      </View>
      <BottomTabBar
        activeTab="Practice"
        onTabPress={key => handleTabPress(key, 'Practice')}
      />
    </Page>
  );
}
