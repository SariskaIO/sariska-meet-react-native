import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import { RTCView } from 'react-native-webrtc';

export const Video = props => {
  const window = useWindowDimensions();
  const {track, isPresenter, borderRadius, width, height, left} = props;
  // const videoElementRef = useRef(null);
  // useEffect(() => {
  //   track?.attach(videoElementRef.current);
  // }, [track]);

  // if (!track) {
  //   return null;
  // }

  return (
    <RTCView streamURL={props?.track?.stream?.toURL()} mirror={true} style={{width: window.width, height: '100%', display: 'flex', padding: 0, margin: 0,}} />
    // <video
    //   playsInline="1"
    //   autoPlay="1"
    //   ref={videoElementRef}
    //   style={
    //     ({
    //       left: '-1',
    //       top: '-1',
    //       position: props.position || 'absolute',
    //       width: 'calc(100% + 2)',
    //       height: props.height || 'calc(100% + 2)',
    //       objectFit: 'contain',
    //       borderRadius: '8',
    //     },
    //     !isPresenter && styles.video)
    //   }
    // />
  );
};

const styles = StyleSheet.create({
  video: {
        display: 'flex',
        height: 250,
        width: 200,
        //backgroundColor: 'white',
  },
});
