import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function ReconnectDialog({open}) {
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.navigate('Home');
  };

  return (
    <View>
        <Text>
            You have disconnected, Please reconnect again.
          </Text>
    </View>
  );
}
