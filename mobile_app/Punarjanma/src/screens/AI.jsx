import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import ChatbotButton from '../components/ChatbotButton';

const aiFeatures = [
  {
    title: 'Video Summarization',
    description: 'Get a concise summary of your videos powered by AI.',
  },
  {
    title: 'Video Translation',
    description: 'Translate videos into multiple languages seamlessly.',
  },
  {
    title: 'PDF Summary and Chat',
    description: 'Upload PDFs to get summaries and ask AI questions about them.',
  },
  {
    title: 'Quiz',
    description: 'Generate quizzes from your content using AI.',
  },
];

const Ai = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>AI Features</Text>

        <View style={styles.cardContainer}>
          {aiFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                // Add navigation to individual screens if needed
                // navigation.navigate(feature.route);
              }}
            >
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Try Now</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ChatbotButton onPress={() => navigation.navigate('Chatbot')} />
      <Footer navigation={navigation} />
      
    </SafeAreaView>
  );
};

export default Ai;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
