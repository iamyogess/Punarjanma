import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BellIcon } from "react-native-heroicons/outline"; // 👈 Make sure heroicons is installed
import { colors } from '../theme/colors';

const TopBar = ({ username = "Aakash", onNotificationPress }) => {
  return (
    <View style={styles.container}>
      {/* Left Side: Profile + Welcome */}
      <View style={styles.leftSection}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }} // you can use user profile image URI
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{username}</Text>
        </View>
      </View>

      {/* Right Side: Notification */}
      <TouchableOpacity onPress={onNotificationPress}>
        <BellIcon size={26} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    // borderRadius:10,
    borderColor: colors.gray200,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
