import { View, TextInput } from 'react-native';

import { useSearchBook } from '../../../logic/hook/library';

import { Page, CommonHeader } from '../../component/ui';
import { BookList } from '../../component/widget';

import { atomLayout, iconSource } from '../../style';
import style from './style';

export default function LibraryScreen({ route, navigation }) {
  const { library = [] } = route.params || {};

  const { keyword, setKeyword, bookArray, handleSearch } =
    useSearchBook(library);

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <CommonHeader
          title={'查找词书'}
          leftImageSource={iconSource.back}
          onLeftPress={() => navigation.goBack()}
        />

        <TextInput
          style={style.searchTextInput}
          placeholder="搜索词书..."
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        <BookList
          books={bookArray}
          onDownload={() => {}}
          practiceBookId={'AAA'}
        />
      </View>
    </Page>
  );
}
