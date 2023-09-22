import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Footer from '../components/footer';

export default function MemberMainPage({navigation}) {
  const data = [
    {
      id: 1,
      text: '수다떨기',
      backgroundColor: 'red',
      screen: 'Quiz', // 이동할 화면 이름
    },
    {
      id: 2,
      text: '상담',
      backgroundColor: 'blue',
      screen: 'CounsellingPage',
    },
    {
      id: 3,
      text: '이야기 따라 말하기',
      backgroundColor: 'green',
      screen: 'StoryPage',
    },
    {
      id: 4,
      text: '끝말잇기',
      backgroundColor: 'yellow',
      screen: 'ConnectStart',
    },
  ];

  const handleCardClick = screenName => {
    navigation.navigate(screenName);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.slide, {backgroundColor: item.backgroundColor}]}
      onPress={() => handleCardClick(item.screen)}>
      <Text>{item.text}</Text>
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
    width: 200,
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3E99F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
