import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useUser } from '../context/Auth';
import HomeAdmin from '../screens/HomeAdmin'; 
import { LoadingOverlay } from "../components/loadingOverlay";

export function Router() {
  const { user, usuario, initializing, loadingUsuario, action, loged } = useUser();

if (user && loadingUsuario) {
  return <LoadingOverlay />;
}

return (
  <NavigationContainer>
    {user && action === "login" && loged && usuario?.acesso > 0 ? (
      <AppStack isAdmin={usuario?.acesso === 2} />
    ) : (
      <AuthStack />
    )}
  </NavigationContainer>
);

}

