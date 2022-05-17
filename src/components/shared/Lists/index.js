import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {SIZES} from '../../../assets/styles/font';
import {colors} from '../../../assets/styles/_colors';

export const Lists = ({list}) => {
  return (
    <View>
      {list.map((item, index) => (
        <ListItem
          key={index}
          style={styles.listItem}
          containerStyle={{
            paddingLeft: 0,
            marginLeft: 0,
            paddingRight: 0,
            marginRight: 0,
          }}>
          {item.icon && item.icon}
          {item.avatar_url && <Avatar source={item.avatar_url} />}
          {item.title && (
            <Avatar
              title={item.title}
              rounded
              size={'small'}
              overlayContainerStyle={{
                backgroundColor: colors.secondaryLightBackground,
              }}
            />
          )}
          <ListItem.Content>
            {item.primary && (
              <ListItem.Title style={styles.title}>
                {item.primary}
              </ListItem.Title>
            )}
            {item.secondary && (
              <ListItem.Subtitle style={styles.subTitle}>
                {item.secondary}
              </ListItem.Subtitle>
            )}
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontSize: SIZES.h6,
    color: colors.secondaryText,
  },
  subTitle: {
    fontWeight: '400',
    fontSize: SIZES.p4,
    color: colors.secondaryText,
  },
});
