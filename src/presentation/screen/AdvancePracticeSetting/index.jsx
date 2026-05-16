import { ScrollView, View } from 'react-native';

import { Page, CommonHeader } from '../../component/ui';
import { BrushModeCard, ReviewPlanCard, ReviewMultiplierCard } from './widget';

import { atomLayout, iconSource, iconStyles } from '../../style';

export default function AdvancedSettingScreen({ navigation }) {
  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <CommonHeader
          title="高级设置"
          leftImageSource={iconSource.back}
          leftImageStyle={iconStyles.md}
          onLeftPress={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={[atomLayout.gapLG]}
          showsVerticalScrollIndicator={false}
        >
          <BrushModeCard />
          <ReviewPlanCard />
          <ReviewMultiplierCard />
        </ScrollView>
      </View>
    </Page>
  );
}
