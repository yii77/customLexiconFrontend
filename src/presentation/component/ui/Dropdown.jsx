import { useState } from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';

import {
  atomLayout,
  compositeLayout,
  iconSource,
  iconStyles,
  BG_COLOR,
  BORDER_COLOR,
  atomTypography,
} from '../../style';

/**
 * 下拉菜单组件
 * @param {Array} options - 下拉选项数组
 * @param {string|number} value - 当前选中的值
 * @param {function} onSelect - 选中菜单项时触发
 * @param {string} placeholder - 未选择时显示的占位文字
 * @param {function} renderTrigger - 自定义触发器渲染函数
 * @param {function} renderContent - 自定义菜单内容渲染函数
 * @param {object} containerStyle - 下拉组件外层容器样式
 * @param {object} triggerStyle - 默认触发器容器样式
 * @param {object} labelStyle - 触发器文字样式
 * @param {object} triggerArrowStyle - 触发器箭头图标样式
 * @param {object} menuStyle - 下拉菜单容器样式
 * @param {object|function} itemStyle - 菜单项样式，可传样式对象或函数
 * @param {object|function} itemTextStyle - 菜单项文字样式，可传样式对象或函数
 *
 * @param {number} zIndex - 下拉菜单层级，默认 10
 */
export function Dropdown({
  options = [],
  value,
  onSelect,
  placeholder = '请选择',
  renderTrigger,
  renderContent,
  containerStyle,
  triggerStyle,
  labelStyle,
  triggerArrowStyle,
  menuStyle,
  itemStyle,
  itemTextStyle,
  zIndex = 10,
}) {
  const [visible, setVisible] = useState(false);

  const [menuWidth, setMenuWidth] = useState(120);
  const [maxWidth, setMaxWidth] = useState(0);
  const displayLabel = value ? value : placeholder;

  return (
    <View style={[style.dropdownContainer, containerStyle]}>
      {/* 触发器 */}
      {renderTrigger ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setVisible(v => !v)}
        >
          {renderTrigger(visible)}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[style.trigger, triggerStyle]}
          activeOpacity={0.8}
          onPress={() => setVisible(v => !v)}
        >
          <Text style={[style.label, labelStyle]}>{displayLabel}</Text>
          <Image
            source={visible ? iconSource.up : iconSource.down}
            style={[style.arrow, triggerArrowStyle]}
          />
        </TouchableOpacity>
      )}

      {/* 菜单 */}
      {visible && (
        <>
          {/* 遮罩 */}
          <TouchableOpacity
            style={compositeLayout.visible}
            onPress={() => setVisible(false)}
          />

          <View style={[{ zIndex, width: menuWidth }, style.menu, menuStyle]}>
            {renderContent
              ? renderContent({ close: () => setVisible(false) })
              : options.map((opt, index) => {
                  const optionLabel = getOptionLabel(opt);
                  const optionValue = getOptionValue(opt);
                  const selected = optionLabel === value;

                  return (
                    <TouchableOpacity
                      key={optionValue}
                      style={[
                        style.item,
                        typeof itemStyle === 'function'
                          ? itemStyle(opt, index)
                          : itemStyle,
                      ]}
                      onPress={() => {
                        onSelect(optionValue, opt);
                        setVisible(false);
                      }}
                    >
                      <View
                        style={[
                          compositeLayout.rowCenterCenter,
                          atomLayout.gapMD,
                        ]}
                      >
                        {/* 选中状态 */}
                        <Image
                          source={
                            selected ? iconSource.lightSelect : iconSource.empty
                          }
                          style={iconStyles.xs}
                        />

                        {/* 文本（测量宽度） */}
                        <Text
                          onLayout={e => {
                            const width = e.nativeEvent.layout.width;

                            if (width > maxWidth) {
                              setMaxWidth(width);
                              setMenuWidth(width + 50);
                            }
                          }}
                          style={[
                            atomTypography.textMD,
                            typeof itemTextStyle === 'function'
                              ? itemTextStyle(opt, index)
                              : itemTextStyle,
                          ]}
                        >
                          {optionLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
          </View>
        </>
      )}
    </View>
  );
}

function getOptionLabel(option) {
  return typeof option === 'object' ? option.label : option;
}

function getOptionValue(option) {
  return typeof option === 'object' ? option.value : option;
}

const style = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  menu: {
    position: 'absolute',
    backgroundColor: BG_COLOR.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    borderColor: BORDER_COLOR.onWhite,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
