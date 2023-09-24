import {React, useRef, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Lottie from 'lottie-react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Footer from '../components/footer';

export default function MemberMainPage({navigation}) {
  const data = [
    {
      id: 1,
      text: '수다떨기',
      src: require('../../assets/images/Counselling.png'),
      screen: 'Quiz', // 이동할 화면 이름
    },
    {
      id: 2,
      text: '상담',
      src: require('../../assets/animations/CounsellingAni.json'),
      screen: 'CounsellingPage',
    },
    {
      id: 3,
      text: '이야기 따라 말하기',
      src: require('../../assets/images/Counselling.png'),

      screen: 'StoryPage',
    },
    {
      id: 4,
      text: '끝말잇기',
      src: require('../../assets/images/Counselling.png'),

      screen: 'ConnectStart',
    },
  ];

  const handleCardClick = screenName => {
    navigation.navigate(screenName);
  };
  // const reference = useRef < Lottie > null;

  // useLayoutEffect(() => {
  //   (async () => {
  //     await wait(333);
  //     reference.current?.play();
  //   })();
  // }, []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.slide, {backgroundColor: item.backgroundColor}]}
      onPress={() => handleCardClick(item.screen)}>
      <Text>{item.text}</Text>
      <Lottie style={styles.Icon} source={item.src} autoPlay loop />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={300}
        itemWidth={200}
        loop={true}
        contentContainerCustomStyle={styles.carouselContentContainer}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: wp(100),
    height: hp(70),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: hp(10),
    right: wp(30),
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF1E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop: hp(5),
    width: wp('45%'),
    height: hp('15%'),
  },
  Icon: {
    width: 300,
    height: 200,
  },
});
