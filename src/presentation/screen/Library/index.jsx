import { View, Text } from 'react-native';

import {
  useFetchLibrary,
  useLibraryData,
  useDownloadBook,
} from '../../../logic/hook/library';

import { Page, CommonHeader } from '../../component/ui';
import { BookList } from '../../component/widget';
import { Search, CategoryList, SubcategoryList } from './widget';

import { atomLayout, iconSource } from '../../style';

export default function LibraryScreen({ navigation, route }) {
  const { practiceBookId } = route.params;

  const { library } = useFetchLibrary();

  const {
    categoryArray,
    subcategoryArray,
    bookArray,
    selectedCategory,
    selectedSubcategory,
    handleCategoryChange,
    handleSubcategoryChange,
  } = useLibraryData(library);

  const { handlePrepareDownload } = useDownloadBook();

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <CommonHeader
          title={'词库'}
          leftImageSource={iconSource.back}
          onLeftPress={() => navigation.goBack()}
        />
        <Search
          onSearch={() => {
            navigation.navigate('SearchBookScreen', { library });
          }}
        />
        <CategoryList
          categories={categoryArray}
          selectedCategory={selectedCategory}
          onSelect={handleCategoryChange}
        />
        <SubcategoryList
          subcategories={subcategoryArray}
          selectedSubcategory={selectedSubcategory}
          onSelect={handleSubcategoryChange}
        />
        {bookArray.length === 0 ? (
          <Text>你还没有该词书 ~</Text>
        ) : (
          <BookList
            books={bookArray}
            onDownload={handlePrepareDownload}
            practiceBookId={practiceBookId}
          />
        )}
      </View>
    </Page>
  );
}
