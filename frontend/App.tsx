import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import {TailwindProvider, useTailwind} from 'tailwind-rn';
import LoginScreen from './Screens/LoginScreen';
import utilities from './tailwind.json';
import { Provider } from 'react-redux';
import store from './Store/Store';
import RegisterScreen from './Screens/RegisterScreen';
import ChangePasswordScreen from './Screens/ChangePasswordScreen';
import HomeScreen from './Screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './Navigators/MainStack';







export default function App() {
 
  return (
  //@ts-ignore - TailwindProvider is missing a type definition
    <TailwindProvider utilities={utilities}>
      <Provider store={store}>
        <StatusBar style="auto" />

		  {/* <LoginScreen></LoginScreen> */}
      {/* <RegisterScreen></RegisterScreen> */}
      {/* <ChangePasswordScreen></ChangePasswordScreen> */}
     
      <NavigationContainer>
        <MainStack></MainStack>
      </NavigationContainer>
      </Provider>
     
	</TailwindProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
