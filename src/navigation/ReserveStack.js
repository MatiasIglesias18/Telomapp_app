import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReserveScreen } from "../screens/ReserveScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function ReserveStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.reserve.reserve}
        component={ReserveScreen}
        options={{ title: "Mis Reservas" }}
      />
    </Stack.Navigator>
  );
}
