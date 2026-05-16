import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screen/Home';
import LibraryScreen from '../../screen/Library';
import SearchBookScreen from '../../screen/SearchBook';
import PracticeScreen from '../../screen/Practice';
import ArticleScreen from '../../screen/Article';
import PracticeSettingScreen from '../../screen/PracticeSetting';
import AdvancePracticeSettingScreen from '../../screen/AdvancePracticeSetting';

export default function PracticeStackNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
      <Stack.Screen name="SearchBookScreen" component={SearchBookScreen} />
      <Stack.Screen name="PracticeScreen" component={PracticeScreen} />
      <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
      <Stack.Screen
        name="PracticeSettingScreen"
        component={PracticeSettingScreen}
      />
      <Stack.Screen
        name="AdvancePracticeSettingScreen"
        component={AdvancePracticeSettingScreen}
      />
    </Stack.Navigator>
  );
}
