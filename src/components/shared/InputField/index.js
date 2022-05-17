import React from 'react';
import {Input} from 'react-native-elements';

const InputField = ({
  label,
  value,
  onChangeText,
  styles,
  selectionColor,
  inputStyle,
  labelStyle,
  placeholder,
  onSubmitEditing,
  onKeyPress,
}) => {
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={styles}
      selectionColor={selectionColor}
      inputStyle={inputStyle}
      //underlineColorAndroid="rgba(255,255,255, 1)"
      labelStyle={labelStyle}
      onKeyPress={onKeyPress}
      onSubmitEditing={onSubmitEditing}
      placeholder={placeholder}
    />
  );
};

export default InputField;
