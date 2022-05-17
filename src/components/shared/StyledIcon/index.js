import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StyledIcon = ({name, styles, pressHandler}) => {
  return (
    <View>
        <Ionicons name={name} style={[styled.icon, styles]} onPress={pressHandler} />
      </View>
  )
}

export default StyledIcon;


const styled = StyleSheet.create({
    icon: {
      fontSize: 25,
      borderRadius: 40,
      padding: 15,
      marginRight: 10,
    },
  });
  