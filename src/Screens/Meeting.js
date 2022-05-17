import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {useOnlineStatus} from '../hooks/useOnlineStatus';
import {colors} from '../assets/styles/_colors';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import {showNotification} from '../store/actions/notification';
import {
  setModerator,
  setPinParticipant,
  setPresenter,
  setRaiseHand,
  setUserResolution,
} from '../store/actions/layout';
import {
  addRemoteTrack,
  participantLeft,
  remoteTrackMutedChanged,
  removeRemoteTrack,
} from '../store/actions/track';
import {addSubtitle} from '../store/actions/subtitle';
import {addMessage} from '../store/actions/message';
import {getUserById, preloadIframes} from '../utils';
import {unreadMessage} from '../store/actions/chat';
import {setAudioLevel} from '../store/actions/audioIndicator';
import SnackbarBox from '../components/shared/Snackbar';

const Meeting = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const localTracks = useSelector(state => state.localTrack);
  const conference = useSelector(state => state.conference);
  const connection = useSelector(state => state.connection);
  const layout = useSelector(state => state.layout);
  const notification = useSelector(state => state.notification);
  const snackbar = useSelector(state => state.snackbar);
  const isOnline = useOnlineStatus();
  const resolution = useSelector(state => state.media?.resolution);
  const [dominantSpeakerId, setDominantSpeakerId] = useState(null);
  const [lobbyUser, setLobbyUser] = useState([]);

  const styles = StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'column',
      background: colors.secondaryDark,
      flex: 1,
    },
  });

  let ingoreFirstEvent = true;

  const allowLobbyAccess = userId => {
    conference.lobbyApproveAccess(userId);
    setLobbyUser(lobbyUser => lobbyUser.filter(item => item.id !== userId));
  };

  const denyLobbyAccess = userId => {
    conference.lobbyDenyAccess(userId);
    setLobbyUser(lobbyUser => lobbyUser.filter(item => item.id !== userId));
  };

  const deviceListChanged = async devices => {
    // const [audioTrack, videoTrack] = localTracks;
    // const options = {
    //     devices: ["audio", "video"],
    //     resolution
    // };
    // const [newAudioTrack, newVideoTrack] = await SariskaMediaTransport.createLocalTracks(options);
    // await conference.replaceTrack(audioTrack, newAudioTrack);
    // await conference.replaceTrack(videoTrack, newVideoTrack);
    // dispatch(updateLocalTrack(audioTrack, newAudioTrack));
    // dispatch(updateLocalTrack(videoTrack, newVideoTrack));
  };

  const audioOutputDeviceChanged = deviceId => {
    //  console.log("audio output deviceId", deviceId);
    //  SariskaMediaTransport.mediaDevices.setAudioOutputDevice(deviceId);
  };

  const destroy = async () => {
    if (conference?.isJoined()) {
      await conference?.leave();
    }
    for (const track of localTracks) {
      await track.dispose();
    }
    await connection?.disconnect();
    SariskaMediaTransport.mediaDevices.removeEventListener(
      SariskaMediaTransport.mediaDevices.DEVICE_LIST_CHANGED,
      deviceListChanged,
    );
  };

  useEffect(() => {
    if (!conference) {
      return;
    }

    conference.getParticipantsWithoutHidden().forEach(item => {
      if (item._properties?.presenting === 'start') {
        dispatch(
          showNotification({
            autoHide: true,
            message: `Screen sharing is being presenting by ${item._identity?.user?.name}`,
          }),
        );
        dispatch(setPresenter({participantId: item._id, presenter: true}));
      }

      if (item._properties?.handraise === 'start') {
        dispatch(setRaiseHand({participantId: item._id, raiseHand: true}));
      }

      if (item._properties?.isModerator === 'true') {
        dispatch(setModerator({participantId: item._id, isModerator: true}));
      }

      if (item._properties?.resolution) {
        dispatch(
          setUserResolution({
            participantId: item._id,
            resolution: item._properties?.resolution,
          }),
        );
      }
    });

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_REMOVED,
      track => {
        dispatch(removeRemoteTrack(track));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_ADDED,
      track => {
        if (track.isLocal()) {
          return;
        }
        dispatch(addRemoteTrack(track));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.FACIAL_EXPRESSION_ADDED,
      expression => {
        console.log('FACIAL_EXPRESSION_ADDED', expression);
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.SUBTITLES_RECEIVED,
      (id, name, text) => {
        dispatch(addSubtitle({name, text}));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_MUTE_CHANGED,
      track => {
        dispatch(remoteTrackMutedChanged());
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.DOMINANT_SPEAKER_CHANGED,
      id => {
        console.log(
          'dominant speaker',
          conference.participants[id]?._identity?.user?.name,
          id,
        );
        setDominantSpeakerId(id);
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED,
      (participant, key, oldValue, newValue) => {
        if (key === 'presenting' && newValue === 'start') {
          dispatch(
            showNotification({
              autoHide: true,
              message: `Screen sharing started by ${participant._identity?.user?.name}`,
            }),
          );
          dispatch(
            setPresenter({participantId: participant._id, presenter: true}),
          );
        }

        if (key === 'presenting' && newValue === 'stop') {
          dispatch(
            setPresenter({participantId: participant._id, presenter: false}),
          );
        }

        if (key === 'handraise' && newValue === 'start') {
          dispatch(
            setRaiseHand({participantId: participant._id, raiseHand: true}),
          );
        }

        if (key === 'handraise' && newValue === 'stop') {
          dispatch(
            setRaiseHand({participantId: participant._id, raiseHand: false}),
          );
        }

        if (key === 'isModerator' && newValue === 'true') {
          dispatch(
            setModerator({participantId: participant._id, isModerator: true}),
          );
        }

        if (key === 'resolution') {
          dispatch(
            setUserResolution({
              participantId: participant._id,
              resolution: newValue,
            }),
          );
        }
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_LEFT,
      id => {
        if (id === dominantSpeakerId) {
          setDominantSpeakerId(null);
        }

        if (id === layout.pinnedParticipantId) {
          dispatch(setPinParticipant(null));
        }

        if (layout.presenterParticipantIds.find(item => item === id)) {
          dispatch(setPresenter({participantId: id, presenter: null}));
        }

        if (layout.raisedHandParticipantIds[id]) {
          dispatch(setRaiseHand({participantId: id, raiseHand: null}));
        }

        dispatch(participantLeft(id));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.LOBBY_USER_JOINED,
      (id, displayName) => {
        // new Audio(
        //   'https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg',
        // ).play();
        setLobbyUser(lobbyUser => [...lobbyUser, {id, displayName}]);
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.NOISY_MIC,
      () => {
        dispatch(
          showNotification({
            autoHide: true,
            message: 'Your mic seems to be noisy',
            severity: 'info',
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TALK_WHILE_MUTED,
      () => {
        dispatch(
          showNotification({
            autoHide: true,
            message: 'Trying to speak?  your are muted!!!',
            severity: 'info',
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.NO_AUDIO_INPUT,
      () => {
        dispatch(
          showNotification({
            autoHide: true,
            message: 'Looks like device has no audio input',
            severity: 'warning',
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (participantId, audioLevel) => {
        dispatch(setAudioLevel({participantId, audioLevel}));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONNECTION_INTERRUPTED,
      () => {
        dispatch(
          showNotification({
            message:
              'You lost your internet connection. Trying to reconnect...',
            severity: 'info',
          }),
        );
        ingoreFirstEvent = false;
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED,
      async (participant, data) => {
        if (
          data.event === 'LOBBY-ACCESS-GRANTED' ||
          data.event === 'LOBBY-ACCESS-DENIED'
        ) {
          setLobbyUser(lobbyUser =>
            lobbyUser.filter(item => item.displayName !== data.name),
          );
        }
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONNECTION_RESTORED,
      () => {
        if (ingoreFirstEvent) {
          return;
        }
        dispatch(
          showNotification({
            message: 'Your Internet connection was restored',
            autoHide: true,
            severity: 'info',
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.KICKED,
      id => {
        // if a user kicked by moderator
        // kicked participant id
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.PARTICIPANT_KICKED,
      (actorParticipant, kickedParticipant, reason) => {},
    );

    preloadIframes(conference);
    // SariskaMediaTransport.effects.createRnnoiseProcessor();
    SariskaMediaTransport.mediaDevices.addEventListener(
      SariskaMediaTransport.events.mediaDevices.DEVICE_LIST_CHANGED,
      deviceListChanged,
    );
    SariskaMediaTransport.mediaDevices.addEventListener(
      SariskaMediaTransport.events.mediaDevices.AUDIO_OUTPUT_DEVICE_CHANGED,
      audioOutputDeviceChanged,
    );

    window.addEventListener('beforeunload', destroy);

    return () => {
      destroy();
    };
  }, [conference]);

  useEffect(() => {
    SariskaMediaTransport.setNetworkInfo({isOnline});
  }, [isOnline]);

  if (!conference || !conference.isJoined()) {
    navigation.navigate('Home');
  }

  let justifyContent = 'space-between';
  let paddingTop = 16;

  return (
    <View style={{justifyContent, paddingTop: paddingTop}} styles={style.root}>
      {/* {layout.type === GRID && (
        // <GridLayout dominantSpeakerId={dominantSpeakerId} />
      )}
      {layout.type === PRESENTATION && (
        // <PresentationLayout dominantSpeakerId={dominantSpeakerId} />
      )} */}
      {/* <ActionButtons dominantSpeakerId={dominantSpeakerId} /> */}
      {/* {lobbyUser.map(item => (
        <PermissionDialog
          denyLobbyAccess={denyLobbyAccess}
          allowLobbyAccess={allowLobbyAccess}
          userId={item.id}
          displayName={item.displayName}
        />
      ))} */}
      <SnackbarBox notification={notification} />
      {/* <ReconnectDialog open={layout.disconnected === 'lost'} /> */}
    
    </View>
  );
};

export default Meeting;
