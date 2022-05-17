import React from 'react';
import {StyleSheet, Text} from 'react-native';

const CustomText = ({children}) => {
  return <Text style={styles.text}>{children}</Text>;
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "'Montserrat', sans-serif",
  },
});
