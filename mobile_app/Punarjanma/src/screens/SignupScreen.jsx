import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Create your new account</Text>
        </View>

        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={form.first_name}
          onChangeText={text => handleChange('first_name', text)}
        />

        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={form.last_name}
          onChangeText={text => handleChange('last_name', text)}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={form.email}
          onChangeText={text => handleChange('email', text)}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={[styles.input, { paddingRight: 40 }]}
            value={form.password}
            onChangeText={text => handleChange('password', text)}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon size={22} color="#555" />
            ) : (
              <EyeIcon size={22} color="#555" />
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={form.password_confirmation}
          onChangeText={text => handleChange('password_confirmation', text)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#4B0082" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footerText}>
          Already have an account?
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}
          >
            {' '}Login
          </Text>
        </Text>

        <Text style={styles.orText}>--------- or sign up using ---------</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#4B0082',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  linkText: {
    color: '#4B0082',
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: 'gray',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  googleButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
