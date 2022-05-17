import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {MenuProvider} from 'react-native-popup-menu';
import {Home} from './src/Screens/Home';
import Meeting from './src/Screens/Meeting';

// import ReactGA from 'react-ga4';
// ReactGA.initialize('G-R8QNV9RCFF');
// ReactGA.send('pageview');

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MenuProvider style={{flexDirection: 'column'}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Meeting"
            component={Meeting}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="Meeting"
            component={Meeting}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Leave"
            component={Leave}
            options={{headerShown: false}}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
