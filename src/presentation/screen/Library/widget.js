import { memo } from 'react';
import { Text, FlatList, TouchableOpacity, View } from 'react-native';

import { TextButton } from '../../component/ui';

import { atomLayout, atomTypography } from '../../style';
import style from './style';

export function Search({ onSearch }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onSearch}>
      <View style={style.searchTextInput}>
        <Text style={style.placeholder}>输入词书名称搜索</Text>
      </View>
    </TouchableOpacity>
  );
}

export const CategoryList = ({ categories, selectedCategory, onSelect }) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item;

    return (
      <CategoryItem item={item} isSelected={isSelected} onPress={onSelect} />
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        data={categories}
        extraData={selectedCategory}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
      <View style={style.border}></View>
    </View>
  );
};

const CategoryItem = memo(({ item, isSelected, onPress }) => {
  return (
    <View style={[style.categoryItem, atomLayout.marginHorizontalBase]}>
      <TextButton
        title={item}
        onPress={() => onPress(item)}
        textStyle={[
          atomTypography.colorBlack,
          atomTypography.textMD,
          isSelected ? atomTypography.fontMedium : atomTypography.colorPrompt,
        ]}
      />
      {isSelected && <View style={[style.categorySelected]} />}
    </View>
  );
});

export const SubcategoryList = ({
  subcategories,
  selectedSubcategory,
  onSelect,
}) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedSubcategory === item;

    return (
      <SubcategoryItem item={item} isSelected={isSelected} onPress={onSelect} />
    );
  };

  if (subcategories.length === 0) return;

  return (
    <View>
      <FlatList
        horizontal
        data={subcategories}
        extraData={selectedSubcategory}
        keyExtractor={item => item}
        contentContainerStyle={[atomLayout.gapBase]}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};

const SubcategoryItem = memo(({ item, isSelected, onPress }) => {
  return (
    <TextButton
      title={item}
      onPress={() => onPress(item)}
      buttonStyle={[
        style.subcategoryDefault,
        isSelected && style.subcategorySelected,
      ]}
      textStyle={{}}
    />
  );
});
