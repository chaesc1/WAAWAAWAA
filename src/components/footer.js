import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
    navigation.navigate('LandingPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
        <View style={styles.tabBarButton}>
          <Lottie 
            source ={require('../../assets/animations/mypage.json')}
            style={styles.characterIcon}
            autoPlay
            loop
          />
          <Text style={styles.tabBarText}>My Page</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MemberMainPage')}>
        <View style={styles.tabBarButton}>
        <Icon name="grid-outline" size={wp('8.5%')} color="#000000" />
          <Text style={styles.tabBarText}>Main Menu</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.tabBarButton}>
          <Lottie 
            source ={require('../../assets/animations/logout.json')}
            style={styles.characterIcon}
            autoPlay
            loop
          />
          <Text style={styles.tabBarText}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: hp('7%'),
    width: wp('100%'),
    position: 'relative',
  },
  tabBarButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#000000',
  },
  characterIcon: {
    width: wp('10%'), // 캐릭터 이미지 크기 조정
    height: wp('10%'), // 캐릭터 이미지 크기 조정
  },
  
});

export default Footer;
