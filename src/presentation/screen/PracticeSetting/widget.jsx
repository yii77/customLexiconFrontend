import { View, Text, Image, TouchableOpacity } from 'react-native';

import { TextButton } from '../../component/ui';

import {
  atomLayout,
  atomTypography,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export function DividingLine() {
  return <View style={style.dividingLine} />;
}

export function SettingItem({
  label,
  right,
  onPress,
  containerStyle,
  labelStyle,
}) {
  return (
    <TouchableOpacity
      style={[
        compositeLayout.rowBetweenCenter,
        atomLayout.paddingHorizontalBase,
        atomLayout.paddingVerticalSM,
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[atomTypography.textMD, atomTypography.colorBlack, labelStyle]}
      >
        {label}
      </Text>
      {right}
    </TouchableOpacity>
  );
}

export function SettingGroup({ config, values, onPress }) {
  return (
    <View style={atomLayout.gapBase}>
      {config.map(item => (
        <SettingItem
          key={item.key}
          label={item.label}
          onPress={() => onPress(item.key)}
          right={
            <View style={[compositeLayout.rowCenterCenter, atomLayout.gapSM]}>
              <Text style={atomTypography.colorTertiary}>
                {item.displayValue ?? values[item.key]}
              </Text>
              <Image
                source={iconSource.right}
                style={[iconStyles.sm, compositeLayout.triggerArrow]}
              />
            </View>
          }
        />
      ))}
    </View>
  );
}

export function OptionsList({ options, onSelect }) {
  if (!options?.length) return null;
  return (
    <View>
      {options.map(opt => (
        <TextButton
          key={String(opt)}
          title={String(opt)}
          onPress={() => onSelect(opt)}
          buttonStyle={atomLayout.paddingBase}
          textStyle={atomTypography.textMD}
        />
      ))}
    </View>
  );
}
