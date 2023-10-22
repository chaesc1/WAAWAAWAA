import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isTokenAvailable from '../utils/isTokenAvailable';
import Icon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Footer = ({}) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const userId = AsyncStorage.getItem('userId');
    await AsyncStorage.clear();
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            fontSize: wp('7%'),
            fontWeight: 'bold',
            color: '#000',
            // color: 'rgba(255, 255, 255, 0.8)',
          }}>
          🥁 게임 선택하기
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
          <View style={styles.tabBarButton}>
            <Image
              tintColor="#000"
              // tintColor="rgba(255, 255, 255, 0.8)"
              source={require('../../assets/images/person.png')}
              style={styles.characterIcon}
              autoPlay
              loop
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    padding: 5,
    zIndex: 1000,
    marginBottom: hp('-10%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'fit-content',
    width: wp('100%'),
    position: 'relative',
    top: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tabBarButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  tabBarText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#000',
    // color: 'rgba(255, 255, 255, 0.8)',
  },
  characterIcon: {
    width: wp('10%'),
    height: wp('10%'),
  },
});

export default Footer;
