import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Logo = ({width, height}) => {
  const styles = StyleSheet.create({
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      width: '100%',
    },
    logoImage: {
      width: 80,
      height: 80,
    },
  });

  return (
    <View style={styles.logo}>
      <Image
        source={require('../../../assets/images/Logo_Full.png')}
        alt="logo"
        style={styles.logoImage}
      />
    </View>
  );
};

export default Logo;
