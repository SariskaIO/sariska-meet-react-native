import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {showNotification} from '../../../store/actions/notification';
import Snackbar from 'react-native-snackbar';
import {colors} from '../../../assets/styles/_colors';

const SnackbarBox = ({notification}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    Snackbar.show({
      text: notification.message,
      duration: Snackbar.LENGTH_LONG,
      textColor: colors.whiteText,
      backgroundColor: colors.secondaryBackground,
    });
    if (!notification?.autoHide) {
      return;
    }
    setTimeout(() => {
      dispatch(
        showNotification({
          message: '',
          severity: 'warning',
          autoHide: true,
        }),
      );
    }, 2000);
  }, [notification?.message]);

  if (!notification?.message) {
    return null;
  }

  return null;
};

export default SnackbarBox;
