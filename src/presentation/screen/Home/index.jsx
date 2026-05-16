import { View } from 'react-native';

import { Page } from '../../component/ui';
import { PracticeBookCard, DailyTaskCard, Header } from './widget';

import { atomLayout } from '../../style';

export default function HomeScreen() {
  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <Header />
        <PracticeBookCard />
        <DailyTaskCard />
      </View>
    </Page>
  );
}
