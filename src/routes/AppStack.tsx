import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from "../context/Auth";

import Home from '../screens/Home';
import HomeAdmin from '../screens/HomeAdmin';
import MeusArquivos from '../screens/MeusArquivos';
import MeusArquivosImagens from '../screens/MeusArquivosImagens';
import MeusArquivosDocumentos from '../screens/MeusArquivosDocumentos';
import Relatorios from '../screens/Relatorios';
import User from '../screens/User';

const Stack = createNativeStackNavigator();

type AppStackParams = {
  Home: undefined;
  HomeAdmin: undefined;
  MeusArquivos: undefined;
  MeusArquivosImagens: undefined;
  MeusArquivosDocumentos: undefined;
  Relatorios: undefined;
  User: undefined;
};
export type AppStack = NativeStackNavigationProp<AppStackParams>;

export function AppStack({ isAdmin }: { isAdmin?: boolean }) {
  const { usuario } = useUser();

  // Se não for admin, força o valor de isAdmin como false
  const isUsuarioAdmin = usuario?.acesso === 2;

  return (
    <Stack.Navigator
      initialRouteName={isUsuarioAdmin ? "HomeAdmin" : "Home"}
      screenOptions={{ headerShown: false, headerTitle: "" }}
    >
      {/* Sempre visíveis */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MeusArquivos" component={MeusArquivos} />
      <Stack.Screen name="MeusArquivosImagens" component={MeusArquivosImagens} />
      <Stack.Screen name="MeusArquivosDocumentos" component={MeusArquivosDocumentos} />
      <Stack.Screen name="Relatorios" component={Relatorios} />
      <Stack.Screen name="User" component={User} />

      {/* Somente admins podem acessar */}
      {isUsuarioAdmin && (
        <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
      )}
    </Stack.Navigator>
  );
}
