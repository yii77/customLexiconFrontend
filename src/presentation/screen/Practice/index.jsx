import { View } from 'react-native';

import { usePracticeData } from '../../../logic/hook/practice';

import { Page } from '../../component/ui';
import { PracticeContent, ProgressHeader, SessionList } from './widget';

import { atomLayout } from '../../style';

export default function PracticeScreen() {
  const { progress, currentWord, completeStep, updateStatus } =
    usePracticeData();

  if (!currentWord && progress.total != progress.completed) {
    return null;
  }

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <ProgressHeader progress={progress} />
        {progress.total === progress.completed ? (
          <SessionList />
        ) : (
          <PracticeContent
            key={currentWord.word}
            currentWord={currentWord}
            completeStep={completeStep}
            updateStatus={updateStatus}
          />
        )}
      </View>
    </Page>
  );
}
