import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {SIZES} from '../../../assets/styles/font';
import {colors} from '../../../assets/styles/_colors';

export const SmallRaisedButton = ({
  onPressHandler,
  buttonText,
  disabled,
  width,
  fontSize,
  backgroundColor,
}) => {
  const styles = StyleSheet.create({
    button: {
      textAlign: 'center',
      paddingVertical: SIZES.paddingXS,
      paddingHorizontal: SIZES.paddingSM,
      borderRadius: 30,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.grayBorder,
      backgroundColor: backgroundColor || colors.whiteBackground,
    },
    buttonPressed: {
      textAlign: 'center',
      paddingVertical: SIZES.paddingXS,
      paddingHorizontal: SIZES.paddingSM,
      borderRadius: 30,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      backgroundColor: colors.whiteBackground,
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: SIZES.buttonL,
      color: colors.primaryDarkText,
      //width: 250,
    },
    buttonTextPressed: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: SIZES.buttonL,
      color: colors.primaryText,
      //width: 250,
    },
  });

  return (
    <Pressable
      onPress={onPressHandler}
      style={({pressed}) => (pressed ? styles.buttonPressed : styles.button)}
      disabled={disabled}>
      {({pressed}) => (
        <Text
          style={[
            pressed ? styles.buttonTextPressed : styles.buttonText,
            {width, fontSize},
          ]}>
          {buttonText}
        </Text>
      )}
    </Pressable>
  );
};
