import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screen/Home';
import LibraryScreen from '../../screen/Library';
import SearchBookScreen from '../../screen/SearchBook';

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
    </Stack.Navigator>
  );
}
