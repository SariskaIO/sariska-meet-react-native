import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import BodyView from '../components/shared/BodyView';
import {addLocalTrack} from '../store/actions/track';
import {colors} from '../assets/styles/_colors';
import {SIZES} from '../assets/styles/font';
//import {SmallRaisedButton} from '../components/shared/SmallRaisedButton';
import {LobbyRoom} from '../components/home/LobbyRoom';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const resolution = useSelector(state => state.media?.resolution);
  const localTracksRedux = useSelector(state => state.localTrack);
  SariskaMediaTransport.initialize();
  SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
  console.log('resolution', resolution);
  const [localTracks, setLocalTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  //const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;
  const iAmRecorder = false;

  const Join = async meetingUrl => {
    navigation.navigate('Meeting', {meetingUrl});
  };

  useEffect(() => {
    if (localTracksRedux.length > 0) {
      return;
    }
    const createNewLocalTracks = async () => {
      const options = {
        devices: ['audio', 'video'],
        resolution,
      };
      let tracks = [];
      try {
        const [audioTrack] = await SariskaMediaTransport.createLocalTracks({
          devices: ['audio'],
          resolution,
        });
        tracks.push(audioTrack);
      } catch (e) {
        console.log('failed to fetch audio device', e);
      }
      try {
        const [videoTrack] = await SariskaMediaTransport.createLocalTracks({
          devices: ['video'],
          resolution,
        });
        tracks.push(videoTrack);
      } catch (e) {
        console.log('failed to fetch video device', e);
      }

      //const tracks = await SariskaMediaTransport.createLocalTracks(options);
      if (!iAmRecorder) {
        setLocalTracks(tracks);
      }
      tracks.forEach(track => dispatch(addLocalTrack(track)));
    };
    createNewLocalTracks();
  }, []);
  return (
    <BodyView>
      <View style={styles.root}>
        {/* <View style={styles.tabs}>
        <View style={styles.leftButton}>
            <SmallRaisedButton
              buttonText={'Social Login'}
              width={90}
              fontSize={16}
              backgroundColor={colors.primaryBackground}
            />
          </View>
          <SmallRaisedButton
            buttonText={'Continue without login'}
            width={170}
            fontSize={16}
            onPressHandler={() => navigation.navigate('Lobby')}
          />
        </View>
        </View> */}
        <LobbyRoom tracks={localTracks} />
      </View>
    </BodyView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.secondaryDarkBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.whiteText,
  },
});
