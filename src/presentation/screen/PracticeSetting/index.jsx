import { View, Image } from 'react-native';

import {
  PRACTICE_MODE_LABEL,
  NEW_ORDER_LABEL,
  REVIEW_ORDER_LABEL,
} from '../../../data/constants';

import { usePracticeSettings } from '../../../logic/hook/practice';

import { useCustomAlert } from '../../component/system';
import { Page, CommonHeader } from '../../component/ui';
import { DividingLine, SettingGroup, SettingItem, OptionsList } from './widget';

import {
  iconSource,
  iconStyles,
  compositeLayout,
  atomLayout,
} from '../../style';
import style from './style';

export default function PracticeSettingScreen({ navigation }) {
  const { getSheetOptions, ...settings } = usePracticeSettings();

  const { showAlert, hideAlert } = useCustomAlert();

  const openOptionAlert = type => {
    const { options, onSelect } = getSheetOptions(type);
    showAlert({
      content: (
        <OptionsList
          options={options}
          onSelect={val => {
            onSelect?.(val);
            hideAlert();
          }}
        />
      ),
      type: 'bottom',
      style: style.optionAlert,
    });
  };

  return (
    <Page>
      <View
        style={[
          atomLayout.flex,
          atomLayout.paddingVerticalBase,
          atomLayout.gapBase,
        ]}
      >
        <CommonHeader
          title="练习设置"
          headerStyle={atomLayout.marginHorizontalBase}
          leftImageSource={iconSource.back}
          leftImageStyle={iconStyles.md}
          onLeftPress={() => navigation.goBack()}
        />

        <DividingLine />

        <SettingGroup
          config={[
            { label: '每日新词上限', key: 'daily_new_limit' },
            { label: '每日复习上限', key: 'daily_review_limit' },
            { label: '每日总数上限', key: 'daily_total_limit' },
          ]}
          values={settings}
          onPress={openOptionAlert}
        />

        <DividingLine />

        <SettingGroup
          config={[
            {
              label: '练习模式',
              key: 'practice_mode',
              displayValue: PRACTICE_MODE_LABEL[settings.practice_mode],
            },
            {
              label: '新词顺序',
              key: 'new_order',
              displayValue: NEW_ORDER_LABEL[settings.new_order],
            },
            {
              label: '复习顺序',
              key: 'review_order',
              displayValue: REVIEW_ORDER_LABEL[settings.review_order],
            },
          ]}
          values={settings}
          onPress={openOptionAlert}
        />

        <DividingLine />

        <SettingItem
          label="高级设置"
          onPress={() => navigation.navigate('AdvancePracticeSettingScreen')}
          right={
            <Image
              source={iconSource.right}
              style={[iconStyles.sm, compositeLayout.triggerArrow]}
            />
          }
        />
      </View>
    </Page>
  );
}
