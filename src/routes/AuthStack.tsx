
import { createNativeStackNavigator,NativeStackNavigationProp } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';


const Stack = createNativeStackNavigator();

type AuthStackParams = {
  Login: undefined;
  Cadastro: undefined;
};

export type AuthStack = NativeStackNavigationProp<AuthStackParams>;

export function AuthStack() {
 return (
   <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false, headerTitle: ""}}>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Cadastro" component={Cadastro}/>
   </Stack.Navigator>
 );
}