import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';

import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import {
  useBrushMode,
  useReviewPlan,
  useReviewMultiplier,
} from '../../../logic/hook/practice';

import { useCustomAlert } from '../../component/system';
import { ImageButton, TextButton } from '../../component/ui';

import {
  atomLayout,
  atomTypography,
  compositeEffect,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

import { BRUSH_MODE_LABEL } from '../../../data/constants';

const STAGE_LABELS = ['前期', '中期', '后期'];

export function BrushModeCard() {
  const { brushModes, load, handleToggle, handleReorder } = useBrushMode();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    load();
  }, []);

  return (
    <View
      style={[atomLayout.gapMD, style.section, compositeEffect.secondaryShadow]}
    >
      <View style={[atomLayout.row, atomLayout.alignEnd]}>
        <Text style={style.sectionTitle}>练习模式</Text>
        <Text style={[atomTypography.colorPrompt, atomTypography.textSM]}>
          （长按拖拽调整顺序）
        </Text>
      </View>
      <View style={atomLayout.gapBase}>
        <View
          style={[compositeLayout.rowCenterCenter, style.stageTabContainer]}
        >
          {STAGE_LABELS.map((label, index) => (
            <TextButton
              key={label}
              title={label}
              onPress={() => setActiveStage(index)}
              buttonStyle={[
                style.stageTab,
                activeStage === index && style.stageTabActive,
              ]}
              textStyle={[
                activeStage === index
                  ? atomTypography.colorBlack
                  : atomTypography.colorInactive,
              ]}
            />
          ))}
        </View>

        <DraggableFlatList
          key={activeStage}
          scrollEnabled={false}
          data={brushModes[activeStage] ?? []}
          keyExtractor={item => item.id}
          onDragEnd={({ data }) => handleReorder(activeStage, data)}
          activationDistance={1}
          contentContainerStyle={atomLayout.gapSM}
          renderItem={({ item, drag }) => (
            <ScaleDecorator>
              <TouchableOpacity
                onLongPress={drag}
                delayLongPress={150}
                onPress={() => handleToggle(activeStage, item.id)}
                style={style.brushModeOption}
              >
                <View
                  style={[
                    atomLayout.row,
                    atomLayout.gapLG,
                    atomLayout.alignCenter,
                  ]}
                >
                  <Image
                    source={iconSource[item.id]}
                    style={[iconStyles.sm, iconStyles.colorTertiary]}
                  />
                  <Text
                    style={
                      item.value
                        ? atomTypography.colorBlue
                        : atomTypography.colorDisabled
                    }
                  >
                    {BRUSH_MODE_LABEL[item.id]}
                  </Text>
                </View>
                <Image
                  source={item.value ? iconSource.select : iconSource.empty}
                  style={[iconStyles.sm, iconStyles.colorBlack]}
                />
              </TouchableOpacity>
            </ScaleDecorator>
          )}
        />
      </View>
    </View>
  );
}

export function ReviewPlanCard() {
  const { reviewPlan, load, handleAdd, handleRemove, handleEdit } =
    useReviewPlan();
  const { showAlert, hideAlert } = useCustomAlert();

  useEffect(() => {
    load();
  }, []);

  const openEditAlert = (index, val) => {
    let inputValue = String(val);
    showAlert({
      title: '修改数值',
      content: (
        <TextInput
          style={style.numInput}
          keyboardType="numeric"
          autoFocus
          defaultValue={inputValue}
          onChangeText={text => {
            inputValue = text;
          }}
        />
      ),
      buttons: [
        { text: '取消', onPress: hideAlert },
        {
          text: '确定',
          onPress: () => {
            hideAlert();
            handleEdit(index, inputValue);
          },
        },
      ],
    });
  };

  const openAddAlert = () => {
    let inputValue = '';

    showAlert({
      title: '添加复习间隔',
      content: (
        <TextInput
          style={style.numInput}
          keyboardType="numeric"
          autoFocus
          placeholder="请输入天数"
          onChangeText={text => {
            inputValue = text;
          }}
        />
      ),
      buttons: [
        {
          text: '取消',
          onPress: hideAlert,
        },
        {
          text: '确定',
          onPress: () => {
            hideAlert();
            handleAdd(inputValue);
          },
        },
      ],
    });
  };

  return (
    <View
      style={[atomLayout.gapMD, style.section, compositeEffect.secondaryShadow]}
    >
      <View style={[compositeLayout.rowBetweenCenter]}>
        <View style={[atomLayout.row, atomLayout.alignEnd]}>
          <Text style={style.sectionTitle}>复习计划间隔</Text>
          <Text style={[atomTypography.colorPrompt, atomTypography.textSM]}>
            （长按删除）
          </Text>
        </View>
        <ImageButton
          imageSource={iconSource.add}
          onPress={openAddAlert}
          imageStyle={iconStyles.md}
        />
      </View>
      <View style={[atomLayout.row, atomLayout.wrap, atomLayout.gapSM]}>
        {reviewPlan.map((val, idx) => (
          <NumberBox
            key={`p-${idx}`}
            value={val}
            onPress={() => openEditAlert(idx, val)}
            onLongPress={reviewPlan.length > 4 ? () => handleRemove(idx) : null}
          />
        ))}
      </View>
    </View>
  );
}

export function ReviewMultiplierCard() {
  const { reviewMultiplier, load, handleEdit } = useReviewMultiplier();
  const { showAlert, hideAlert } = useCustomAlert();

  useEffect(() => {
    load();
  }, []);

  const openInputAlert = (index, val) => {
    let inputValue = String(val);
    showAlert({
      title: '修改数值',
      content: (
        <TextInput
          style={style.numInput}
          keyboardType="numeric"
          autoFocus
          defaultValue={inputValue}
          onChangeText={text => {
            inputValue = text;
          }}
        />
      ),
      buttons: [
        { text: '取消', onPress: hideAlert },
        {
          text: '确定',
          onPress: () => {
            hideAlert();
            handleEdit(index, inputValue);
          },
        },
      ],
    });
  };

  return (
    <View
      style={[
        atomLayout.gapMD,
        style.section,
        compositeEffect.secondaryShadow,
        style.lastSession,
      ]}
    >
      <View style={[atomLayout.row, atomLayout.alignEnd]}>
        <Text style={style.sectionTitle}>各难度的复习倍率</Text>
        <Text style={[atomTypography.colorPrompt, atomTypography.textSM]}>
          （倍率越大，间隔越长）
        </Text>
      </View>

      <View style={atomLayout.gapSM}>
        {reviewMultiplier.map((val, idx) => (
          <View key={`m-${idx}`} style={compositeLayout.rowBetweenCenter}>
            <View style={style.leftSection}>
              <View style={style.difficultyBadge}>
                <Text style={style.difficultyText}>{idx + 1}</Text>
              </View>

              <Text style={style.difficultyLabel}>难度 {idx + 1}</Text>

              {(idx === 0 || idx === 4 || idx === 2) && (
                <Text style={style.difficultyHint}>
                  {idx === 0 && '（容易）'}
                  {idx === 2 && '（标准）'}
                  {idx === 4 && '（困难）'}
                </Text>
              )}
            </View>

            <View style={style.line} />

            <NumberBox value={val} onPress={() => openInputAlert(idx, val)} />
          </View>
        ))}
      </View>
    </View>
  );
}

function NumberBox({ value, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={[
        compositeLayout.rowCenterCenter,
        atomLayout.paddingVerticalXS,
        style.numBox,
      ]}
    >
      <Text style={atomTypography.colorBlack}>{value}</Text>
    </TouchableOpacity>
  );
}
