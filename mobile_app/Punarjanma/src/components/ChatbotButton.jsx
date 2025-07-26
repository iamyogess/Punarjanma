import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ChatBubbleLeftRightIcon } from 'react-native-heroicons/outline'; // or any chat icon you prefer

const ChatbotButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <ChatBubbleLeftRightIcon size={24} color="white" />
    </TouchableOpacity>
  );
};

export default ChatbotButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 75,
    right: 20,
    backgroundColor: 'black', // nice purple/blue color
    width: 56,
    height: 56,
    borderRadius: 28, // makes it circular
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // shadow for android
    shadowColor: '#000', // shadow for ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});
