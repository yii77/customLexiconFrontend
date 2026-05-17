import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PracticeBookProvider } from '../../logic/context';

import PracticeStack from './stack/PracticeStack';
import BookStack from './stack/BookStack';

export default function TabNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <PracticeBookProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="PracticeStack" component={PracticeStack} />
        <Stack.Screen name="BookStack" component={BookStack} />
      </Stack.Navigator>
    </PracticeBookProvider>
  );
}
