import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {colors} from '../../../assets/styles/_colors';

const FancyButton = ({
  disabled,
  onClick,
  buttonText,
  width,
  top,
  homeButton,
  type,
}) => {
  return (
    <Button
      containerStyle={styles.container}
      titleStyle={styles.title}
      disabled={disabled}
      onPress={onClick}
      title={buttonText}
      type={type}
    />
  );
};

export default FancyButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.primaryLightBorder,
    borderStyle: 'solid',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 10,
    textTransform: 'capitalize',
    marginTop: 10,
    width: 178,
  },
  title: {
    color: colors.whiteText,
  },
});
