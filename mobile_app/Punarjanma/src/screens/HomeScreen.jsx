import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import TopBar from '../components/TopBar';
import { colors } from '../theme/colors';
import CoursesAvailableCard from '../components/CoursesAvailableCard';
import ChatbotButton from '../components/ChatbotButton';
import ChatbotScreen from './ChatbotScreen';

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
        <CoursesAvailableCard />
        
      </ScrollView>
           {/* <ChatbotButton onPress={ChatbotScreen} /> */}
     <ChatbotButton onPress={() => navigation.navigate('Chatbot')} />

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
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categories: {
    paddingVertical: 20,
    gap: 4, 
  },
  categoryButton: {
    backgroundColor:'black',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 4,
  },
  categoryText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 12,
  },
});
