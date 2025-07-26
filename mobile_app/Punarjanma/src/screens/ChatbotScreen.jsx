import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot reply after delay
    setTimeout(() => {
      const botReply = generateBotReply(userMessage.text);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: botReply, sender: 'bot' },
      ]);
    }, 1000);
  };

  // Simple bot logic (you can replace with API calls)
  const generateBotReply = (userText) => {
    const lower = userText.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hi there! How can I assist you?';
    } else if (lower.includes('help')) {
      return 'Sure! Please tell me what you need help with.';
    } else {
      return "Sorry, I'm still learning. Can you rephrase?";
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (flatListRef.current && messages.length) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.botText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  botText: {
    color: '#111',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
