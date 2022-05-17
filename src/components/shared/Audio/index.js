import {useEffect} from 'react';
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {Text, View} from 'react-native';

export const Audio = props => {
  useEffect(() => {
    if (!props.track) {
      return;
    }
    const setupAudioStream = async () => {
      // Set up the player
      await TrackPlayer.setupPlayer();

      // Add a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: props.track?.stream?.toURL(),
        title: 'Track Title',
        artist: 'Track Artist',
      });
      // Start playing it
      await TrackPlayer.play();
    };
    setupAudioStream();
  }, [props.track]);
  return <Text>"DDD"</Text>;
};
