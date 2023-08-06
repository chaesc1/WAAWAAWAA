import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

function WordChainPageTablet({navigation, styles, array}) {
  return (
    <View
      style={[
        styles.container,
        {justifyContent: 'center', alignItems: 'center', gap: hp('5%')},
      ]}>
      <Text
        style={{fontSize: wp('5%'), fontWeight: 'bold', textAlign: 'center'}}>
        {array[0].content}
      </Text>
      <Image
        style={{width: wp('7%'), height: hp('17%')}}
        //source={require("../../assets/mic.png")}
      />
    </View>
  );
}

export default WordChainPageTablet;
