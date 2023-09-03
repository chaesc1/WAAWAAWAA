import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <View style={styles.featureContainer}>
        <View style={styles.featureTitleContainer}>
          <Image
            source={require('../../assets/images/chatgptIcon.png')}
            style={styles.featureTitleIcon}
          />
          <Text style={styles.featureTitleText}>이야기 놀이하자!</Text>
        </View>
        <Text style={styles.featureDescription}>
          아무말 해봐! 이야기 지어줄게
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.featureTitleContainer}>
          {/* <Image
            source={require('../../assets/images/bot.png')}
            style={styles.featureTitleIcon}
          /> */}
          {/* <Text style={styles.featureTitleText}>너 먼저!</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureTitleContainer}>
          {/* <Image
            source={require('../../assets/images/chatgptIcon.png')}
            style={styles.featureTitleIcon}
          /> */}
          {/* <Text style={styles.featureTitleText}>나 먼저!</Text> */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    height: hp(80),
  },
  buttonContainer: {
    flexDirection: 'row', // 좌우로 배치
    justifyContent: 'space-between', // 요소 사이의 간격을 최대한 활용
    paddingHorizontal: wp(15), // 가로 여백
    marginTop: hp(30), // 위쪽 여백
  },
  heading: {
    fontSize: wp(6.5),
    fontWeight: 'bold',
    color: '#374151',
  },
  featureContainer: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  featureTitleContainer: {
    flexDirection: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitleIcon: {
    height: hp(4),
    width: hp(4),
    resizeMode: 'contain',
    marginRight: 4,
  },
  featureTitleText: {
    fontSize: wp(7.5),
    fontWeight: 'bold',
    color: '#374151',
  },
  featureDescription: {
    fontSize: wp(4.5),
    color: '#4B5563',
    fontWeight: 'normal',
    alignSelf: 'center',
  },
});
