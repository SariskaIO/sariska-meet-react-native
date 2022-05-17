import React from 'react';
import {StyleSheet, View} from 'react-native';

const StyledView = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default StyledView;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: '100%',
  },
});
