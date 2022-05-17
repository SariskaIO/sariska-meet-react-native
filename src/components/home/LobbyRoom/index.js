import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../../../assets/styles/_colors';
import {addThumbnailColor} from '../../../store/actions/color';
import {addConference} from '../../../store/actions/conference';
import {addConnection} from '../../../store/actions/connection';
import {setDisconnected} from '../../../store/actions/layout';
import {showNotification} from '../../../store/actions/notification';
import {
  setMeeting,
  setProfile,
  updateProfile,
} from '../../../store/actions/profile';
import {localTrackMutedChanged} from '../../../store/actions/track';
import {
  detectUpperCaseChar,
  getRandomColor,
  getToken,
  trimSpace,
} from '../../../utils';
import CustomText from '../../shared/CustomText';
import Logo from '../../shared/Logo';
import {JoinTrack} from '../JoinTrack';
import InputField from '../../shared/InputField';
import FancyButton from '../../shared/FancyButton';

export const LobbyRoom = ({tracks}) => {
  const navigation = useNavigation();
  const audioTrack = useSelector(state => state.localTrack).find(track =>
    track.isAudioTrack(),
  );
  const videoTrack = useSelector(state => state.localTrack).find(track =>
    track.isVideoTrack(),
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [name, setName] = useState('');
  const [buttonText, setButtonText] = useState('Start Meeting');
  const [accessDenied, setAccessDenied] = useState(false);
  const profile = useSelector(state => state.profile);
  const route = useRoute();
  const iAmRecorder = false;
  const testMode = false;
  const notification = useSelector(state => state.notification);
  const moderator = useRef(true);

  const handleTitleChange = value => {
    setMeetingTitle(trimSpace(value.toLowerCase()));
  };

  const handleUserNameChange = value => {
    setName(value);
    if (value.length === 1) {
      dispatch(updateProfile({key: 'color', value: getRandomColor()}));
    }
    if (!value) {
      dispatch(updateProfile({key: 'color', value: null}));
    }
  };

  const handleSubmit = async () => {
    if (!meetingTitle) {
      dispatch(
        showNotification({
          message: 'Meeting Title is required',
          severity: 'warning',
          autoHide: true,
        }),
      );
      return;
    }

    setLoading(true);
    let avatarColor = profile?.color ? profile?.color : getRandomColor();
    dispatch(updateProfile({key: 'color', value: avatarColor}));

    const token = await getToken(profile, name, avatarColor);
    console.log('token', token);
    const connection = new SariskaMediaTransport.JitsiConnection(
      token,
      meetingTitle,
      process.env.REACT_APP_ENV === 'development' ? true : false,
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
      () => {
        dispatch(addConnection(connection));
        createConference(connection);
      },
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_FAILED,
      async error => {
        console.log(' CONNECTION_DROPPED_ERROR', error);
        if (
          error === SariskaMediaTransport.errors.connection.PASSWORD_REQUIRED
        ) {
          const token = await getToken(profile, name, moderator.current);
          connection.setToken(token); // token expired, set a new token
        }
        if (
          error ===
          SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR
        ) {
          dispatch(setDisconnected('lost'));
        }
      },
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED,
      error => {
        console.log('connection disconnect!!!', error);
      },
    );

    connection.connect();
  };

  const createConference = async connection => {
    // const conference = connection.initJitsiConference({
    //   createVADProcessor: SariskaMediaTransport.effects.createRnnoiseProcessor,
    // });
    const conference = connection.initJitsiConference();
    await conference.addTrack(audioTrack);
    await conference.addTrack(videoTrack);

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_JOINED,
      () => {
        setLoading(false);
        dispatch(addConference(conference));
        dispatch(setProfile(conference.getLocalUser()));
        dispatch(setMeeting({meetingTitle}));
        dispatch(
          addThumbnailColor({
            participantId: conference?.myUserId(),
            color: profile?.color,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_ROLE_CHANGED,
      id => {
        if (conference.isModerator() && !testMode) {
          conference.enableLobby();
          navigation.navigate('Meeting', {meetingId: `/${meetingTitle}`});
        } else {
          navigation.navigate('Meeting', {meetingId: `/${meetingTitle}`});
        }
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_ERROR,
      () => {
        setLoading(false);
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_JOINED,
      id => {
        dispatch(
          addThumbnailColor({participantId: id, color: getRandomColor()}),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_FAILED,
      async error => {
        if (
          error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR
        ) {
          setButtonText('Asking to join');
          conference.joinLobby(name || conference?.getLocalUser()?.name);
        }

        if (
          error ===
          SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED
        ) {
          setAccessDenied(true);
          setButtonText('Join Meeting');
          setLoading(false);
          setTimeout(() => setAccessDenied(false), 2000);
        }
      },
    );
    conference.join();
  };

  const unmuteAudioLocalTrack = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteAudioLocalTrack = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteVideoLocalTrack = async () => {
    await videoTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteVideoLocalTrack = async () => {
    await videoTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  if (iAmRecorder && !meetingTitle) {
    setName('recorder');
    setMeetingTitle(route.params?.meetingId);
  }

  useEffect(() => {
    if (meetingTitle && (testMode || iAmRecorder)) {
      handleSubmit();
    }
  }, [meetingTitle]);

  useEffect(() => {
    if (route.params?.meetingId) {
      setButtonText('Join Meeting');
      setMeetingTitle(route.params?.meetingId);
    }
    setName(profile.name);
  }, [profile?.name]);

  return (
    <View style={styles.root}>
      <JoinTrack tracks={tracks} name={name} />
      <View style={styles.videoContainer}>
        <View>
          <Logo height={80} />
        </View>
        <View style={styles.headerContainer}>
          {route.params?.meetingId ? (
            <CustomText>
              <Text style={styles.headerJoin}>
                Join {route.params?.meetingId}
              </Text>
            </CustomText>
          ) : (
            <CustomText>
              <Text style={styles.header}>Create Meeting</Text>
            </CustomText>
          )}
        </View>
        <View
          style={
            !route.params?.meetingId
              ? styles.permissions
              : styles.joinPermissions
          }>
          {audioTrack?.isMuted() ? (
            <Ionicon
              name="mic-off-outline"
              style={styles.audioIcon}
              onPress={unmuteAudioLocalTrack}
            />
          ) : (
            <Ionicon
              name="mic-outline"
              style={styles.audioIcon}
              onPress={muteAudioLocalTrack}
            />
          )}
          {videoTrack?.isMuted() ? (
            <Feather
              name="video-off"
              style={styles.audioIcon}
              onPress={unmuteVideoLocalTrack}
            />
          ) : (
            <Feather
              name="video"
              style={styles.audioIcon}
              onPress={muteVideoLocalTrack}
            />
          )}
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.wrapper}>
            <View style={styles.textBox}>
              {!route.params?.meetingId ? (
                <InputField
                  onKeyPress={e => {
                    if (e.nativeEvent.key === ' ') {
                      dispatch(
                        showNotification({
                          message: 'Space is not allowed',
                          severity: 'warning',
                          autoHide: true,
                        }),
                      );
                    } else if (detectUpperCaseChar(e.nativeEvent.key)) {
                      dispatch(
                        showNotification({
                          message: 'Capital Letter is not allowed',
                          severity: 'warning',
                          autoHide: true,
                        }),
                      );
                    }
                  }}
                  label="Meeting Title"
                  value={meetingTitle}
                  onChangeText={handleTitleChange}
                  onSubmitEditing={handleSubmit}
                  placeholder="Enter Meeting Title"
                  labelStyle={{color: colors.whiteText}}
                />
              ) : null}
              <InputField
                label="Username"
                value={name}
                onChange={handleUserNameChange}
                onSubmitEditing={handleSubmit}
                onKeyPress={handleSubmit}
                placeholder="Enter Username"
                labelStyle={{color: colors.whiteText}}
              />
            </View>
            <View style={styles.fancyContainer}>
              <FancyButton
                homeButton={true}
                disabled={loading}
                onClick={handleSubmit}
                buttonText={buttonText}
                type="clear"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  videoContainer: {
    height: 530,
    width: 350,
    backgroundColor: colors.boxShadowGray,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    color: colors.whiteText,
    fontSize: 24,
    paddingTop: 10,
  },
  headerJoin: {
    color: colors.whiteText,
    fontSize: 24,
    paddingTop: 10,
  },
  permissions: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
  },
  audioIcon: {
    padding: 12,
    borderRadius: 7.5,
    color: colors.whiteText,
    fontSize: 26,
  },
  joinPermissions: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 16,
  },
  fancyContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
