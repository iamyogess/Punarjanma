import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';
import CoursesAvailableList from '../components/CoursesAvailableCard';
import ChatbotButton from '../components/ChatbotButton';

const Courses = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Courses</Text>
      <CoursesAvailableList />
      </ScrollView>
      {/* <ChatbotButton /> */}
      <ChatbotButton onPress={() => navigation.navigate('Chatbot')} />

      <Footer navigation={navigation} />
     
    </SafeAreaView>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    // padding: 16,
    paddingBottom: 40, // space for footer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f3f3f3',
    // padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
  },
});
