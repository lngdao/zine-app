import { SCREEN_NAME, TAB_NAME } from '@/config';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

export type RootStackParamList = {
  [SCREEN_NAME.Startup]: undefined;
  [TAB_NAME.Home]: undefined;
};

//-------------------------------------
// Navigation Props
//-------------------------------------

export type StartupScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Startup'
>;

export type HomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

//-------------------------------------
// Route Props
//-------------------------------------

export type StartupScreenRouteProps = RouteProp<RootStackParamList, 'Startup'>;

export type HomeScreenNavigationRouteProps = RouteProp<
  RootStackParamList,
  'Home'
>;
