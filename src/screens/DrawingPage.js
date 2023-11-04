import React, {useCallback, useRef, useEffect} from 'react';
import {
  findNodeHandle,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
} from 'react-native';
import {Clear, Save} from '../../assets/images';
import PencilKitView from './pencilKitView';

const App = () => {
  const drawingRef = useRef(null);
  // Add the below code to call the native method
  // `setupToolPicker` after 200ms the component is mounted
  useEffect(() => {
    setTimeout(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(drawingRef?.current),
        UIManager.getViewManagerConfig('PencilKit').Commands.setupToolPicker,
        undefined,
      );
    }, 200);
  }, []);

  const handleClearDrawing = useCallback(() => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(drawingRef?.current),
      UIManager.getViewManagerConfig('PencilKit').Commands.clearDrawing,
      undefined, // 문자열 명령을 사용
    );
  }, [drawingRef?.current]);

  const handleCaptureDrawing = useCallback(() => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(drawingRef?.current),
      'captureDrawing', // 문자열 명령을 사용
      undefined,
    );
  }, [drawingRef?.current]);
  const handleUndo = useCallback(() => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(drawingRef?.current),
      UIManager.getViewManagerConfig('PencilKit').Commands.undo,
      undefined,
    );
  }, []);

  const handleRedo = useCallback(() => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(drawingRef?.current),
      UIManager.getViewManagerConfig('PencilKit').Commands.redo,
      undefined,
    );
  }, []);
  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Text style={styles.text}>{'We only support iOS For Now 😔'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PencilKitView ref={drawingRef} style={styles.container} />
      <Pressable onPress={handleClearDrawing} style={styles.clearBtn}>
        <Image source={Clear} resizeMode={'contain'} style={styles.icon} />
      </Pressable>
      <Pressable onPress={handleCaptureDrawing} style={styles.saveBtn}>
        <Image source={Save} resizeMode={'contain'} style={styles.icon} />
      </Pressable>
      <TouchableOpacity onPress={handleUndo} style={styles.undo}>
        <Text style={styles.undoRedoText}>{'Undo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRedo} style={styles.redo}>
        <Text style={styles.undoRedoText}>{'Redo'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    height: 50,
    width: 50,
  },
  clearBtn: {
    position: 'absolute',
    top: 50,
    right: 24,
  },
  saveBtn: {
    position: 'absolute',
    top: 120,
    right: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
  },
  undoRedoText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 32,
    color: '#fff',
    letterSpacing: 1.6,
  },
  undo: {
    position: 'absolute',
    backgroundColor: '#0004',
    top: 50,
    left: 14,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  redo: {
    position: 'absolute',
    backgroundColor: '#0004',
    top: 50,
    left: 120,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});

export default App;
