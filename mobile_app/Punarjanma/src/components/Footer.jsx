import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  HomeIcon,
  TicketIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import { colors } from '../theme/colors'; // Make sure this is correctly configured

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Home')}>
        <HomeIcon size={24} color={colors.primary} />
        <Text style={styles.iconText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('AI')}>
        <MagnifyingGlassIcon size={24} color={colors.primary} />
        <Text style={styles.iconText}>AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Courses')}>
        <TicketIcon size={24} color={colors.primary} />
        <Text style={styles.iconText}>Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Profile')}>
        <UserIcon size={24} color={colors.primary} />
        <Text style={styles.iconText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray50 || '#ccc',
    backgroundColor: colors.white || '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconGroup: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: colors.primary || '#4B0082',
    marginTop: 2,
  },
});
