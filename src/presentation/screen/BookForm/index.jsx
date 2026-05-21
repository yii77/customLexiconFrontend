import { memo, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useBookForm } from '../../../logic/hook/book';

import { Page, CommonHeader, TextButton } from '../../component/ui';

import {
  atomLayout,
  atomTypography,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export default function BookForm({ route, navigation }) {
  const {
    subcategory,
    bookName,
    subcategoryOption,
    setSubcategory,
    setBookName,
    isEdit,
    targetCategory,
    handleAddBook,
    handleEditBook,
    handleDeleteBook,
  } = useBookForm();

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <CommonHeader
          title={isEdit ? `编辑${targetCategory}` : `新增${targetCategory}`}
          leftText="取消"
          onLeftPress={() => {
            navigation.goBack();
          }}
          leftTextStyle={atomTypography.colorBlack}
          {...(isEdit && {
            rightImageSource: iconSource.delete,
            onRightPress: handleDeleteBook,
            rightImageStyle: iconStyles.colorTertiary,
          })}
        />

        <View style={style.card}>
          <SubcategorySelector
            items={subcategoryOption}
            selectedValue={subcategory}
            onSelect={setSubcategory}
          />
          <FormInput
            value={subcategory}
            onChange={setSubcategory}
            placeholder={
              !subcategoryOption?.length ? '请创建分类' : '请选择或创建分类'
            }
          />
        </View>

        <View style={style.card}>
          <FormInput
            value={bookName}
            onChange={setBookName}
            placeholder="请输入书籍名称"
          />
        </View>

        <TextButton
          title={isEdit ? '保存' : '确定'}
          onPress={isEdit ? handleEditBook : handleAddBook}
          buttonStyle={style.confirmButton}
          textStyle={style.confirmButtonText}
        />
      </View>
    </Page>
  );
}

const SubcategorySelector = memo(({ items, selectedValue, onSelect }) => {
  if (!items?.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={atomLayout.gapMD}
    >
      {items.map(item => {
        const isSelected = item === selectedValue;
        return (
          <TextButton
            key={item}
            title={item}
            textStyle={[atomTypography.textSM, atomTypography.colorTertiary]}
            buttonStyle={[
              style.subcategoryTab,
              isSelected && style.subcategoryTabActive,
            ]}
            onPress={() => onSelect(isSelected ? '' : item)}
          />
        );
      })}
    </ScrollView>
  );
});

export const FormInput = memo(({ value, onChange, placeholder }) => (
  <TextInput
    placeholder={placeholder}
    style={style.textInput}
    value={value}
    onChangeText={onChange}
  />
));
