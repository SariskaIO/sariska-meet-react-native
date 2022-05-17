import React from 'react';
import Snackbar from 'react-native-snackbar';

const SnackbarBox = ({notification}) => {
  if (!notification?.message) {
    return null;
  }
  return (
    <>
      {Snackbar.show({
        text: notification?.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: notification?.background,
      })}
    </>
  );
};

export default SnackbarBox;
