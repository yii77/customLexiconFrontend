import { View } from 'react-native';

import { useWordListData } from '../../../logic/hook/book';
import { useBottomTab } from '../../../logic/hook/navigation';

import { Page } from '../../component/ui';
import { BottomTabBar } from '../../component/widget';
import { DefaultHeader, ListContent } from './widget';

import { compositeLayout } from '../../style';

export default function BookManagerScreen() {
  const {
    displayBook,
    updateDisplayBook,
    displayOrder,
    updateDisplayOrder,
    isGrouped,
    listData,
  } = useWordListData();

  const { handleTabPress } = useBottomTab();

  return (
    <Page>
      <View style={[compositeLayout.pageWithTab]}>
        <DefaultHeader
          displayBook={displayBook}
          displayOrder={displayOrder}
          onSelectDisplayOrder={updateDisplayOrder}
          onSelectDisplayBook={updateDisplayBook}
        />

        <ListContent
          key={displayOrder}
          listData={listData}
          displayOrder={displayOrder}
          isGrouped={isGrouped}
          bookId={displayBook?._id}
        />
      </View>
      <BottomTabBar
        activeTab="Book"
        onTabPress={key => handleTabPress(key, 'Book')}
      />
    </Page>
  );
}
