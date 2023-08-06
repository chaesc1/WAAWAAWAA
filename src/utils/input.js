import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const Input = props => {
  return <TextInput {...props} style={styles.input} />;
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 17,
    padding: 5,
    marginTop: 30,
  },
});

export default Input;