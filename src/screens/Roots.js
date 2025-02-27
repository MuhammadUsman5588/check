import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import FirebaseSignup from "./FirebaseSignup";
import FirebaseLogin from "./FirebaseLogin";







const Stack = createNativeStackNavigator();

export default function Roots() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="FirebaseSignup" component={FirebaseSignup} />
                <Stack.Screen name="FirebaseLogin" component={FirebaseLogin} />





            </Stack.Navigator>
        </NavigationContainer>
    );
}
