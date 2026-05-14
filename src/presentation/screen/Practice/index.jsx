import { View } from 'react-native';

import { usePracticeData } from '../../../logic/hook/practice';

import { Page } from '../../component/ui';
import { PracticeContent, ProgressHeader } from './widget';

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
          <View></View>
        ) : (
          <PracticeContent
            currentWord={currentWord}
            completeStep={completeStep}
            updateStatus={updateStatus}
          />
        )}
      </View>
    </Page>
  );
}
