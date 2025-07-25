import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import TopBar from '../components/TopBar';

const HomeScreen = ({ navigation }) => {
 const categories = [
  'Life Skills',
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'React Native',
  'Data Science',
  'Machine Learning',
  'Web Development',
  'Motivation',
];

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <Text style={styles.title}>Home Screen</Text> */}
        <ImageCarousel />

         <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
      </ScrollView>

      {/* ✅ Pass navigation here */}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    // marginTop:10,
    // marginHorizontal:20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categories: {
    paddingVertical: 15,
    gap: 12, // space between buttons (Android support)
  },
  categoryButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
