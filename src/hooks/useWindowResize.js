import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ENTER_FULL_SCREEN_MODE,
  GRID,
  PRESENTATION,
  SPEAKER,
} from '../constants';

export function useWindowResize() {
  const layout = useSelector(state => state.layout);
  const remoteTracks = useSelector(state => state.remoteTrack);
  const conference = useSelector(state => state.conference);
  const window = useWindowDimensions();
  const [windowSize, setWindowSize] = useState({
    viewportWidth: undefined,
    viewportHeight: undefined,
  });

  function getDimensions(mode, type) {
    let documentWidth = Math.max(window.width || 0);
    let documentHeight = Math.max(window.height || 0);
    let viewportHeight, viewportWidth;

    if (mode === ENTER_FULL_SCREEN_MODE) {
      viewportHeight = documentHeight - 108;
      viewportWidth = documentWidth;
      return {viewportWidth, viewportHeight};
    }

    if (conference?.getParticipantCount() === 1 && type !== PRESENTATION) {
      return {
        viewportWidth: ((documentHeight - 92) * 16) / 9,
        viewportHeight: documentHeight - 92,
      };
    }

    if (type === GRID) {
      return {
        viewportWidth: documentWidth,
        viewportHeight: documentHeight - 92,
      };
    }

    viewportHeight = documentHeight - 92;
    viewportWidth = documentWidth - 218;
    return {viewportWidth, viewportHeight};
  }

  useEffect(() => {
    setWindowSize(getDimensions(layout.mode, layout.type));
    handleResize();
    return () => {
      handleResize();
    };
  }, [layout.mode]);

  useEffect(() => {
    setWindowSize(getDimensions(layout.mode, layout.type));
  }, [remoteTracks]);

  useEffect(() => {
    setWindowSize(getDimensions(layout.mode, layout.type));
  }, [layout.type]);

  function handleResize() {
    setWindowSize(getDimensions(layout.mode, layout.type));
  }

  useEffect(() => {
    handleResize();
    return () => handleResize();
  }, []);

  return windowSize;
}
