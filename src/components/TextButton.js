import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

export default ({style, textStyle, text, onPress}) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
  >
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);
