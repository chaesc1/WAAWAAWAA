import React from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
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
          <Text style={styles.featureTitleText}>끝말잇기!!</Text>
        </View>
        <Text style={styles.featureDescription}>
          끝말잇기 하자!! 아무 단어나 말해봐!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    height: hp(80),
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
