import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Bars3CenterLeftIcon} from 'react-native-heroicons/solid';
import * as Animatable from 'react-native-animatable';
import MenuCard from '../components/MenuCard';
import {categories, menuItems} from '../constants';
import Lottie from 'lottie-react-native';
import Footer from '../components/footer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <View style={styles.container}>
      <Image
        blurRadius={40}
        source={require('../../assets/images/Background_2.png')}
        style={styles.backgroundImage}
      />
      <SafeAreaView style={styles.flex1}>
        {/* 상단 3단 메뉴바 제작 예정? */}
        <View style={styles.topButtonsContainer}>
          <View style={styles.iconContainer}>
            <Bars3CenterLeftIcon size={25} stroke={100} color="black" />
          </View>
          <View style={styles.transparentBackground}></View>
        </View>

        {/* 상단 카테고리 스크롤 뷰 */}
        <ScrollView
          style={styles.categoriesScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}>
          {categories.map((category, index) => {
            let isActive = category == activeCategory;
            let textStyle = isActive
              ? styles.activeCategoryText
              : styles.categoryText;
            return (
              <Animatable.View
                key={index}
                delay={index * 120}
                animation="slideInDown">
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => setActiveCategory(category)}>
                  <Text style={textStyle}>{category}</Text>
                  {isActive ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={require('../../assets/images/line.png')}
                        style={styles.lineImage}
                      />
                    </View>
                  ) : null}
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </ScrollView>

        {/* food cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.foodCardsScroll}>
          {menuItems.map((item, index) => (
            <MenuCard item={item} index={index} key={index} />
          ))}
        </ScrollView>
      </SafeAreaView>
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  flex1: {
    flex: 1,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
  },
  iconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    padding: 0,
    right: wp(2),
  },
  transparentBackground: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 3,
    borderRadius: 20,
  },
  categoriesScroll: {
    marginTop: hp(3),
    paddingTop: hp(3),
    maxHeight: hp(10),
  },
  categoriesScrollContainer: {
    alignContent: 'center',
    paddingHorizontal: wp(10),
  },
  categoryButton: {
    marginRight: wp(22.5),
  },
  categoryText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activeCategoryText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  foodCardsScroll: {
    paddingHorizontal: wp(5),
  },
});
