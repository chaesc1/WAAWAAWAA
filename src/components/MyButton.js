import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

const YourCustomMicrophoneButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {/* Add your microphone icon or custom UI here */}
      <Text>Microphone</Text>
    </TouchableOpacity>
  );
};

export default YourCustomMicrophoneButton;
