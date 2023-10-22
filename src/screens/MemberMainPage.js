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
        source={require('../../assets/images/simple.jpg')}
        style={styles.backgroundImage}
      />
      <SafeAreaView style={styles.flex1}>
        <Footer />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#61BFAD',
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
  categoryButton: {
    marginRight: wp(22.5),
  },
  categoryText: {
    color: '#F9F8E8',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activeCategoryText: {
    color: '#F9F8E8',
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
    alignItems: 'center',
  },
});
