import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {colors} from '../../../assets/styles/_colors';
import {useDocumentSize} from '../../../hooks/useDocumentSize';
import {VideoBox} from '../../shared/VideoBox';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const JoinTrack = ({tracks, name}) => {
  const videoTrack = tracks.find(track => track && track.isVideoTrack());
  const {documentHeight, documentWidth} = useDocumentSize();
  const bgColor = useSelector(state => state.profile?.color);
  
  return (
    <View style={styles.localStream}>
      {videoTrack?.isMuted() ? (
        <View
          style={
            ({width: documentWidth, height: documentHeight}, styles.avatarBox)
          }>
          <Avatar
            containerStyle={
              ({
                fontSize: name && '125px',
                fontWeight: name && '100',
                backgroundColor: bgColor,
              },
              styles.avatar)
            }
            icon={!name && <Ionicon name="person-outline" color={'white'} style={{fontSize: 24}} />}
            title={name?.slice(0, 1).toUpperCase()}
          />
        </View>
      ) : (
        <View
          style={
            ({
              width: documentWidth,
              height: documentHeight,
              overflow: 'hidden',
              position: 'relative',
            },
            styles.videoWrapper)
          }>
          <VideoBox
            width={documentWidth}
            height={documentHeight}
            participantTracks={tracks}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    background: colors.secondaryDarkBackground,
    '& .widthAuto  video': {
      width: 'auto!important',
    },
    '& .heightAuto  video': {
      height: 'auto!important',
    },
  },
  avatarBox: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: '5',
  },
  avatar: {
    borderRadius: '50%',
    position: 'absolute',
    left: 'calc(70%/1.2)',
    top: 'calc(50vh - 96)',
    transition: 'box-shadow 0.3s ease',
    height: '200',
    width: '200',
    '& span': {
      fontSize: '150',
    },
  },
  videoWrapper: {
    '& > div': {
      borderRadius: 0,
    },
    '& .rightControls': {
      display: 'none',
    },
    '& .userDetails': {
      display: 'none',
    },
    '& .audioBox': {
      display: 'none',
    },
  },
});
