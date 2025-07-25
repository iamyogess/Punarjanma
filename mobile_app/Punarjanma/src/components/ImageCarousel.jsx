import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

// 🔸 Import your local images here
const images = [
  require('../assets/images/1.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/3.jpg'),
  require('../assets/images/4.jpg'),
];

const ImageCarousel = () => {
    return (
        <View style={styles.carouselContainer}>
      <Carousel
        loop
        autoPlay
        width={width}
        height={220}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image source={item} 
          style={styles.image} 
          resizeMode="cover" />
        )}
        panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
        }}
        />
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    // marginVertical: 20,
  },
  image: {
    width: width ,
    height: 220,
    // borderRadius: 15,
  },
});

