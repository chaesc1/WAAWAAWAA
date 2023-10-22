import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {CursorArrowRaysIcon} from 'react-native-heroicons/solid';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Lottie from 'lottie-react-native';
const MenuCard = ({item, index}) => {
  const navigation = useNavigation();

  return (
    <Animatable.View
      delay={index * 300}
      animation="slideInLeft"
      duration={1000}
      style={styles.container}>
      <View>
        <Lottie source={item.image} style={styles.image} loop autoPlay />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.descText}>{item.desc}</Text>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate(item.link)}
          style={styles.iconContainer}>
          <CursorArrowRaysIcon size={wp('7%')} color="black" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('65%'),
    height: hp('60%'),
    marginVertical: hp('10%'),
    marginRight: wp('3%'),
    padding: wp('3%'),
    paddingTop: hp('4%'),
    borderRadius: hp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  image: {
    width: 150,
    height: 200,
  },
  textContainer: {
    flex: 1,
    gap: 10,
    marginTop: hp('2%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
  },
  titleText: {
    fontSize: wp('7%'),
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    // color: '#F9F7E9',
  },
  descText: {
    fontSize: hp('1.8%'),
    textAlign: 'center',
    color: '#000',
    // color: '#F9F7E9',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('1%'),
    marginTop: hp('2%'),
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: wp('3%'),
    borderRadius: hp('2%'),
  },
});

export default MenuCard;
