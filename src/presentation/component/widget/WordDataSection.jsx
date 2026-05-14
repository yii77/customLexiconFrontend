import { useState, memo, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useWordDefinition, useWordNotes } from '../../../logic/hook/word';

import { DefinitionCard, NoteCard } from '.';

import {
  atomLayout,
  atomTypography,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';

export const WordDataSection = ({ word }) => {
  const [showDef, setShowDef] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  return (
    <ScrollView>
      <DefinitionItem word={word} setShowDef={setShowDef} />
      {showDef && hasNotes && <View style={styles.devideLine} />}
      <NotesGroup word={word} setHasNotes={setHasNotes} />
    </ScrollView>
  );
};

const DefinitionItem = memo(
  ({ word, setShowDef }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const { definition } = useWordDefinition(word);

    useEffect(() => {
      setShowDef(!!definition);
    }, [definition, setShowDef]);

    if (!word || !definition) {
      return null;
    }
    return (
      <View style={atomLayout.gapBase}>
        <ExpandableRowHeader
          title={'释义'}
          isExpanded={isExpanded}
          onToggleExpand={() => {
            setIsExpanded(prev => {
              return !prev;
            });
          }}
        />

        {isExpanded && <DefinitionCard definition={definition} />}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.word === nextProps.word;
  },
);

const NotesGroup = memo(
  ({ word, setHasNotes }) => {
    const { notes } = useWordNotes(word);

    useEffect(() => {
      setHasNotes(!!notes?.length);
    }, [notes, setHasNotes]);

    if (!word || !notes) {
      return null;
    }

    return (
      <View style={atomLayout.gapBase}>
        {notes.map((item, index) => (
          <NoteItem
            key={item.bookId}
            item={item}
            isLast={index === notes.length}
          />
        ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.word === nextProps.word;
  },
);

const NoteItem = ({ item, isLast }) => {
  const {
    id,
    bookId,
    name,
    isExpanded: defaultExpanded,
    mode,
    content,
    style,
  } = { item };
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={atomLayout.gapBase}>
      <ExpandableRowHeader
        title={name}
        isExpanded={isExpanded}
        onToggleExpand={() => {
          setIsExpanded(prev => {
            return !prev;
          });
        }}
      />
      {isExpanded && (
        <NoteCard mode={mode} content={content} noteStyle={style} />
      )}
      {!isLast && <View style={styles.devideLine} />}
    </View>
  );
};

const ExpandableRowHeader = ({
  title,
  isExpanded,
  onToggleExpand,
  onLongPress,
  showEdit = false,
  onEdit,
  leftExtra,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggleExpand}
      onLongPress={onLongPress}
      style={compositeLayout.rowBetweenCenter}
    >
      {/* 左侧区域 */}
      <View style={[atomLayout.gapMD, atomLayout.row]}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {leftExtra}

        {showEdit && (
          <TouchableOpacity
            onPress={e => {
              e.stopPropagation?.();
              onEdit?.();
            }}
          >
            <Text style={[atomTypography.textSM, atomTypography.colorPrompt]}>
              编辑
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 右侧箭头 */}
      <Image
        source={isExpanded ? iconSource.up : iconSource.down}
        style={[iconStyles.md]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 2,
    //color: Theme.colors.textPrimary,
  },
  devideLine: {
    height: 3,
    //backgroundColor: Theme.colors.divider3,
    borderRadius: 999,
  },
});
