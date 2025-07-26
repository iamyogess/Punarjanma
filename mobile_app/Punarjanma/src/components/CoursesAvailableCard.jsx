import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const coursesAvailable = [
  {
    id: 1,
    title: 'Python Programming',
    description: 'Learn the basics of Python programming, from syntax to advanced topics.',
    duration: '6 weeks',
    image: { uri: 'https://www.python.org/static/community_logos/python-logo-master-v3-TM.png' },
 
  },
  {
    id: 2,
    title: 'Java Mastery',
    description: 'Become a Java expert with hands-on projects and deep concepts.',
    duration: '8 weeks',
    image: { uri: 'https://cdn-icons-png.flaticon.com/512/226/226777.png' },
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description: 'Understand the principles of modern design and user interaction.',
    duration: '4 weeks',
    image: { uri: 'https://cdn-icons-png.flaticon.com/512/888/888879.png' },
  },
];

const CoursesAvailableCard = ({ title, description, image, duration }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      <Text style={styles.duration}>⏱ {duration}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );
};

const CoursesAvailableList = () => {
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {coursesAvailable.map(course => (
        <CoursesAvailableCard
          key={course.id}
          title={course.title}
          description={course.description}
          image={course.image}
          duration={course.duration}
        />
      ))}
    </ScrollView>
  );
};

export default CoursesAvailableList;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
