import React from 'react';
import {Video} from '../Video';
import {Audio} from '../Audio';
//import PanTool from '@material-ui/icons/PanTool';
import {useDispatch, useSelector} from 'react-redux';
//import {setPinParticipant} from '../../../store/actions/layout';
//import PinParticipant from '../PinParticipant';
import {videoShadow, calculateSteamHeightAndExtraDiff} from '../../../utils';
//import AudioLevelIndicator from '../AudioIndicator';
//import SubTitle from '../SubTitle';
import {useDocumentSize} from '../../../hooks/useDocumentSize';
import {profile} from '../../../store/reducers/profile';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import CustomText from '../CustomText';
import {Avatar} from 'react-native-elements';
import {colors} from '../../../assets/styles/_colors';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const VideoBox = ({
  participantTracks,
  participantDetails,
  localUserId,
  width,
  height,
  isPresenter,
  isActiveSpeaker,
  isFilmstrip,
  isLargeVideo,
  isTranscription,
}) => {
  const videoTrack = isPresenter
    ? participantTracks.find(track => track.getVideoType() === 'desktop')
    : participantTracks.find(track => track.getType() === 'video');
  const audioTrack = participantTracks?.find(track => track?.isAudioTrack());
  //   const {pinnedParticipantId, raisedHandParticipantIds} = useSelector(
  //     state => state.layout,
  //   );

  const audioIndicator = useSelector(state => state.audioIndicator);
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  //const [visiblePinParticipant, setVisiblePinPartcipant] = useState(true);
  let audioLevel = audioIndicator[participantDetails?.id];
  //const subtitle = useSelector(state => state.subtitle);
  const conference = useSelector(state => state.conference);
  const {documentWidth, documentHeight} = useDocumentSize();
  //   const togglePinParticipant = id => {
  //     dispatch(setPinParticipant(id));
  //   };

  //   const borderActiveClasses = classnames(classes.root, {
  //     activeSpeaker: conference?.getParticipantCount() > 1 && isActiveSpeaker,
  //   });

  //   const audioIndicatorActiveClasses = classnames(classes.avatar, {
  //     largeVideo: isLargeVideo,
  //   });
  //   const avatarActiveClasses = classnames(classes.avatarBox);
  const {videoStreamHeight, videoStreamDiff} = calculateSteamHeightAndExtraDiff(
    width,
    height,
    documentWidth,
    documentHeight,
  );

  let avatarColor = participantDetails?.avatar || profile?.color;
  return (
    <View
      style={styles.root}
      //onMouseEnter={() => setVisiblePinPartcipant(true)}
      //onMouseLeave={() => setVisiblePinPartcipant(false)}
      //className={borderActiveClasses}
    >
      <View style={styles.audioBox}>
        {audioTrack?.isMuted() ? (
          <Ionicon
            name="mic-off-outline"
            color={'green'}
            style={{fontSize: 24}}
          />
        ) : (
          <Ionicon
            name="mic-outline"
            size={24}
            color={'green'}
            style={{fontSize: 24}}
          />
        )}
        {!audioTrack?.isLocal() && <Audio track={audioTrack} />}
      </View>
      {videoTrack?.isMuted() ? (
        <View style={{width: window.width, height: window.height},styles.avatarBox}>
          <Avatar
            source={null}
            title={participantDetails?.name.slice(0, 1).toUpperCase()}
            containerStyle={
              (isFilmstrip
                ? {boxShadow: videoShadow(audioLevel), background: avatarColor}
                : {background: avatarColor},
              styles.avatar)
            }
          />
        </View>
      ) : (
        <View
          style={{width: window.width, height: window.height}}
          // style={
          //   ({
          //     width: `${(videoStreamHeight * 16) / 9}`,
          //     height: `${videoStreamHeight}`,
          //     left: `-${videoStreamDiff / 2}`,
          //     position: 'absolute',
          //   },
          //   styles.videoWrapper)
          // }
        >
          <Video isPresenter={isPresenter} track={videoTrack} />
        </View>
      )}
      {/* <View className={classnames(classes.rightControls, {rightControls: true})  }>
                {visiblePinParticipant &&
                    <PinParticipant participantId={participantDetails?.id} pinnedParticipantId={pinnedParticipantId} togglePinParticipant={togglePinParticipant}/>
                }
                {raisedHandParticipantIds[participantDetails?.id] &&
                    <CustomText className={classes.handRaise} ><PanTool /></CustomText>
                }
            </View> */}
      <View style={styles.textBox}>
        <CustomText>
          {localUserId === participantDetails?.id
            ? 'You'
            : participantDetails?.name}
        </CustomText>
      </View>
      {/* {!isFilmstrip && (
        <View>
          <AudioLevelIndicator passedAudioLevel={audioLevel} />
        </View>
      )} */}
      {/* {isTranscription && subtitle.text && <View className={classes.subtitle}>
                <SubTitle subtitle={subtitle} />
            </View>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    background: '#272931',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    width: '100%',
    // transform: 'translateZ(0)',
    '& .largeVideo': {
      height: 160,
      width: 160,
      fontSize: '40',
    },
  },
  audioBox: {
    background: 'transparent',
    position: 'absolute',
    top: 50,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 8,
    color: 'green',
    '& svg': {
      background: colors.secondaryDark,
      borderRadius: 50,
      padding: '5',
    },
  },
  controls: {
    cursor: 'pointer',
    color: 'white',
    height: '20',
    width: '20',
    position: 'absolute',
    margin: 'auto',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textBox: {
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 8,
    color: colors.white,
    background: 'transparent',
    position: 'absolute',
    '& p': {
      padding: '4',
    },
  },
  avatarBox: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  avatar: {
    borderRadius: 50,
    position: 'absolute',
    transition: 'box-shadow 0.3s ease',
    height: 80,
    width: 80,
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: 8,
    right: 0,
  },
  handRaise: {
    marginLeft: '8',
    color: colors.primary,
    lineHeight: '0!important',
  },
  disable: {
    background: colors.red,
    borderColor: `${colors.red} !important`,
    '&:hover': {
      opacity: '0.8',
      background: `${colors.red} !important`,
    },
  },
  subtitle: {
    position: 'absolute',
    bottom: 0,
  },
  videoWrapper: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
  },
});
