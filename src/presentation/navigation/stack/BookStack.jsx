import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookManagerScreen from '../../screen/BookManager';

export default function BookStackNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BookManagerScreen" component={BookManagerScreen} />
    </Stack.Navigator>
  );
}
