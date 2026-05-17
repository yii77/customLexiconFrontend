import { memo } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { TABS } from '../../../data/constants';

import { BG_COLOR, ICON_COLOR, iconSource } from '../../style';

export const BottomTabBar = memo(({ activeTab, onTabPress }) => {
  return (
    <View style={style.tabContainer}>
      {TABS.map(tab => {
        const isFocused = tab.key === activeTab;
        const activeColor = ICON_COLOR.active;
        const color = isFocused ? activeColor : ICON_COLOR.inactive;

        return (
          <TouchableOpacity
            key={tab.key}
            style={style.tabItem}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Image
              source={tab.icon}
              style={[style.icon, { tintColor: color }]}
            />
            <Text style={[style.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const style = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    backgroundColor: BG_COLOR.bgCard,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
