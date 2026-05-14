import { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { ChineseText, TextButton } from '../ui';

import {
  atomLayout,
  atomTypography,
  BG_COLOR,
  BORDER_COLOR,
  TEXT_COLOR,
} from '../../style';

export const DefinitionCard = ({ definition }) => {
  if (definition.styleType === 'posPick') {
    return <PosPick content={definition.content} />;
  }

  if (definition.styleType === 'textOnly') {
    return (
      <View>
        {definition.content.map((item, idx) => (
          <ChineseText key={idx}>{Object.values(item).join('.  ')}</ChineseText>
        ))}
      </View>
    );
  }
};

const PosPick = ({ content }) => {
  const [filter, setFilter] = useState('全部');

  const parts = useMemo(() => {
    return [...new Set(content.map(item => Object.values(item)[0]))];
  }, [content]);

  const filteredList = useMemo(() => {
    if (filter === '全部') return content;
    return content.filter(item => Object.values(item)[0] === filter);
  }, [content, filter]);

  useEffect(() => {
    if (parts.length === 1) {
      setFilter(parts[0]);
    } else {
      setFilter('全部');
    }
  }, [parts]);

  return (
    <View style={atomLayout.gapBase}>
      <View style={[atomLayout.wrap, atomLayout.gapSM, atomLayout.row]}>
        {parts.length > 1 && (
          <FilterButton
            label="全部"
            active={filter === '全部'}
            onPress={() => setFilter('全部')}
          />
        )}

        {parts.map(p => (
          <FilterButton
            key={p}
            label={p}
            active={filter === p}
            onPress={() => setFilter(p)}
          />
        ))}
      </View>

      <View style={style.left2}>
        {filteredList.map((item, idx) => {
          const values = Object.values(item);
          const joinedText = values.join('. ');
          const displayContent =
            filter === '全部'
              ? joinedText
              : item.meaning_cn ?? values.slice(1).join('. ');

          return (
            <ChineseText
              key={idx}
              fontWeight={'500'}
              style={style.definitionText}
            >
              {displayContent}
            </ChineseText>
          );
        })}
      </View>
    </View>
  );
};

function FilterButton({ label, active, onPress }) {
  return (
    <TextButton
      title={label}
      onPress={onPress}
      buttonStyle={[style.filterButton, active && style.activeFilterButton]}
      textStyle={[style.filterButtonText, active && atomTypography.fontMedium]}
    />
  );
}

const style = StyleSheet.create({
  filterButton: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR.onPage,
  },
  activeFilterButton: {
    backgroundColor: BG_COLOR.primaryLight,
  },
  filterButtonText: {
    color: TEXT_COLOR.black,
    fontSize: 13,
  },
  definitionText: {
    fontSize: 15,
    lineHeight: 25,
    letterSpacing: 0.2,
  },
  left2: { left: 2 },
});
