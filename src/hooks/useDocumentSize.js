import React, {useLayoutEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';

export function useDocumentSize() {
  const [documentSize, setDocumentSize] = useState({
    documentWidth: undefined,
    documentHeight: undefined,
  });
  const window = useWindowDimensions();

  function getDimensions() {
    let documentWidth = Math.max(window.width || 0);
    let documentHeight = Math.max(window.height || 0);
    return {documentWidth, documentHeight};
  }

  function handleResize() {
    setDocumentSize(getDimensions());
  }

  useLayoutEffect(() => {
    handleResize();
    return () => handleResize();
  }, []);

  return documentSize;
}
