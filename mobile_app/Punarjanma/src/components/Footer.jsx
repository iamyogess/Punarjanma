import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  HomeIcon,
  CpuChipIcon,
  UserIcon,
   BookOpenIcon,
} from 'react-native-heroicons/outline';
import { colors } from '../theme/colors'; // Make sure this is correctly configured

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Home')}>
        <HomeIcon size={24} color={'black'} />
        <Text style={styles.iconText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('AI')}>
        <CpuChipIcon size={24} color={'black'} />
        <Text style={styles.iconText}>AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Courses')}>
        <BookOpenIcon size={24} color={'black'} />
        <Text style={styles.iconText}>Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconGroup} onPress={() => navigation.navigate('Profile')}>
        <UserIcon size={24} color={'black'} />
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
    borderTopColor: colors.gray50,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconGroup: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: 'black',
    marginTop: 2,
    fontWeight: '600'
  },
});
